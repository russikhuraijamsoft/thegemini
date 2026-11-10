import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/features/inventory/domain/inventory_deduction_engine.dart';
import 'package:talkos/features/kitchen/domain/kitchen_workflow.dart';

void main() {
  const workflow = KitchenWorkflow();

  KitchenState state({int flour = 500000}) {
    final order = InventoryCookingOrder(
      orderId: 'K-100',
      channel: OrderChannel.pos,
      lines: const [
        InventoryOrderLine(
          lineId: 'line-1',
          productId: 'pancakes',
          quantity: 2,
        ),
      ],
    );
    return KitchenState(
      tickets: {'K-100': KitchenTicket(id: 'K-100', inventoryOrder: order)},
      inventory: InventoryState(
        onHandMicros: {'flour': flour},
        recipes: {
          'pancakes': InventoryRecipe(
            productId: 'pancakes',
            version: 2,
            ingredients: const [
              RecipeIngredient(
                inventoryItemId: 'flour',
                quantityMicrosPerServing: 100000,
              ),
            ],
          ),
        },
      ),
    );
  }

  test('deducts inventory only when an accepted ticket starts cooking', () {
    final accepted = state();
    expect(accepted.inventory.onHandMicros['flour'], 500000);

    final cooking = workflow.transition(
      accepted,
      orderId: 'K-100',
      to: KitchenTicketStatus.cooking,
    );

    expect(cooking.tickets['K-100']?.status, KitchenTicketStatus.cooking);
    expect(cooking.inventory.onHandMicros['flour'], 300000);
    expect(cooking.inventory.movements, hasLength(1));
    expect(cooking.inventory.movements.single.quantityMicros, 200000);
  });

  test('repeating the cooking transition does not deduct inventory twice', () {
    final accepted = state();
    final cooking = workflow.transition(
      accepted,
      orderId: 'K-100',
      to: KitchenTicketStatus.cooking,
    );

    final retried = workflow.transition(
      cooking,
      orderId: 'K-100',
      to: KitchenTicketStatus.cooking,
    );

    expect(retried, same(cooking));
    expect(retried.inventory.onHandMicros['flour'], 300000);
    expect(retried.inventory.movements, hasLength(1));
  });

  test('a stock shortage leaves the ticket accepted and inventory unchanged', () {
    final accepted = state(flour: 100000);

    expect(
      () => workflow.transition(
        accepted,
        orderId: 'K-100',
        to: KitchenTicketStatus.cooking,
      ),
      throwsA(isA<InsufficientInventoryException>()),
    );
    expect(accepted.tickets['K-100']?.status, KitchenTicketStatus.accepted);
    expect(accepted.inventory.onHandMicros['flour'], 100000);
    expect(accepted.inventory.movements, isEmpty);
  });

  test('rejects skipping the cooking and ready stages', () {
    final accepted = state();

    expect(
      () => workflow.transition(
        accepted,
        orderId: 'K-100',
        to: KitchenTicketStatus.ready,
      ),
      throwsStateError,
    );
    expect(accepted.inventory.onHandMicros['flour'], 500000);
  });

  test('requires a ticket ID to match its inventory order ID', () {
    final order = state().tickets['K-100']!.inventoryOrder;

    expect(
      () => KitchenTicket(id: 'different-id', inventoryOrder: order),
      throwsArgumentError,
    );
  });

  test('cancelling an accepted ticket does not consume stock', () {
    final accepted = state();
    final cancelled = workflow.transition(
      accepted,
      orderId: 'K-100',
      to: KitchenTicketStatus.cancelled,
    );

    expect(cancelled.tickets['K-100']?.status, KitchenTicketStatus.cancelled);
    expect(cancelled.inventory.onHandMicros['flour'], 500000);
    expect(cancelled.inventory.movements, isEmpty);
  });
}
