import 'package:flutter/foundation.dart';

/// The channel is recorded for audit only. Every channel uses the same engine.
enum OrderChannel { pos, kiosk, qr }

/// Inventory quantities are integer thousandths of the configured base unit.
/// Example: 1250 grams is stored as 1250000 milli-grams.
@immutable
class RecipeIngredient {
  const RecipeIngredient({
    required this.inventoryItemId,
    required this.quantityMicrosPerServing,
  }) : assert(quantityMicrosPerServing > 0);

  final String inventoryItemId;
  final int quantityMicrosPerServing;
}

@immutable
class InventoryRecipe {
  InventoryRecipe({
    required this.productId,
    required this.version,
    required List<RecipeIngredient> ingredients,
  }) : ingredients = List.unmodifiable(ingredients);

  final String productId;
  final int version;
  final List<RecipeIngredient> ingredients;
}

@immutable
class InventoryOrderLine {
  const InventoryOrderLine({
    required this.lineId,
    required this.productId,
    required this.quantity,
  }) : assert(quantity > 0);

  final String lineId;
  final String productId;
  final int quantity;
}

@immutable
class InventoryCookingOrder {
  InventoryCookingOrder({
    required this.orderId,
    required this.channel,
    required List<InventoryOrderLine> lines,
  }) : lines = List.unmodifiable(lines);

  final String orderId;
  final OrderChannel channel;
  final List<InventoryOrderLine> lines;
}

@immutable
class InventoryMovement {
  const InventoryMovement({
    required this.id,
    required this.orderId,
    required this.orderLineId,
    required this.productId,
    required this.inventoryItemId,
    required this.quantityMicros,
    required this.recipeVersion,
    required this.channel,
  });

  /// Stable movement key: orderId/lineId/itemId. Used for idempotency.
  final String id;
  final String orderId;
  final String orderLineId;
  final String productId;
  final String inventoryItemId;
  final int quantityMicros;
  final int recipeVersion;
  final OrderChannel channel;
}

@immutable
class InventoryState {
  InventoryState({
    required Map<String, int> onHandMicros,
    required Map<String, InventoryRecipe> recipes,
    Set<String> appliedMovementIds = const {},
    List<InventoryMovement> movements = const [],
    Set<String> cookedOrderIds = const {},
  })  : onHandMicros = Map.unmodifiable(onHandMicros),
        recipes = Map.unmodifiable(recipes),
        appliedMovementIds = Set.unmodifiable(appliedMovementIds),
        movements = List.unmodifiable(movements),
        cookedOrderIds = Set.unmodifiable(cookedOrderIds);

  /// On-hand quantity in integer micro-units; no floating point stock math.
  final Map<String, int> onHandMicros;
  final Map<String, InventoryRecipe> recipes;
  final Set<String> appliedMovementIds;
  final List<InventoryMovement> movements;
  final Set<String> cookedOrderIds;
}

class InsufficientInventoryException implements Exception {
  const InsufficientInventoryException(this.itemId, this.required, this.available);

  final String itemId;
  final int required;
  final int available;

  @override
  String toString() =>
      'Insufficient stock for $itemId: need $required micro-units, have $available.';
}

class MissingInventoryRecipeException implements Exception {
  const MissingInventoryRecipeException(this.productId);
  final String productId;

  @override
  String toString() => 'No inventory recipe configured for $productId.';
}

/// Single deduction path for POS, kiosk and QR orders.
///
/// Call only when KDS transitions an accepted order into "preparing".
/// Acceptance itself does not consume stock. The whole order is validated
/// before any quantity is changed, so a shortage cannot partially deduct.
class InventoryDeductionEngine {
  const InventoryDeductionEngine();

  InventoryState startCooking(
    InventoryState current,
    InventoryCookingOrder order,
  ) {
    if (current.cookedOrderIds.contains(order.orderId)) return current;

    final lineIds = <String>{};
    for (final line in order.lines) {
      if (!lineIds.add(line.lineId)) {
        throw ArgumentError.value(
          line.lineId,
          'order.lines',
          'Order line IDs must be unique within an order.',
        );
      }
    }

    final requiredByItem = <String, int>{};
    final pendingMovements = <InventoryMovement>[];

    for (final line in order.lines) {
      final recipe = current.recipes[line.productId];
      if (recipe == null) {
        throw MissingInventoryRecipeException(line.productId);
      }
      // Consolidate repeated recipe rows for the same stock item before
      // creating the idempotent movement for this order line.
      final lineRequirements = <String, int>{};
      for (final ingredient in recipe.ingredients) {
        lineRequirements.update(
          ingredient.inventoryItemId,
          (value) => value + ingredient.quantityMicrosPerServing,
          ifAbsent: () => ingredient.quantityMicrosPerServing,
        );
      }
      for (final entry in lineRequirements.entries) {
        final amount = entry.value * line.quantity;
        final movementId =
            '${order.orderId}/${line.lineId}/${entry.key}';
        if (current.appliedMovementIds.contains(movementId)) continue;
        requiredByItem.update(
          entry.key,
          (value) => value + amount,
          ifAbsent: () => amount,
        );
        pendingMovements.add(InventoryMovement(
          id: movementId,
          orderId: order.orderId,
          orderLineId: line.lineId,
          productId: line.productId,
          inventoryItemId: entry.key,
          quantityMicros: amount,
          recipeVersion: recipe.version,
          channel: order.channel,
        ));
      }
    }

    for (final entry in requiredByItem.entries) {
      final available = current.onHandMicros[entry.key] ?? 0;
      if (available < entry.value) {
        throw InsufficientInventoryException(entry.key, entry.value, available);
      }
    }

    final nextStock = Map<String, int>.from(current.onHandMicros);
    for (final entry in requiredByItem.entries) {
      nextStock[entry.key] = nextStock[entry.key]! - entry.value;
    }

    return InventoryState(
      onHandMicros: nextStock,
      recipes: current.recipes,
      appliedMovementIds: {
        ...current.appliedMovementIds,
        ...pendingMovements.map((movement) => movement.id),
      },
      movements: [...current.movements, ...pendingMovements],
      cookedOrderIds: {...current.cookedOrderIds, order.orderId},
    );
  }
}
