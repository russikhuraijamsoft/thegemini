import 'pos_product.dart';

class CartLine {
  const CartLine({
    required this.id,
    required this.product,
    required this.quantity,
    required this.unitPricePaise,
    this.size,
    this.selectedOptions = const {},
    this.notes = '',
  })  : assert(quantity > 0),
        assert(unitPricePaise >= 0);

  final String id;
  final PosProduct product;
  final int quantity;
  final int unitPricePaise;
  final PosItemSize? size;
  final Map<String, String> selectedOptions;
  final String notes;

  int get lineTotalPaise => unitPricePaise * quantity;

  CartLine withQuantity(int value) => CartLine(
        id: id,
        product: product,
        quantity: value,
        unitPricePaise: unitPricePaise,
        size: size,
        selectedOptions: selectedOptions,
        notes: notes,
      );
}

class PosCart {
  PosCart._(this._lines);
  factory PosCart.empty() => PosCart._(const {});

  final Map<String, CartLine> _lines;
  List<CartLine> get lines => List.unmodifiable(_lines.values);
  bool get isEmpty => _lines.isEmpty;
  int get itemCount => _lines.values.fold(0, (sum, line) => sum + line.quantity);
  int get subtotalPaise => _lines.values.fold(0, (sum, line) => sum + line.lineTotalPaise);

  PosCart add(
    PosProduct product, {
    PosItemSize? size,
    Map<String, String> selectedOptions = const {},
    int quantity = 1,
    String notes = '',
  }) {
    if (!product.isActive || !product.isAvailable || product.isSubItem) {
      throw StateError('This product cannot be sold directly.');
    }
    if (quantity <= 0) throw ArgumentError.value(quantity, 'quantity');

    for (final component in product.comboComponents.where((item) => item.isChoice)) {
      final selectedId = selectedOptions[component.id];
      final isValid = component.options.any((option) => option.id == selectedId);
      if (!isValid) {
        throw StateError('Choose an option for ${component.label}.');
      }
    }

    final variant = product.variantFor(size);
    final resolvedSize = variant?.size;
    final unitPrice = variant?.pricePaise ?? product.pricePaise;
    final optionKey = (selectedOptions.keys.toList()..sort())
        .map((key) => '$key=${selectedOptions[key]}')
        .join(',');
    final lineId = '${product.id}|${resolvedSize?.name ?? 'base'}|$optionKey';
    final next = Map<String, CartLine>.from(_lines);
    final existing = next[lineId];
    next[lineId] = CartLine(
      id: lineId,
      product: product,
      quantity: (existing?.quantity ?? 0) + quantity,
      unitPricePaise: unitPrice,
      size: resolvedSize,
      selectedOptions: Map.unmodifiable(selectedOptions),
      notes: notes.isEmpty ? (existing?.notes ?? '') : notes,
    );
    return PosCart._(Map.unmodifiable(next));
  }

  PosCart setQuantity(String lineId, int quantity) {
    if (quantity < 0) throw ArgumentError.value(quantity, 'quantity');
    final next = Map<String, CartLine>.from(_lines);
    if (quantity == 0) {
      next.remove(lineId);
    } else {
      final existing = next[lineId];
      if (existing == null) throw StateError('Cart line does not exist.');
      next[lineId] = existing.withQuantity(quantity);
    }
    return PosCart._(Map.unmodifiable(next));
  }

  PosCart remove(String lineId) {
    final next = Map<String, CartLine>.from(_lines)..remove(lineId);
    return PosCart._(Map.unmodifiable(next));
  }

  PosCart clear() => PosCart.empty();
}
