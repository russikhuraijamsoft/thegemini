export type OrderStatus = 'NEW' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'PACKED' | 'SERVED' | 'DELIVERED' | 'CANCELLED' | 'REJECTED';
export type TicketItemStatus = 'PENDING' | 'PREPARING' | 'READY' | 'CANCELLED';
export type OrderType = 'DINE_IN' | 'TAKEAWAY' | 'DELIVERY';
export type Priority = 'NORMAL' | 'HIGH' | 'URGENT';

export interface Station {
  id: string;
  name: string;
  type: 'KITCHEN' | 'BAR' | 'PACKING' | 'DISPATCH' | 'EXPEDITOR';
  isActive: boolean;
}

export interface TicketItem {
  id: string;
  productId: string;
  productName: string;
  size?: string;
  quantity: number;
  modifiers: string[];
  notes?: string;
  stationId: string;
  status: TicketItemStatus;
  completedAt?: string;
}

export interface Ticket {
  id: string;
  orderId: string;
  orderNumber: string;
  type: OrderType;
  tableNumber?: string;
  customerName?: string;
  status: OrderStatus;
  items: TicketItem[];
  createdAt: string;
  targetTime: string; // ISO string
  acceptedAt?: string;
  completedAt?: string;
  priority: Priority;
}
