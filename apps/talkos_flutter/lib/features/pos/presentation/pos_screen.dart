import 'package:flutter/material.dart';

class PosScreen extends StatelessWidget {
  const PosScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final wide = constraints.maxWidth >= 760;
        final catalog = _CatalogPanel();
        final cart = _CartPanel();
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

class _CatalogPanel extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Menu catalogue', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 8),
            const Text('Products and prices will load from the authorised branch catalogue.'),
            const Spacer(),
            const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.cloud_off_outlined, size: 42, color: Colors.black45),
                  SizedBox(height: 12),
                  Text('No live menu connected', style: TextStyle(fontWeight: FontWeight.w700)),
                  SizedBox(height: 6),
                  Text(
                    'We are not inserting invented menu items or prices. Connect the secure catalogue before accepting orders.',
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
            const Spacer(),
          ],
        ),
      ),
    );
  }
}

class _CartPanel extends StatelessWidget {
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
            const Expanded(
              child: Center(
                child: Text('Add menu items to begin an order.'),
              ),
            ),
            const Divider(),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Subtotal'),
                Text('—', style: TextStyle(fontWeight: FontWeight.w700)),
              ],
            ),
            const SizedBox(height: 8),
            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Tax'),
                Text('Configured by branch'),
              ],
            ),
            const SizedBox(height: 16),
            const SizedBox(
              width: double.infinity,
              child: FilledButton(
                onPressed: null,
                child: Text('Checkout unavailable until catalogue is connected'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
