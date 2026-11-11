import 'package:flutter/material.dart';

import '../domain/inventory_deduction_engine.dart';

class InventoryScreen extends StatefulWidget {
  const InventoryScreen({
    super.key,
    this.state,
    this.itemNames = const {},
    this.itemUnits = const {},
  });

  /// Inventory must come from the authorised branch repository.
  final InventoryState? state;

  /// Optional display names for raw stock items.
  final Map<String, String> itemNames;

  /// Optional base unit labels (e.g. 'kg', 'L', 'units'). Default is 'units'.
  final Map<String, String> itemUnits;

  @override
  State<InventoryScreen> createState() => _InventoryScreenState();
}

class _InventoryScreenState extends State<InventoryScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final inventoryState = widget.state;
    if (inventoryState == null) {
      return const _InventoryEmptyState(
        title: 'Inventory not connected',
        message:
            'Connect the authorised branch inventory service to display live stock levels. No sample inventory figures are shown.',
      );
    }

    final query = _searchQuery.trim().toLowerCase();
    final items = inventoryState.onHandMicros.entries.where((entry) {
      if (query.isEmpty) return true;
      final name = widget.itemNames[entry.key]?.toLowerCase() ?? '';
      return entry.key.toLowerCase().contains(query) || name.contains(query);
    }).toList()
      ..sort((a, b) => a.key.compareTo(b.key));

    return Material(
      color: Colors.transparent,
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Inventory',
                          style: Theme.of(context).textTheme.headlineMedium,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Active branch: ${inventoryState.branchId}',
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                                color: Colors.black54,
                              ),
                        ),
                      ],
                    ),
                  ),
                  Chip(
                    avatar: const Icon(Icons.store_outlined, size: 18),
                    label: Text(inventoryState.branchId),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              TabBar(
                controller: _tabController,
                tabs: [
                  Tab(
                    icon: const Icon(Icons.inventory_2_outlined),
                    text: 'Stock on hand (${inventoryState.onHandMicros.length})',
                  ),
                  Tab(
                    icon: const Icon(Icons.history_outlined),
                    text: 'Ledger movements (${inventoryState.movements.length})',
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Expanded(
                child: TabBarView(
                  controller: _tabController,
                  children: [
                    _StockTabView(
                      items: items,
                      searchQuery: _searchQuery,
                      onSearchChanged: (value) =>
                          setState(() => _searchQuery = value),
                      itemNames: widget.itemNames,
                      itemUnits: widget.itemUnits,
                    ),
                    _MovementsTabView(
                      movements: inventoryState.movements,
                      itemNames: widget.itemNames,
                      itemUnits: widget.itemUnits,
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _StockTabView extends StatelessWidget {
  const _StockTabView({
    required this.items,
    required this.searchQuery,
    required this.onSearchChanged,
    required this.itemNames,
    required this.itemUnits,
  });

  final List<MapEntry<String, int>> items;
  final String searchQuery;
  final ValueChanged<String> onSearchChanged;
  final Map<String, String> itemNames;
  final Map<String, String> itemUnits;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          decoration: InputDecoration(
            labelText: 'Search inventory items',
            prefixIcon: const Icon(Icons.search),
            suffixIcon: searchQuery.isEmpty
                ? null
                : IconButton(
                    tooltip: 'Clear search',
                    onPressed: () => onSearchChanged(''),
                    icon: const Icon(Icons.clear),
                  ),
            border: const OutlineInputBorder(),
            isDense: true,
          ),
          onChanged: onSearchChanged,
        ),
        const SizedBox(height: 16),
        Expanded(
          child: items.isEmpty
              ? Center(
                  child: Text(
                    searchQuery.trim().isEmpty
                        ? 'No inventory items recorded in this branch.'
                        : 'No inventory items match “${searchQuery.trim()}”.',
                  ),
                )
              : ListView.separated(
                  itemCount: items.length,
                  separatorBuilder: (context, index) =>
                      const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final item = items[index];
                    final itemId = item.key;
                    final micros = item.value;
                    final displayName = itemNames[itemId] ?? itemId;
                    final unit = itemUnits[itemId] ?? 'units';
                    final status = _stockStatus(micros);

                    return Card(
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor:
                              status.color.withAlpha((0.15 * 255).round()),
                          child: Icon(status.icon, color: status.color),
                        ),
                        title: Text(
                          displayName,
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                        subtitle: displayName != itemId
                            ? Text('ID: $itemId · $unit')
                            : Text('Base unit: $unit'),
                        trailing: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              _formatStockQuantity(micros, unit),
                              style: Theme.of(context)
                                  .textTheme
                                  .titleMedium
                                  ?.copyWith(
                                    fontWeight: FontWeight.w800,
                                    color: status.color,
                                  ),
                            ),
                            Text(
                              status.label,
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: status.color,
                              ),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}

class _MovementsTabView extends StatelessWidget {
  const _MovementsTabView({
    required this.movements,
    required this.itemNames,
    required this.itemUnits,
  });

  final List<InventoryMovement> movements;
  final Map<String, String> itemNames;
  final Map<String, String> itemUnits;

  @override
  Widget build(BuildContext context) {
    if (movements.isEmpty) {
      return const Center(
        child: Text('No ledger movements recorded yet.'),
      );
    }

    final reversed = movements.reversed.toList();
    return ListView.separated(
      itemCount: reversed.length,
      separatorBuilder: (context, index) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final movement = reversed[index];
        final itemName = itemNames[movement.inventoryItemId] ??
            movement.inventoryItemId;
        final unit = itemUnits[movement.inventoryItemId] ?? 'units';
        final channelLabel = switch (movement.channel) {
          OrderChannel.pos => 'POS',
          OrderChannel.kiosk => 'Kiosk',
          OrderChannel.qr => 'QR',
        };

        return Card(
          child: Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        itemName,
                        style: const TextStyle(fontWeight: FontWeight.w700),
                      ),
                    ),
                    Chip(
                      label: Text(channelLabel),
                      visualDensity: VisualDensity.compact,
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'Order: ${movement.orderId} · Product: ${movement.productId}',
                  style: Theme.of(context).textTheme.bodySmall,
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Recipe v${movement.recipeVersion}',
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: Colors.black45),
                    ),
                    Text(
                      '-${_formatStockQuantity(movement.quantityMicros, unit)}',
                      style: const TextStyle(
                        fontWeight: FontWeight.w800,
                        color: Colors.deepOrange,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _InventoryEmptyState extends StatelessWidget {
  const _InventoryEmptyState({
    required this.title,
    required this.message,
  });

  final String title;
  final String message;

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.inventory_2_outlined, size: 40),
              const SizedBox(height: 12),
              Text(title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              Text(message, textAlign: TextAlign.center),
            ],
          ),
        ),
      ),
    );
  }
}

({String label, Color color, IconData icon}) _stockStatus(int micros) {
  if (micros <= 0) {
    return (
      label: 'Out of stock',
      color: Colors.red,
      icon: Icons.cancel_outlined,
    );
  }
  if (micros < 500000) {
    return (
      label: 'Low stock',
      color: Colors.orange,
      icon: Icons.warning_amber_outlined,
    );
  }
  return (
    label: 'In stock',
    color: Colors.green,
    icon: Icons.check_circle_outline,
  );
}

String _formatStockQuantity(int micros, String unit) {
  final whole = micros ~/ 1000000;
  final frac = (micros.abs() % 1000000) ~/ 1000;
  if (frac == 0) {
    return '$whole $unit';
  }
  final fracStr = frac.toString().padLeft(3, '0').replaceAll(RegExp(r'0+$'), '');
  return '$whole.$fracStr $unit';
}
