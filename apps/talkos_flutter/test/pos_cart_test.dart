import 'package:flutter_test/flutter_test.dart';
import 'package:talkos/features/pos/domain/cart.dart';
import 'package:talkos/features/pos/domain/pos_product.dart';

void main() {
  const noodles = PosProduct(
    id: 'noodles-001',
    name: 'Test noodles',
    categoryId: 'noodles',
    pricePaise: 12500,
    variants: [
      PosProductVariant(size: PosItemSize.small, pricePaise: 12500),
      PosProductVariant(size: PosItemSize.large, pricePaise: 24000),
    ],
  );

  group('PosCart', () {
    test('adds products and calculates integer-paise subtotal', () {
      final cart = PosCart.empty()
          .add(noodles, size: PosItemSize.small)
          .add(noodles, size: PosItemSize.small);
      expect(cart.itemCount, 2);
      expect(cart.subtotalPaise, 25000);
    });

    test('keeps different sizes as separate order lines', () {
      final cart = PosCart.empty()
          .add(noodles, size: PosItemSize.small)
          .add(noodles, size: PosItemSize.large);
      expect(cart.lines, hasLength(2));
      expect(cart.subtotalPaise, 36500);
    });

    test('removes a line when quantity becomes zero', () {
      final cart = PosCart.empty().add(noodles);
      final cleared = cart.setQuantity(cart.lines.single.id, 0);
      expect(cleared.isEmpty, isTrue);
      expect(cleared.subtotalPaise, 0);
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

    test('requires valid combo choices', () {
      const combo = PosProduct(
        id: 'combo',
        name: 'Combo',
        categoryId: 'combos',
        pricePaise: 6000,
        isCombo: true,
        comboComponents: [
          PosComboComponent(
            id: 'base-choice',
            label: 'Choose a base',
            isChoice: true,
            options: [
              PosComboOption(id: 'noodles', label: 'Noodles'),
              PosComboOption(id: 'rice', label: 'Fried rice'),
            ],
          ),
        ],
      );
      expect(() => PosCart.empty().add(combo), throwsStateError);
      final cart = PosCart.empty().add(
        combo,
        selectedOptions: const {'base-choice': 'noodles'},
      );
      expect(cart.itemCount, 1);
    });

    test('does not allow negative quantities', () {
      final cart = PosCart.empty().add(noodles);
      expect(() => cart.setQuantity(cart.lines.single.id, -1), throwsArgumentError);
    });
  });
}
