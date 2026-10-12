import { create } from 'zustand';
import { Ticket, Station, OrderStatus, TicketItemStatus } from '../models/kds';
import { kdsService } from '../services/kdsService';

interface KdsState {
  stations: Station[];
  tickets: Ticket[];
  activeStationId: string | null;
  loading: boolean;
  
  // Actions
  loadStations: () => Promise<void>;
  setActiveStation: (stationId: string | null) => void;
  subscribeToTickets: () => () => void;
  updateTicketStatus: (ticketId: string, status: OrderStatus) => Promise<void>;
  updateItemStatus: (ticketId: string, itemId: string, status: TicketItemStatus) => Promise<void>;
  
  // Local optimistic updates
  _optimisticUpdateTicketStatus: (ticketId: string, status: OrderStatus) => void;
  _optimisticUpdateItemStatus: (ticketId: string, itemId: string, status: TicketItemStatus) => void;
}

export const useKdsStore = create<KdsState>((set, get) => ({
  stations: [],
  tickets: [],
  activeStationId: null,
  loading: false,

  loadStations: async () => {
    set({ loading: true });
    try {
      const stations = await kdsService.getStations();
      set({ stations, loading: false });
      if (stations.length > 0 && !get().activeStationId) {
        set({ activeStationId: stations[0].id });
      }
    } catch (error) {
      console.error('Failed to load stations', error);
      set({ loading: false });
    }
  },

  setActiveStation: (stationId) => {
    set({ activeStationId: stationId });
  },

  subscribeToTickets: () => {
    const unsubscribe = kdsService.subscribeToTickets(
      get().activeStationId,
      (tickets) => set({ tickets }),
      (error) => console.error("Ticket subscription error:", error)
    );
    return unsubscribe;
  },

  updateTicketStatus: async (ticketId, status) => {
    // Optimistic update
    get()._optimisticUpdateTicketStatus(ticketId, status);
    // Real update
    await kdsService.updateTicketStatus(ticketId, status);
  },

  updateItemStatus: async (ticketId, itemId, status) => {
    // Optimistic update
    get()._optimisticUpdateItemStatus(ticketId, itemId, status);
    
    // Find items for real update
    const ticket = get().tickets.find(t => t.id === ticketId);
    if (ticket) {
      await kdsService.updateItemStatus(ticketId, itemId, status, ticket.items);
    }
  },
  
  _optimisticUpdateTicketStatus: (ticketId, status) => {
    set((state) => ({
      tickets: state.tickets.map((t) => 
        t.id === ticketId ? { ...t, status } : t
      )
    }));
  },
  
  _optimisticUpdateItemStatus: (ticketId, itemId, status) => {
     set((state) => ({
      tickets: state.tickets.map((t) => {
        if (t.id === ticketId) {
          const updatedItems = t.items.map(item => item.id === itemId ? { ...item, status } : item);
          const allReady = updatedItems.every(i => i.status === 'READY');
          return { 
            ...t, 
            items: updatedItems,
            status: allReady ? 'READY' : t.status
          };
        }
        return t;
      })
    }));
  }
}));
