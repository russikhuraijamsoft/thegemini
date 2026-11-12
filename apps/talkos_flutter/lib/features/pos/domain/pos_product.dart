enum PosItemSize { small, medium, large, standard }

class PosProductVariant {
  const PosProductVariant({required this.size, required this.pricePaise, this.isActive = true})
      : assert(pricePaise >= 0);
  final PosItemSize size;
  final int pricePaise;
  final bool isActive;
}

class PosComboOption {
  const PosComboOption({required this.id, required this.label, this.productId, this.size});
  final String id;
  final String label;
  final String? productId;
  final PosItemSize? size;
}

class PosComboComponent {
  const PosComboComponent({
    required this.id,
    required this.label,
    this.quantity = 1,
    this.isChoice = false,
    this.options = const [],
  }) : assert(quantity > 0);
  final String id;
  final String label;
  final int quantity;
  final bool isChoice;
  final List<PosComboOption> options;
}

class PosProduct {
  const PosProduct({
    required this.id,
    required this.name,
    required this.categoryId,
    required this.pricePaise,
    this.variants = const [],
    this.comboComponents = const [],
    this.isAvailable = true,
    this.isActive = true,
    this.isCombo = false,
    this.isSubItem = false,
    this.comboDescription,
  }) : assert(pricePaise >= 0);

  final String id;
  final String name;
  final String categoryId;
  /// Base price in paise. Variant prices override this when present.
  final int pricePaise;
  final List<PosProductVariant> variants;
  final List<PosComboComponent> comboComponents;
  final bool isAvailable;
  final bool isActive;
  final bool isCombo;
  final bool isSubItem;
  final String? comboDescription;

  PosProductVariant? variantFor(PosItemSize? size) {
    if (variants.isEmpty) return null;
    final active = variants.where((variant) => variant.isActive).toList();
    if (active.isEmpty) {
      throw StateError('No active size is configured for this product.');
    }
    if (size != null) {
      for (final variant in active) {
        if (variant.size == size) return variant;
      }
      throw StateError('Selected size is not available for this product.');
    }
    if (active.length > 1) {
      throw StateError('A size must be selected for this product.');
    }
    return active.single;
  }

  int priceFor(PosItemSize? size) => variantFor(size)?.pricePaise ?? pricePaise;
}
