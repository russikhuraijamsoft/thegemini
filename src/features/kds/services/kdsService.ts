import { collection, query, where, onSnapshot, doc, updateDoc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { Ticket, Station, TicketItemStatus, OrderStatus, TicketItem } from '../models/kds';
import { db } from '../../../core/firebase/firebaseConfig';

class KdsService {
  async getStations(): Promise<Station[]> {
    if (!db) {
      return [
        { id: 'st_1', name: 'Grill Station', type: 'KITCHEN', isActive: true },
        { id: 'st_2', name: 'Salad Station', type: 'KITCHEN', isActive: true },
        { id: 'st_3', name: 'Drink Station', type: 'BAR', isActive: true }
      ];
    }
    const q = query(collection(db, 'stations'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Station));
  }

  // Real-time listener for tickets
  subscribeToTickets(stationId: string | null, callback: (tickets: Ticket[]) => void, onError: (error: Error) => void): () => void {
    if (!db) {
      // Mock data when no DB
      const mockTickets: Ticket[] = [
        {
          id: 't_1',
          orderId: 'ord_1',
          orderNumber: 'ORD-10024',
          tableNumber: 'Table 4',
          type: 'DINE_IN',
          status: 'NEW',
          items: [
            { id: 'ti_1', productId: 'prod_chow_chicken', productName: 'Chicken Chowmein — Medium', size: 'Medium', quantity: 2, status: 'PENDING', stationId: 'st_1', modifiers: [], notes: 'Extra spicy' },
            { id: 'ti_2', productId: 'prod_fr_chicken', productName: 'Chicken Fried Rice — Small', size: 'Small', quantity: 1, status: 'PENDING', stationId: 'st_2', modifiers: [] }
          ],
          createdAt: new Date().toISOString(),
          targetTime: new Date(Date.now() + 30 * 60000).toISOString(),
          priority: 'NORMAL'
        }
      ];
      callback(mockTickets);
      return () => {};
    }

    const ticketsRef = collection(db, 'tickets');
    const q = query(
      ticketsRef, 
      where('status', 'in', ['NEW', 'ACCEPTED', 'PREPARING', 'READY'])
    );

    return onSnapshot(q, (snapshot) => {
      const tickets: Ticket[] = [];
      snapshot.forEach((doc) => {
        tickets.push({ id: doc.id, ...doc.data() } as Ticket);
      });
      callback(tickets);
    }, (error) => {
      onError(error);
    });
  }

  async updateTicketStatus(ticketId: string, status: OrderStatus): Promise<void> {
    if (!db) return;
    const ticketRef = doc(db, 'tickets', ticketId);
    await updateDoc(ticketRef, { 
      status,
      ...(status === 'ACCEPTED' ? { acceptedAt: new Date().toISOString() } : {}),
      ...(status === 'READY' ? { completedAt: new Date().toISOString() } : {})
    });
  }

  async updateItemStatus(ticketId: string, itemId: string, status: TicketItemStatus, items: TicketItem[]): Promise<void> {
    if (!db) return;
    const ticketRef = doc(db, 'tickets', ticketId);
    const updatedItems = items.map(item => 
      item.id === itemId 
        ? { ...item, status, ...(status === 'READY' ? { completedAt: new Date().toISOString() } : {}) } 
        : item
    );
    
    // Auto-update ticket status if all items are ready
    const allReady = updatedItems.every(i => i.status === 'READY');
    
    await updateDoc(ticketRef, { 
      items: updatedItems,
      ...(allReady ? { status: 'READY', completedAt: new Date().toISOString() } : {})
    });
  }

  async createTicket(ticketData: Omit<Ticket, 'id' | 'createdAt'>): Promise<Ticket> {
    const newTicket: Ticket = {
      ...ticketData,
      id: `t_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    if (db) {
      try {
        const cleanTicket = JSON.parse(JSON.stringify(newTicket));
        await Promise.race([
          setDoc(doc(db, 'tickets', newTicket.id), cleanTicket),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout writing ticket to Firestore')), 1500))
        ]);
      } catch (err) {
        console.warn("Could not save ticket to Firestore:", err);
      }
    }
    return newTicket;
  }

  async addStation(stationData: Omit<Station, 'id'>): Promise<Station> {
    if (!db) {
      return {
        ...stationData,
        id: `st_${Date.now()}`
      };
    }
    const newStation: Station = {
      ...stationData,
      id: `st_${Date.now()}`
    };
    await setDoc(doc(db, 'stations', newStation.id), newStation);
    return newStation;
  }

  async updateStation(id: string, data: Partial<Station>): Promise<void> {
    if (!db) return;
    await updateDoc(doc(db, 'stations', id), data);
  }

  async deleteStation(id: string): Promise<void> {
    if (!db) return;
    await deleteDoc(doc(db, 'stations', id));
  }
}

export const kdsService = new KdsService();
