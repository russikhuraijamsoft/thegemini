import 'package:flutter/material.dart';

import '../../inventory/domain/inventory_deduction_engine.dart';
import '../domain/kitchen_workflow.dart';

class KitchenDisplayScreen extends StatelessWidget {
  const KitchenDisplayScreen({
    super.key,
    this.state,
    this.onStateChanged,
  });

  /// Orders and inventory must come from the authorised branch repository.
  final KitchenState? state;

  /// Receives the immutable next state so a repository can persist the change.
  final ValueChanged<KitchenState>? onStateChanged;

  @override
  Widget build(BuildContext context) {
    final kitchenState = state;
    if (kitchenState == null) {
      return const _KitchenEmptyState(
        title: 'Kitchen orders not connected',
        message: 'Connect the authorised branch order feed to display live tickets.',
      );
    }

    final tickets = kitchenState.tickets.values
        .where((ticket) =>
            ticket.status != KitchenTicketStatus.completed &&
            ticket.status != KitchenTicketStatus.cancelled)
        .toList()
      ..sort((a, b) => a.id.compareTo(b.id));

    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Kitchen display', style: Theme.of(context).textTheme.headlineMedium),
            const SizedBox(height: 8),
            const Text('Accepted orders appear here from the active branch feed.'),
            const SizedBox(height: 20),
            Expanded(
              child: tickets.isEmpty
                  ? const _KitchenEmptyState(
                      title: 'No active kitchen tickets',
                      message: 'New accepted orders will appear here.',
                    )
                  : ListView.separated(
                      itemCount: tickets.length,
                      separatorBuilder: (context, index) => const SizedBox(height: 12),
                      itemBuilder: (context, index) => _KitchenTicketCard(
                        ticket: tickets[index],
                        canUpdate: onStateChanged != null,
                        onTransition: (status) => _transition(context, kitchenState, tickets[index], status),
                      ),
                    ),
            ),
          ],
        ),
      ),
    );
  }

  void _transition(
    BuildContext context,
    KitchenState current,
    KitchenTicket ticket,
    KitchenTicketStatus status,
  ) {
    try {
      final next = const KitchenWorkflow().transition(
        current,
        orderId: ticket.id,
        to: status,
      );
      onStateChanged?.call(next);
    } on InsufficientInventoryException catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Cannot start cooking: insufficient stock for ${error.itemId}.')),
      );
    } on MissingInventoryRecipeException catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Cannot start cooking: no recipe for ${error.productId}.')),
      );
    }
  }
}

class _KitchenTicketCard extends StatelessWidget {
  const _KitchenTicketCard({
    required this.ticket,
    required this.canUpdate,
    required this.onTransition,
  });

  final KitchenTicket ticket;
  final bool canUpdate;
  final ValueChanged<KitchenTicketStatus> onTransition;

  @override
  Widget build(BuildContext context) {
    final tableLabel = ticket.tableLabel;
    final statusColor = switch (ticket.status) {
      KitchenTicketStatus.accepted => Colors.blueGrey,
      KitchenTicketStatus.cooking => Colors.deepOrange,
      KitchenTicketStatus.ready => Colors.green,
      KitchenTicketStatus.completed || KitchenTicketStatus.cancelled => Colors.grey,
    };
    final nextStatus = switch (ticket.status) {
      KitchenTicketStatus.accepted => KitchenTicketStatus.cooking,
      KitchenTicketStatus.cooking => KitchenTicketStatus.ready,
      KitchenTicketStatus.ready => KitchenTicketStatus.completed,
      KitchenTicketStatus.completed || KitchenTicketStatus.cancelled => null,
    };

    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Text(
                    tableLabel == null || tableLabel.isEmpty ? 'Order ${ticket.id}' : tableLabel,
                    style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w700),
                  ),
                ),
                Chip(
                  label: Text(_statusLabel(ticket.status)),
                  labelStyle: TextStyle(color: statusColor, fontWeight: FontWeight.w700),
                ),
              ],
            ),
            for (final line in ticket.inventoryOrder.lines)
              Padding(
                padding: const EdgeInsets.only(top: 8),
                child: Text(
                  '${line.quantity} × ${ticket.productNames[line.productId] ?? line.productId}',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ),
            const SizedBox(height: 12),
            if (nextStatus != null)
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  FilledButton(
                    onPressed: canUpdate ? () => onTransition(nextStatus) : null,
                    child: Text(_actionLabel(nextStatus)),
                  ),
                  if (ticket.status == KitchenTicketStatus.accepted)
                    OutlinedButton(
                      onPressed: canUpdate
                          ? () => onTransition(KitchenTicketStatus.cancelled)
                          : null,
                      child: const Text('Cancel ticket'),
                    ),
                ],
              ),
          ],
        ),
      ),
    );
  }
}

class _KitchenEmptyState extends StatelessWidget {
  const _KitchenEmptyState({required this.title, required this.message});

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
              const Icon(Icons.soup_kitchen_outlined, size: 40),
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

String _statusLabel(KitchenTicketStatus status) => switch (status) {
      KitchenTicketStatus.accepted => 'Accepted',
      KitchenTicketStatus.cooking => 'Cooking',
      KitchenTicketStatus.ready => 'Ready',
      KitchenTicketStatus.completed => 'Completed',
      KitchenTicketStatus.cancelled => 'Cancelled',
    };

String _actionLabel(KitchenTicketStatus status) => switch (status) {
      KitchenTicketStatus.cooking => 'Start cooking',
      KitchenTicketStatus.ready => 'Mark ready',
      KitchenTicketStatus.completed => 'Complete order',
      KitchenTicketStatus.accepted || KitchenTicketStatus.cancelled => 'Update ticket',
    };
