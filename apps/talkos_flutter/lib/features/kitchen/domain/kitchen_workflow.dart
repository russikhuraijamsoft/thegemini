import '../../inventory/domain/inventory_deduction_engine.dart';

enum KitchenTicketStatus { accepted, cooking, ready, completed, cancelled }

class KitchenTicket {
  const KitchenTicket({
    required this.id,
    required this.inventoryOrder,
    this.status = KitchenTicketStatus.accepted,
  }) : assert(id == inventoryOrder.orderId);

  final String id;
  final InventoryCookingOrder inventoryOrder;
  final KitchenTicketStatus status;

  KitchenTicket withStatus(KitchenTicketStatus value) => KitchenTicket(
        id: id,
        inventoryOrder: inventoryOrder,
        status: value,
      );
}

class KitchenState {
  KitchenState({
    required Map<String, KitchenTicket> tickets,
    required this.inventory,
  }) : tickets = Map.unmodifiable(tickets) {
    if (tickets.entries.any((entry) => entry.key != entry.value.id)) {
      throw ArgumentError('Kitchen tickets must be keyed by their order ID.');
    }
  }

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
      tickets: {
        ...current.tickets,
        orderId: ticket.withStatus(to),
      },
      inventory: nextInventory,
    );
  }
}
