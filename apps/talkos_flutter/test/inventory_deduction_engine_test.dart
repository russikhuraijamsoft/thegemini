import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/features/inventory/domain/inventory_deduction_engine.dart';

void main() {
  const engine = InventoryDeductionEngine();

  InventoryState seed({int noodles = 500000, int chicken = 300000}) =>
      InventoryState(
        onHandMicros: {'noodles': noodles, 'chicken': chicken},
        recipes: {
          'chicken-chowmein': InventoryRecipe(
            productId: 'chicken-chowmein',
            version: 3,
            ingredients: const [
              RecipeIngredient(
                inventoryItemId: 'noodles',
                quantityMicrosPerServing: 150000,
              ),
              RecipeIngredient(
                inventoryItemId: 'chicken',
                quantityMicrosPerServing: 80000,
              ),
            ],
          ),
        },
      );

  InventoryCookingOrder order({
    String id = 'T-1001',
    OrderChannel channel = OrderChannel.pos,
    int quantity = 1,
  }) =>
      InventoryCookingOrder(
        orderId: id,
        channel: channel,
        lines: [
          InventoryOrderLine(
            lineId: 'line-1',
            productId: 'chicken-chowmein',
            quantity: quantity,
          ),
        ],
      );

  test('deducts recipe quantities when cooking starts', () {
    final result = engine.startCooking(seed(), order());
    expect(result.onHandMicros['noodles'], 350000);
    expect(result.onHandMicros['chicken'], 220000);
    expect(result.movements, hasLength(2));
    expect(result.movements.every((m) => m.channel == OrderChannel.pos), isTrue);
  });

  test('same cooking event cannot deduct twice', () {
    final first = engine.startCooking(seed(), order());
    final second = engine.startCooking(first, order());
    expect(second, same(first));
    expect(second.movements, hasLength(2));
  });

  test('kiosk and QR use exactly the same deduction path', () {
    for (final channel in [OrderChannel.kiosk, OrderChannel.qr]) {
      final result = engine.startCooking(seed(), order(channel: channel));
      expect(result.onHandMicros['noodles'], 350000);
      expect(result.movements.every((m) => m.channel == channel), isTrue);
    }
  });

  test('shortage rejects the entire order without partial deduction', () {
    final initial = seed(noodles: 100000, chicken: 300000);
    expect(
      () => engine.startCooking(initial, order()),
      throwsA(isA<InsufficientInventoryException>()),
    );
    expect(initial.onHandMicros['chicken'], 300000);
    expect(initial.movements, isEmpty);
  });


  test('combines repeated ingredient rows into one ledger movement', () {
    final initial = InventoryState(
      onHandMicros: {'noodles': 500000},
      recipes: {
        'chicken-chowmein': InventoryRecipe(
          productId: 'chicken-chowmein',
          version: 4,
          ingredients: const [
            RecipeIngredient(
              inventoryItemId: 'noodles',
              quantityMicrosPerServing: 100000,
            ),
            RecipeIngredient(
              inventoryItemId: 'noodles',
              quantityMicrosPerServing: 50000,
            ),
          ],
        ),
      },
    );
    final result = engine.startCooking(initial, order());
    expect(result.onHandMicros['noodles'], 350000);
    expect(result.movements, hasLength(1));
    expect(result.movements.single.quantityMicros, 150000);
  });

  test('missing recipe blocks cooking instead of silently skipping stock', () {
    final initial = InventoryState(
      onHandMicros: {'noodles': 500000},
      recipes: const {},
    );
    expect(
      () => engine.startCooking(initial, order()),
      throwsA(isA<MissingInventoryRecipeException>()),
    );
  });

  test('records recipe version and source channel for audit', () {
    final result = engine.startCooking(
      seed(),
      order(channel: OrderChannel.qr),
    );
    expect(result.movements.first.recipeVersion, 3);
    expect(result.movements.first.channel, OrderChannel.qr);
  });
}
