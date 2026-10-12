export type ReportType = 'SALES' | 'INVENTORY' | 'FINANCE' | 'HR' | 'KITCHEN' | 'CRM' | 'PURCHASING';
export type TimeFilter = 'TODAY' | 'WEEK' | 'MONTH' | 'YEAR' | 'CUSTOM';

export interface SalesReport {
  date: string;
  grossRevenue: number;
  netRevenue: number;
  totalOrders: number;
  averageBillValue: number;
}

export interface ExpenseReport {
  category: string;
  amount: number;
}

export interface InventoryReport {
  item: string;
  consumed: number;
  wasted: number;
  stockValue: number;
}

export interface DashboardMetrics {
  todaySales: number;
  weeklySales: number;
  monthlySales: number;
  grossProfit: number;
  netProfit: number;
  foodCostPercentage: number;
  labourCostPercentage: number;
  operatingExpenses: number;
}
