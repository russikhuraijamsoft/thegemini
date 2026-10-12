import { create } from 'zustand';
import { Floor, Table, Reservation, WaitlistEntry, TableStatus } from '../models/table';
import { tableService } from '../services/tableService';

interface TableState {
  floors: Floor[];
  tables: Table[];
  reservations: Reservation[];
  waitlist: WaitlistEntry[];
  loading: boolean;
  error: string | null;
  loadData: (dateStr: string) => Promise<void>;
  updateTableStatus: (tableId: string, status: TableStatus) => Promise<void>;
  updateTablePosition: (tableId: string, x: number, y: number) => Promise<void>;
  addTable: (table: Omit<Table, 'id'>) => Promise<void>;
  addFloor: (floor: Omit<Floor, 'id'>) => Promise<void>;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt'>) => Promise<void>;
}

export const useTableStore = create<TableState>((set, get) => ({
  floors: [],
  tables: [],
  reservations: [],
  waitlist: [],
  loading: false,
  error: null,
  
  loadData: async (dateStr) => {
    set({ loading: true, error: null });
    try {
      const [floors, tables, reservations, waitlist] = await Promise.all([
        tableService.getFloors(),
        tableService.getTables(),
        tableService.getReservations(dateStr),
        tableService.getWaitlist()
      ]);
      set({ floors, tables, reservations, waitlist, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  
  updateTableStatus: async (tableId, status) => {
    try {
      await tableService.updateTable(tableId, { status });
      set(state => ({
        tables: state.tables.map(t => t.id === tableId ? { ...t, status } : t)
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  updateTablePosition: async (tableId, positionX, positionY) => {
    try {
      await tableService.updateTable(tableId, { positionX, positionY });
      set(state => ({
        tables: state.tables.map(t => t.id === tableId ? { ...t, positionX, positionY } : t)
      }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
  
  addTable: async (tableData) => {
    try {
      const newTable = await tableService.addTable(tableData);
      set(state => ({ tables: [...state.tables, newTable] }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
  
  addFloor: async (floorData) => {
    try {
      const newFloor = await tableService.addFloor(floorData);
      set(state => ({ floors: [...state.floors, newFloor] }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },
  
  addReservation: async (reservationData) => {
    try {
      const newReservation = await tableService.addReservation(reservationData);
      set(state => ({ reservations: [...state.reservations, newReservation] }));
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  }
}));
