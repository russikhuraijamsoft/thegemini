export interface Floor {
  id: string;
  name: string;
  zone: string;
  isActive: boolean;
  order: number;
}

export type TableStatus = 'AVAILABLE' | 'RESERVED' | 'OCCUPIED' | 'CLEANING' | 'MAINTENANCE' | 'OUT_OF_SERVICE';
export type TableShape = 'SQUARE' | 'RECTANGLE' | 'ROUND';

export interface Table {
  id: string;
  floorId: string;
  tableNumber: string;
  capacity: number;
  shape: TableShape;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  status: TableStatus;
  mergedWith?: string[];
  locked: boolean;
}

export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'SEATED' | 'CANCELLED' | 'NO_SHOW';

export interface Reservation {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  date: string;
  time: string;
  tableId?: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  customerName: string;
  customerPhone: string;
  guestCount: number;
  estimatedWaitMinutes: number;
  quotedTime: string;
  notes?: string;
  status: 'WAITING' | 'SEATED' | 'CANCELLED' | 'NO_SHOW';
  createdAt: string;
}
