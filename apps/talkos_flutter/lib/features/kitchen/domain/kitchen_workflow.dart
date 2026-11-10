import '../../inventory/domain/inventory_deduction_engine.dart';

enum KitchenTicketStatus { accepted, cooking, ready, completed, cancelled }

class KitchenTicket {
  KitchenTicket({
    required this.id,
    required this.branchId,
    required this.inventoryOrder,
    this.status = KitchenTicketStatus.accepted,
    this.tableLabel,
    Map<String, String> productNames = const {},
  }) : productNames = Map.unmodifiable(productNames) {
    if (branchId.trim().isEmpty) {
      throw ArgumentError.value(branchId, 'branchId', 'Branch ID cannot be empty.');
    }
    if (id != inventoryOrder.orderId) {
      throw ArgumentError.value(
        id,
        'id',
        'Ticket ID must match its inventory order ID.',
      );
    }
  }

  final String id;
  final String branchId;
  final InventoryCookingOrder inventoryOrder;
  final KitchenTicketStatus status;
  final String? tableLabel;
  final Map<String, String> productNames;

  KitchenTicket withStatus(KitchenTicketStatus value) => KitchenTicket(
        id: id,
        branchId: branchId,
        inventoryOrder: inventoryOrder,
        status: value,
        tableLabel: tableLabel,
        productNames: productNames,
      );
}

class KitchenState {
  KitchenState({
    required this.branchId,
    required Map<String, KitchenTicket> tickets,
    required this.inventory,
  }) : tickets = Map.unmodifiable(tickets) {
    if (branchId.trim().isEmpty) {
      throw ArgumentError.value(branchId, 'branchId', 'Branch ID cannot be empty.');
    }
    if (tickets.entries.any((entry) => entry.key != entry.value.id)) {
      throw ArgumentError('Kitchen tickets must be keyed by their order ID.');
    }
    if (tickets.values.any((ticket) => ticket.branchId != branchId)) {
      throw ArgumentError('Kitchen tickets must belong to the state branch.');
    }
  }

  final String branchId;
  final Map<String, KitchenTicket> tickets;
  final InventoryState inventory;
}

/// Applies allowed KDS status changes and consumes inventory when cooking starts.
///
/// Persistence must atomically save the returned ticket status and inventory
/// movements. A server repository should retry this transition with the same
/// order ID so [InventoryDeductionEngine] can enforce idempotency.
class KitchenWorkflow {
  const KitchenWorkflow({this.inventoryEngine = const InventoryDeductionEngine()});

  final InventoryDeductionEngine inventoryEngine;

  KitchenState transition(
    KitchenState current, {
    required String orderId,
    required KitchenTicketStatus to,
  }) {
    final ticket = current.tickets[orderId];
    if (ticket == null) throw StateError('Kitchen ticket does not exist.');
    if (ticket.status == to) return current;

    final canTransition = switch ((ticket.status, to)) {
      (KitchenTicketStatus.accepted, KitchenTicketStatus.cooking) => true,
      (KitchenTicketStatus.accepted, KitchenTicketStatus.cancelled) => true,
      (KitchenTicketStatus.cooking, KitchenTicketStatus.ready) => true,
      (KitchenTicketStatus.ready, KitchenTicketStatus.completed) => true,
      _ => false,
    };
    if (!canTransition) {
      throw StateError('Cannot move a ${ticket.status.name} ticket to ${to.name}.');
    }

    final nextInventory = to == KitchenTicketStatus.cooking
        ? inventoryEngine.startCooking(current.inventory, ticket.inventoryOrder)
        : current.inventory;
    return KitchenState(
      branchId: current.branchId,
      tickets: {
        ...current.tickets,
        orderId: ticket.withStatus(to),
      },
      inventory: nextInventory,
    );
  }
}
