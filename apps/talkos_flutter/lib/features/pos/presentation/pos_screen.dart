import 'package:flutter/material.dart';

import '../domain/cart.dart';
import '../domain/pos_product.dart';

class PosScreen extends StatefulWidget {
  const PosScreen({super.key, this.products = const []});

  /// Products supplied by the authorised branch catalogue.
  final List<PosProduct> products;

  @override
  State<PosScreen> createState() => _PosScreenState();
}

class _PosScreenState extends State<PosScreen> {
  PosCart _cart = PosCart.empty();

  Future<void> _addProduct(PosProduct product) async {
    try {
      final activeVariants = product.variants.where((variant) => variant.isActive).toList();
      if (product.variants.isNotEmpty && activeVariants.isEmpty) {
        throw StateError('No active size is configured for this product.');
      }

      PosItemSize? size;
      if (activeVariants.length == 1) {
        size = activeVariants.single.size;
      } else if (activeVariants.length > 1) {
        size = await showDialog<PosItemSize>(
          context: context,
          builder: (dialogContext) => SimpleDialog(
            title: Text('Choose a size for ${product.name}'),
            children: [
              for (final variant in activeVariants)
                SimpleDialogOption(
                  onPressed: () => Navigator.of(dialogContext).pop(variant.size),
                  child: Text('${_sizeLabel(variant.size)} · ${_formatMoney(variant.pricePaise)}'),
                ),
            ],
          ),
        );
        if (size == null || !mounted) return;
      }

      final selectedOptions = <String, String>{};
      for (final component in product.comboComponents.where((item) => item.isChoice)) {
        final selected = await showDialog<String>(
          context: context,
          builder: (dialogContext) => SimpleDialog(
            title: Text(component.label),
            children: [
              for (final option in component.options)
                SimpleDialogOption(
                  onPressed: () => Navigator.of(dialogContext).pop(option.id),
                  child: Text(option.label),
                ),
            ],
          ),
        );
        if (selected == null || !mounted) return;
        selectedOptions[component.id] = selected;
      }

      final nextCart = _cart.add(
        product,
        size: size,
        selectedOptions: selectedOptions,
      );
      setState(() => _cart = nextCart);
    } on StateError catch (error) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(error.message)),
      );
    }
  }

  void _setQuantity(String lineId, int quantity) {
    setState(() => _cart = _cart.setQuantity(lineId, quantity));
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final wide = constraints.maxWidth >= 760;
        final catalog = _CatalogPanel(
          products: widget.products
              .where((product) => product.isActive && product.isAvailable && !product.isSubItem)
              .toList(),
          onProductTap: _addProduct,
        );
        final cart = _CartPanel(cart: _cart, onSetQuantity: _setQuantity);
        return Padding(
          padding: const EdgeInsets.all(20),
          child: wide
              ? Row(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Expanded(flex: 7, child: catalog),
                    const SizedBox(width: 16),
                    Expanded(flex: 4, child: cart),
                  ],
                )
              : Column(
                  children: [
                    Expanded(flex: 3, child: catalog),
                    const SizedBox(height: 16),
                    Expanded(flex: 2, child: cart),
                  ],
                ),
        );
      },
    );
  }
}

class _CatalogPanel extends StatefulWidget {
  const _CatalogPanel({required this.products, required this.onProductTap});

  final List<PosProduct> products;
  final ValueChanged<PosProduct> onProductTap;

  @override
  State<_CatalogPanel> createState() => _CatalogPanelState();
}

class _CatalogPanelState extends State<_CatalogPanel> {
  String _query = '';

