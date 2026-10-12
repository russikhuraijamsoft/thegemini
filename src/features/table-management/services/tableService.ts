import { collection, query, getDocs, doc, setDoc, updateDoc, deleteDoc, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../../core/firebase/firebaseConfig';
import { Floor, Table, Reservation, WaitlistEntry, TableStatus } from '../models/table';

class TableService {
  async getFloors(): Promise<Floor[]> {
    if (!db) {
       // Mock for testing
       return [
         { id: 'f1', name: 'Main Hall', zone: 'Indoor', isActive: true, order: 1 },
         { id: 'f2', name: 'Patio', zone: 'Outdoor', isActive: true, order: 2 }
       ];
    }
    const q = query(collection(db, 'table_floors'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Seed some initial floors
      const seedFloors = [
        { id: 'f1', name: 'Main Hall', zone: 'Indoor', isActive: true, order: 1 },
        { id: 'f2', name: 'Patio', zone: 'Outdoor', isActive: true, order: 2 }
      ];
      for (const floor of seedFloors) {
        await setDoc(doc(db, 'table_floors', floor.id), floor);
      }
      return seedFloors;
    }
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Floor)).sort((a, b) => a.order - b.order);
  }

  async getTables(): Promise<Table[]> {
    if (!db) {
       return [
         { id: 't1', floorId: 'f1', tableNumber: '1', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false },
         { id: 't2', floorId: 'f1', tableNumber: '2', capacity: 4, shape: 'RECTANGLE', positionX: 150, positionY: 50, width: 100, height: 60, status: 'OCCUPIED', locked: false },
         { id: 't3', floorId: 'f1', tableNumber: '3', capacity: 4, shape: 'ROUND', positionX: 300, positionY: 50, width: 80, height: 80, status: 'RESERVED', locked: false },
         { id: 't4', floorId: 'f2', tableNumber: '10', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false }
       ];
    }
    const q = query(collection(db, 'table_items'));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
       const seedTables: Table[] = [
         { id: 't1', floorId: 'f1', tableNumber: '1', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false },
         { id: 't2', floorId: 'f1', tableNumber: '2', capacity: 4, shape: 'RECTANGLE', positionX: 150, positionY: 50, width: 100, height: 60, status: 'OCCUPIED', locked: false },
         { id: 't3', floorId: 'f1', tableNumber: '3', capacity: 4, shape: 'ROUND', positionX: 300, positionY: 50, width: 80, height: 80, status: 'RESERVED', locked: false },
         { id: 't4', floorId: 'f2', tableNumber: '10', capacity: 2, shape: 'SQUARE', positionX: 50, positionY: 50, width: 60, height: 60, status: 'AVAILABLE', locked: false }
       ];
       for (const table of seedTables) {
         await setDoc(doc(db, 'table_items', table.id), table);
       }
       return seedTables;
    }
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table));
  }
  
  async getReservations(dateStr: string): Promise<Reservation[]> {
    if (!db) return [];
    const q = query(collection(db, 'table_reservations'), where('date', '==', dateStr));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
  }

  async getWaitlist(): Promise<WaitlistEntry[]> {
    if (!db) return [];
    const q = query(collection(db, 'table_waitlist'), where('status', '==', 'WAITING'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaitlistEntry));
  }

  subscribeToTables(callback: (tables: Table[]) => void) {
    if (!db) return () => {};
    const q = query(collection(db, 'table_items'));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Table)));
    });
  }
  
  subscribeToReservations(dateStr: string, callback: (reservations: Reservation[]) => void) {
    if (!db) return () => {};
    const q = query(collection(db, 'table_reservations'), where('date', '==', dateStr));
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation)));
    });
  }

  async updateTable(id: string, data: Partial<Table>): Promise<void> {
    if (!db) return;
    await updateDoc(doc(db, 'table_items', id), data);
  }
  
  async addTable(data: Omit<Table, 'id'>): Promise<Table> {
    if (!db) throw new Error("Firebase not initialized");
    const newTable: Table = {
      ...data,
      id: `tbl_${Date.now()}`
    };
    await setDoc(doc(db, 'table_items', newTable.id), newTable);
    return newTable;
  }
  
  async addReservation(data: Omit<Reservation, 'id' | 'createdAt'>): Promise<Reservation> {
    if (!db) throw new Error("Firebase not initialized");
    const newReservation: Reservation = {
      ...data,
      id: `res_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'table_reservations', newReservation.id), newReservation);
    return newReservation;
  }
  
  async addFloor(data: Omit<Floor, 'id'>): Promise<Floor> {
    if (!db) throw new Error("Firebase not initialized");
    const newFloor: Floor = {
      ...data,
      id: `flr_${Date.now()}`
    };
    await setDoc(doc(db, 'table_floors', newFloor.id), newFloor);
    return newFloor;
  }
}

export const tableService = new TableService();
