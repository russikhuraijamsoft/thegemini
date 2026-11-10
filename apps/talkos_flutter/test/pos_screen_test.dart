import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/features/pos/domain/pos_product.dart';
import 'package:talkos/features/pos/presentation/pos_screen.dart';

void main() {
  const tea = PosProduct(
    id: 'tea',
    name: 'Test tea',
    categoryId: 'drinks',
    pricePaise: 1250,
  );

  testWidgets('catalogue products can be added and quantities update subtotal', (tester) async {
    await tester.pumpWidget(const MaterialApp(home: PosScreen(products: [tea])));

    await tester.tap(find.text('Test tea'));
    await tester.pumpAndSettle();
    expect(find.text('₹12.50'), findsNWidgets(2));

    await tester.tap(find.byTooltip('Increase quantity'));
    await tester.pumpAndSettle();
    expect(find.text('₹25.00'), findsOneWidget);

    await tester.tap(find.byTooltip('Decrease quantity'));
    await tester.pumpAndSettle();
    expect(find.text('₹12.50'), findsNWidgets(2));

    await tester.tap(find.byTooltip('Decrease quantity'));
    await tester.pumpAndSettle();
    expect(find.text('Add menu items to begin an order.'), findsOneWidget);
  });

  testWidgets('products with sizes require an explicit selection', (tester) async {
    const noodles = PosProduct(
      id: 'noodles',
      name: 'Test noodles',
      categoryId: 'noodles',
      pricePaise: 1250,
      variants: [
        PosProductVariant(size: PosItemSize.small, pricePaise: 1250),
        PosProductVariant(size: PosItemSize.large, pricePaise: 2400),
      ],
    );
    await tester.pumpWidget(const MaterialApp(home: PosScreen(products: [noodles])));

    await tester.tap(find.text('Test noodles'));
    await tester.pumpAndSettle();
    expect(find.text('Choose a size for Test noodles'), findsOneWidget);

    await tester.tap(find.text('Large · ₹24.00'));
    await tester.pumpAndSettle();
    expect(find.text('Test noodles · Large'), findsOneWidget);
    expect(find.text('₹24.00'), findsOneWidget);
  });

  testWidgets('catalogue and cart fit a phone-sized viewport', (tester) async {
    tester.view.physicalSize = const Size(390, 844);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.resetPhysicalSize);
    addTearDown(tester.view.resetDevicePixelRatio);

    await tester.pumpWidget(const MaterialApp(home: PosScreen(products: [tea])));
    await tester.tap(find.text('Test tea'));
    await tester.pumpAndSettle();

    expect(find.text('Subtotal'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
}