  @override
  Widget build(BuildContext context) {
    final query = _query.trim().toLowerCase();
    final products = widget.products.where((product) {
      if (query.isEmpty) return true;
      return product.name.toLowerCase().contains(query) ||
          product.categoryId.toLowerCase().contains(query) ||
          (product.comboDescription?.toLowerCase().contains(query) ?? false);
    }).toList();

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Menu catalogue', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            const Text('Products and prices are supplied by the authorised branch catalogue.'),
            const SizedBox(height: 16),
            TextField(
              decoration: InputDecoration(
                labelText: 'Search menu',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: _query.isEmpty
                    ? null
                    : IconButton(
                        tooltip: 'Clear search',
                        onPressed: () => setState(() => _query = ''),
                        icon: const Icon(Icons.clear),
                      ),
                border: const OutlineInputBorder(),
                isDense: true,
              ),
              onChanged: (value) => setState(() => _query = value),
            ),
            const SizedBox(height: 16),
            Expanded(
              child: widget.products.isEmpty
                  ? const _EmptyCatalog()
                  : products.isEmpty
                      ? Center(child: Text('No menu items match “${_query.trim()}”.'))
                  : LayoutBuilder(
                      builder: (context, constraints) {
                        final columns = constraints.maxWidth >= 680 ? 3 : constraints.maxWidth >= 400 ? 2 : 1;
                        return GridView.builder(
                          itemCount: products.length,
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: columns,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            mainAxisExtent: 104,
                          ),
                          itemBuilder: (context, index) {
                            final product = products[index];
                            final prices = product.variants
                                .where((variant) => variant.isActive)
                                .map((variant) => variant.pricePaise)
                                .toList();
                            final price = prices.isEmpty
                                ? _formatMoney(product.pricePaise)
                                : 'From ${_formatMoney(prices.reduce((a, b) => a < b ? a : b))}';
                            return Card(
                              child: InkWell(
                                borderRadius: BorderRadius.circular(12),
                                onTap: () => widget.onProductTap(product),
                                child: Padding(
                                  padding: const EdgeInsets.all(14),
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(product.name, maxLines: 2, overflow: TextOverflow.ellipsis),
                                      const SizedBox(height: 6),
                                      Text(price, style: const TextStyle(fontWeight: FontWeight.w700)),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
}

class _EmptyCatalog extends StatelessWidget {
  const _EmptyCatalog();

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.cloud_off_outlined, size: 42, color: Colors.black45),
          SizedBox(height: 12),
          Text('No live menu connected', style: TextStyle(fontWeight: FontWeight.w700)),
          SizedBox(height: 6),
          Text(
            'Connect the secure branch catalogue before accepting orders. No sample products or prices are shown.',
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}

class _CartPanel extends StatelessWidget {
  const _CartPanel({required this.cart, required this.onSetQuantity});

  final PosCart cart;
  final void Function(String lineId, int quantity) onSetQuantity;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Current order', style: Theme.of(context).textTheme.titleLarge),
            const Divider(height: 28),
            Expanded(
              child: cart.isEmpty
                  ? const Center(child: Text('Add menu items to begin an order.'))
                  : ListView.separated(
                      itemCount: cart.lines.length,
                      separatorBuilder: (context, index) => const Divider(height: 20),
                      itemBuilder: (context, index) {
                        final line = cart.lines[index];
                        final title = line.size == null
                            ? line.product.name
                            : '${line.product.name} · ${_sizeLabel(line.size!)}';
                        return Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
                            const SizedBox(height: 4),
                            Text('${_formatMoney(line.unitPricePaise)} each · ${_formatMoney(line.lineTotalPaise)}'),
                            for (final selection in line.selectedOptions.entries)
                              Text(_optionLabel(line.product, selection.key, selection.value)),
                            Align(
                              alignment: Alignment.centerRight,
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  IconButton(
                                    tooltip: 'Decrease quantity',
                                    onPressed: () => onSetQuantity(line.id, line.quantity - 1),
                                    icon: const Icon(Icons.remove_circle_outline),
                                  ),
                                  Text('${line.quantity}', semanticsLabel: 'Quantity ${line.quantity}'),
                                  IconButton(
                                    tooltip: 'Increase quantity',
                                    onPressed: () => onSetQuantity(line.id, line.quantity + 1),
                                    icon: const Icon(Icons.add_circle_outline),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        );
                      },
                    ),
            ),
            const Divider(),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Subtotal'),
                Flexible(
                  child: Text(
                    _formatMoney(cart.subtotalPaise),
                    textAlign: TextAlign.end,
                    style: const TextStyle(fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Tax'),
                Flexible(
                  child: Text('Configured by branch', textAlign: TextAlign.end),
                ),
              ],
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: null,
                child: Text(cart.isEmpty ? 'Add items to begin' : 'Checkout unavailable until order service is connected'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

String _formatMoney(int paise) => '₹${paise ~/ 100}.${(paise % 100).toString().padLeft(2, '0')}';

String _sizeLabel(PosItemSize size) => switch (size) {
      PosItemSize.small => 'Small',
      PosItemSize.medium => 'Medium',
      PosItemSize.large => 'Large',
      PosItemSize.standard => 'Standard',
    };

String _optionLabel(PosProduct product, String componentId, String optionId) {
  for (final component in product.comboComponents) {
    if (component.id == componentId) {
      for (final option in component.options) {
        if (option.id == optionId) return '${component.label}: ${option.label}';
      }
    }
  }
  return optionId;
}
