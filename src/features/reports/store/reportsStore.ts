import { create } from 'zustand';
import { SalesReport, ExpenseReport, DashboardMetrics, TimeFilter } from '../models/reports';
import { reportsService } from '../services/reportsService';

interface ReportsState {
  metrics: DashboardMetrics | null;
  salesTrend: SalesReport[];
  expenseBreakdown: ExpenseReport[];
  loading: boolean;
  error: string | null;
  timeFilter: TimeFilter;
  
  setTimeFilter: (filter: TimeFilter) => void;
  loadReports: () => Promise<void>;
}

export const useReportsStore = create<ReportsState>((set) => ({
  metrics: null,
  salesTrend: [],
  expenseBreakdown: [],
  loading: false,
  error: null,
  timeFilter: 'MONTH',

  setTimeFilter: (filter) => set({ timeFilter: filter }),

  loadReports: async () => {
    set({ loading: true, error: null });
    try {
      const [metrics, salesTrend, expenseBreakdown] = await Promise.all([
        reportsService.getDashboardMetrics(),
        reportsService.getSalesTrend(),
        reportsService.getExpenseBreakdown()
      ]);
      set({ metrics, salesTrend, expenseBreakdown, loading: false });
    } catch (e: any) {
      set({ error: e.message, loading: false });
    }
  }
}));
