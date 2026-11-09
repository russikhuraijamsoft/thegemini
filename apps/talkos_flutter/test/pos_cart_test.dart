import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/features/pos/domain/cart.dart';
import 'package:talkos/features/pos/domain/pos_product.dart';

void main() {
  const noodles = PosProduct(
    id: 'noodles-001',
    name: 'Test noodles',
    categoryId: 'noodles',
    pricePaise: 12500,
  );

  group('PosCart', () {
    test('adds products and calculates integer-paise subtotal', () {
      final cart = PosCart.empty().add(noodles).add(noodles);
      expect(cart.itemCount, 2);
      expect(cart.subtotalPaise, 25000);
    });

    test('removes a line when quantity becomes zero', () {
      final cart = PosCart.empty().add(noodles).setQuantity(noodles.id, 0);
      expect(cart.isEmpty, isTrue);
      expect(cart.subtotalPaise, 0);
    });

    test('rejects unavailable products', () {
      const unavailable = PosProduct(
        id: 'sold-out',
        name: 'Sold out',
        categoryId: 'other',
        pricePaise: 100,
        isAvailable: false,
      );
      expect(() => PosCart.empty().add(unavailable), throwsStateError);
    });

    test('does not allow negative quantities', () {
      expect(
        () => PosCart.empty().setQuantity(noodles.id, -1),
        throwsArgumentError,
      );
    });
  });
}
