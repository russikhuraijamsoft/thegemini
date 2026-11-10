import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/features/inventory/domain/inventory_deduction_engine.dart';
import 'package:talkos/features/kitchen/domain/kitchen_workflow.dart';
import 'package:talkos/features/kitchen/presentation/kitchen_display_screen.dart';

void main() {
  KitchenState seed({int flour = 500000}) {
    final order = InventoryCookingOrder(
      orderId: 'K-200',
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
      branchId: 'br_main',
      tickets: {
        'K-200': KitchenTicket(
          id: 'K-200',
          branchId: 'br_main',
          inventoryOrder: order,
          tableLabel: 'Table 4',
          productNames: const {'pancakes': 'Pancakes'},
        ),
      },
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

  testWidgets('does not invent kitchen orders when no branch feed is connected', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: KitchenDisplayScreen()));

    expect(find.text('Kitchen orders not connected'), findsOneWidget);
    expect(find.text('Connect the authorised branch order feed to display live tickets.'), findsOneWidget);
    expect(find.text('K-200'), findsNothing);
  });

  testWidgets('shows an injected ticket and sends cooking transition with deducted stock', (tester) async {
    KitchenState? changedState;
    await tester.pumpWidget(MaterialApp(
      home: KitchenDisplayScreen(
        state: seed(),
        onStateChanged: (value) => changedState = value,
      ),
    ));

    expect(find.text('Table 4'), findsOneWidget);
    expect(find.text('2 × Pancakes'), findsOneWidget);
    expect(find.text('Accepted'), findsOneWidget);

    await tester.tap(find.text('Start cooking'));
    await tester.pumpAndSettle();

    expect(changedState?.tickets['K-200']?.status, KitchenTicketStatus.cooking);
    expect(changedState?.inventory.onHandMicros['flour'], 300000);
    expect(changedState?.inventory.movements, hasLength(1));
  });

  testWidgets('keeps a ticket accepted and reports a stock shortage', (tester) async {
    KitchenState? changedState;
    final accepted = seed(flour: 100000);
    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: KitchenDisplayScreen(
          state: accepted,
          onStateChanged: (value) => changedState = value,
        ),
      ),
    ));

    await tester.tap(find.text('Start cooking'));
    await tester.pump();

    expect(find.text('Cannot start cooking: insufficient stock for flour.'), findsOneWidget);
    expect(changedState, isNull);
    expect(accepted.tickets['K-200']?.status, KitchenTicketStatus.accepted);
    expect(accepted.inventory.onHandMicros['flour'], 100000);
  });

  testWidgets('disables status actions without a persistence callback', (tester) async {
    await tester.pumpWidget(MaterialApp(home: KitchenDisplayScreen(state: seed())));

    final startButton = tester.widget<FilledButton>(find.widgetWithText(FilledButton, 'Start cooking'));
    expect(startButton.onPressed, isNull);
  });
}
