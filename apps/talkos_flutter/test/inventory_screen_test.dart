import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/features/inventory/domain/inventory_deduction_engine.dart';
import 'package:talkos/features/inventory/presentation/inventory_screen.dart';

void main() {
  InventoryState seedState({
    Map<String, int> stock = const {
      'flour': 1500000,
      'sugar': 350000,
      'salt': 0,
    },
    List<InventoryMovement> movements = const [],
  }) {
    return InventoryState(
      branchId: 'br_main',
      onHandMicros: stock,
      recipes: const {},
      movements: movements,
    );
  }

  testWidgets('does not invent inventory when no branch service is connected',
      (tester) async {
    await tester.pumpWidget(const MaterialApp(home: InventoryScreen()));

    expect(find.text('Inventory not connected'), findsOneWidget);
    expect(
      find.text(
        'Connect the authorised branch inventory service to display live stock levels. No sample inventory figures are shown.',
      ),
      findsOneWidget,
    );
    expect(find.text('Wheat flour'), findsNothing);
  });

  testWidgets(
      'displays branch stock items with quantities, units, and status badges',
      (tester) async {
    final state = seedState();
    await tester.pumpWidget(
      MaterialApp(
        home: InventoryScreen(
          state: state,
          itemNames: const {
            'flour': 'Wheat flour',
            'sugar': 'White sugar',
            'salt': 'Table salt',
          },
          itemUnits: const {
            'flour': 'kg',
            'sugar': 'kg',
            'salt': 'kg',
          },
        ),
      ),
    );

    expect(find.text('Inventory'), findsOneWidget);
    expect(find.text('Active branch: br_main'), findsOneWidget);
    expect(find.text('br_main'), findsOneWidget);

    expect(find.text('Wheat flour'), findsOneWidget);
    expect(find.text('1.5 kg'), findsOneWidget);
    expect(find.text('In stock'), findsOneWidget);

    expect(find.text('White sugar'), findsOneWidget);
    expect(find.text('0.35 kg'), findsOneWidget);
    expect(find.text('Low stock'), findsOneWidget);

    expect(find.text('Table salt'), findsOneWidget);
    expect(find.text('0 kg'), findsOneWidget);
    expect(find.text('Out of stock'), findsOneWidget);
  });

  testWidgets('filters inventory items with search input', (tester) async {
    final state = seedState();
    await tester.pumpWidget(
      MaterialApp(
        home: InventoryScreen(
          state: state,
          itemNames: const {
            'flour': 'Wheat flour',
            'sugar': 'White sugar',
            'salt': 'Table salt',
          },
        ),
      ),
    );

    expect(find.text('Wheat flour'), findsOneWidget);
    expect(find.text('White sugar'), findsOneWidget);

    await tester.enterText(
        find.widgetWithText(TextField, 'Search inventory items'), 'sugar');
    await tester.pumpAndSettle();

    expect(find.text('Wheat flour'), findsNothing);
    expect(find.text('White sugar'), findsOneWidget);

    await tester.tap(find.byTooltip('Clear search'));
    await tester.pumpAndSettle();

    expect(find.text('Wheat flour'), findsOneWidget);
    expect(find.text('White sugar'), findsOneWidget);
  });

  testWidgets('shows empty search state when no items match', (tester) async {
    final state = seedState();
    await tester.pumpWidget(
      MaterialApp(
        home: InventoryScreen(
          state: state,
        ),
      ),
    );

    await tester.enterText(
        find.widgetWithText(TextField, 'Search inventory items'),
        'unknown_item');
    await tester.pumpAndSettle();

    expect(
      find.text('No inventory items match “unknown_item”.'),
      findsOneWidget,
    );
  });

  testWidgets('renders ledger movements on the movements tab', (tester) async {
    const movement = InventoryMovement(
      id: 'br_main/O-100/line-1/flour',
      orderId: 'O-100',
      branchId: 'br_main',
      orderLineId: 'line-1',
      productId: 'chowmein',
      inventoryItemId: 'flour',
      quantityMicros: 250000,
      recipeVersion: 1,
      channel: OrderChannel.pos,
    );
    final state = seedState(movements: const [movement]);

    await tester.pumpWidget(
      MaterialApp(
        home: InventoryScreen(
          state: state,
          itemNames: const {'flour': 'Wheat flour'},
          itemUnits: const {'flour': 'kg'},
        ),
      ),
    );

    expect(find.text('Ledger movements (1)'), findsOneWidget);

    await tester.tap(find.text('Ledger movements (1)'));
    await tester.pumpAndSettle();

    expect(find.text('Wheat flour'), findsOneWidget);
    expect(find.text('POS'), findsOneWidget);
    expect(
        find.text('Order: O-100 · Product: chowmein'), findsOneWidget);
    expect(find.text('Recipe v1'), findsOneWidget);
    expect(find.text('-0.25 kg'), findsOneWidget);
  });
}
