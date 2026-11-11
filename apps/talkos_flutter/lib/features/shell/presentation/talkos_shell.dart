import 'package:flutter/material.dart';

import '../../inventory/presentation/inventory_screen.dart';
import '../../kitchen/presentation/kitchen_display_screen.dart';
import '../../pos/presentation/pos_screen.dart';

enum _Section { overview, pos, kitchen, inventory, more }

const _navigationItems = <({ _Section id, String label, IconData icon })>[
  (id: _Section.overview, label: 'Overview', icon: Icons.dashboard_outlined),
  (id: _Section.pos, label: 'Point of Sale', icon: Icons.point_of_sale_outlined),
  (id: _Section.kitchen, label: 'Kitchen', icon: Icons.soup_kitchen_outlined),
  (id: _Section.inventory, label: 'Inventory', icon: Icons.inventory_2_outlined),
  (id: _Section.more, label: 'More modules', icon: Icons.apps_outlined),
];

class TalkOsShell extends StatefulWidget {
  const TalkOsShell({super.key});

  @override
  State<TalkOsShell> createState() => _TalkOsShellState();
}

class _TalkOsShellState extends State<TalkOsShell> {
  _Section _section = _Section.overview;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final desktop = constraints.maxWidth >= 900;
        final index = _navigationItems.indexWhere((item) => item.id == _section);
        final body = switch (_section) {
          _Section.pos => const PosScreen(),
          _Section.kitchen => const KitchenDisplayScreen(),
          _Section.inventory => const InventoryScreen(),
          _ => _SectionLanding(section: _section),
        };

        if (desktop) {
          return Scaffold(
            body: Row(
              children: [
                NavigationRail(
                  extended: constraints.maxWidth >= 1180,
                  selectedIndex: index,
                  onDestinationSelected: (value) => setState(() => _section = _navigationItems[value].id),
                  leading: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 24),
                    child: _BrandMark(compact: constraints.maxWidth < 1180),
                  ),
                  destinations: [
                    for (final item in _navigationItems)
                      NavigationRailDestination(icon: Icon(item.icon), label: Text(item.label)),
                  ],
                ),
                const VerticalDivider(width: 1),
                Expanded(child: body),
              ],
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(
            title: const _BrandMark(compact: false),
            actions: [
              IconButton(
                tooltip: 'Notifications',
                onPressed: () {},
                icon: const Icon(Icons.notifications_none),
              ),
              const SizedBox(width: 8),
            ],
          ),
          body: body,
          bottomNavigationBar: NavigationBar(
            selectedIndex: index,
            onDestinationSelected: (value) => setState(() => _section = _navigationItems[value].id),
            destinations: [
              for (final item in _navigationItems)
                NavigationDestination(icon: Icon(item.icon), label: item.label),
            ],
          ),
        );
      },
    );
  }
}

class _BrandMark extends StatelessWidget {
  const _BrandMark({required this.compact});
  final bool compact;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: Theme.of(context).colorScheme.primary,
            borderRadius: BorderRadius.circular(11),
          ),
          alignment: Alignment.center,
          child: const Text('T', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 22)),
        ),
        if (!compact) ...[
          const SizedBox(width: 10),
          const Text('TalkOS', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 20)),
        ],
      ],
    );
  }
}

class _SectionLanding extends StatelessWidget {
  const _SectionLanding({required this.section});
  final _Section section;

  @override
  Widget build(BuildContext context) {
    final title = _navigationItems.firstWhere((item) => item.id == section).label;
    return SafeArea(
      child: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 1100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontWeight: FontWeight.w800)),
                const SizedBox(height: 8),
                const Text('Talk of the Town · Restaurant Operating System'),
                const SizedBox(height: 24),
                const _SetupNotice(),
                if (section == _Section.overview) ...[
                  const SizedBox(height: 24),
                  Text('Operations modules', style: Theme.of(context).textTheme.titleLarge),
                  const SizedBox(height: 12),
                  const _ModuleGrid(),
                ] else ...[
                  const SizedBox(height: 24),
                  const _SetupNotice(message: 'This module is scheduled for implementation after the POS data and authorization foundations are verified.'),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SetupNotice extends StatelessWidget {
  const _SetupNotice({this.message});
  final String? message;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF4E5),
        border: Border.all(color: const Color(0xFFF0D6A8)),
        borderRadius: BorderRadius.circular(14),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.info_outline, color: Color(0xFF895A00)),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              message ?? 'Native application foundation. Authentication, live data, offline sync and branch permissions are not connected yet. No sample figures are presented as real business data.',
              style: const TextStyle(color: Color(0xFF654500), height: 1.4),
            ),
          ),
        ],
      ),
    );
  }
}

class _ModuleGrid extends StatelessWidget {
  const _ModuleGrid();

  static const modules = <({String title, String subtitle, IconData icon})>[
    (title: 'Point of Sale', subtitle: 'Billing and order entry', icon: Icons.point_of_sale_outlined),
    (title: 'Kitchen Display', subtitle: 'Preparation and ticket flow', icon: Icons.soup_kitchen_outlined),
    (title: 'Tables & QR', subtitle: 'Floor and table operations', icon: Icons.table_restaurant_outlined),
    (title: 'Inventory', subtitle: 'Stock and recipe control', icon: Icons.inventory_2_outlined),
    (title: 'Purchasing', subtitle: 'Suppliers and purchase orders', icon: Icons.shopping_bag_outlined),
    (title: 'Finance', subtitle: 'Cash, expenses and reports', icon: Icons.account_balance_wallet_outlined),
    (title: 'People', subtitle: 'Staff and attendance', icon: Icons.groups_outlined),
    (title: 'AI Assistant', subtitle: 'Business insights and actions', icon: Icons.auto_awesome_outlined),
  ];

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth >= 900 ? 4 : constraints.maxWidth >= 560 ? 2 : 1;
        return GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: modules.length,
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: columns,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            mainAxisExtent: 136,
          ),
          itemBuilder: (context, index) {
            final module = modules[index];
            return Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Row(
                  children: [
                    Icon(module.icon, size: 28, color: Theme.of(context).colorScheme.primary),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(module.title, style: const TextStyle(fontWeight: FontWeight.w700)),
                          const SizedBox(height: 4),
                          Text(module.subtitle, style: Theme.of(context).textTheme.bodySmall?.copyWith(color: Colors.black54)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }
}
