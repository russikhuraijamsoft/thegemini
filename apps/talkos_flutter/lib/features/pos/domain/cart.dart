import 'pos_product.dart';

class CartLine {
  const CartLine({required this.product, required this.quantity})
      : assert(quantity > 0);

  final PosProduct product;
  final int quantity;

  int get lineTotalPaise => product.pricePaise * quantity;

  CartLine withQuantity(int value) => CartLine(product: product, quantity: value);
}

class PosCart {
  PosCart._(this._lines);

  factory PosCart.empty() => PosCart._(const {});

  final Map<String, CartLine> _lines;

  List<CartLine> get lines => List.unmodifiable(_lines.values);
  bool get isEmpty => _lines.isEmpty;
  int get itemCount => _lines.values.fold(0, (sum, line) => sum + line.quantity);
  int get subtotalPaise =>
      _lines.values.fold(0, (sum, line) => sum + line.lineTotalPaise);

  PosCart add(PosProduct product) {
    if (!product.isAvailable) {
      throw StateError('Unavailable products cannot be added to an order.');
    }
    final next = Map<String, CartLine>.from(_lines);
    final existing = next[product.id];
    next[product.id] = CartLine(
      product: product,
      quantity: (existing?.quantity ?? 0) + 1,
    );
    return PosCart._(Map.unmodifiable(next));
  }

  PosCart setQuantity(String productId, int quantity) {
    if (quantity < 0) throw ArgumentError.value(quantity, 'quantity');
    final next = Map<String, CartLine>.from(_lines);
    if (quantity == 0) {
      next.remove(productId);
    } else {
      final existing = next[productId];
      if (existing == null) throw StateError('Product is not in the cart.');
      next[productId] = existing.withQuantity(quantity);
    }
    return PosCart._(Map.unmodifiable(next));
  }

  PosCart clear() => PosCart.empty();
}
