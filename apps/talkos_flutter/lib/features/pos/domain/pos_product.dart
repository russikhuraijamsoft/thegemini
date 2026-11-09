class PosProduct {
  const PosProduct({
    required this.id,
    required this.name,
    required this.categoryId,
    required this.pricePaise,
    this.isAvailable = true,
  }) : assert(pricePaise >= 0);

  final String id;
  final String name;
  final String categoryId;
  /// Integer paise avoids floating-point currency rounding errors.
  final int pricePaise;
  final bool isAvailable;
}
