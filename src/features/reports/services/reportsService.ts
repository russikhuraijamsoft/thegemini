import { collection, query, getDocs } from 'firebase/firestore';
import { SalesReport, ExpenseReport, DashboardMetrics } from '../models/reports';
import { db } from '../../../core/firebase/firebaseConfig';

class ReportsService {
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'reports_metrics'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const data = snapshot.docs[0].data();
      return { id: snapshot.docs[0].id, ...data } as unknown as DashboardMetrics;
    }
    return {
      todaySales: 125000,
      weeklySales: 850000,
      monthlySales: 3500000,
      grossProfit: 2100000,
      netProfit: 850000,
      foodCostPercentage: 28.5,
      labourCostPercentage: 18.2,
      operatingExpenses: 450000
    };
  }

  async getSalesTrend(): Promise<SalesReport[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'reports_sales_trend'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data } as unknown as SalesReport;
    });
  }

  async getExpenseBreakdown(): Promise<ExpenseReport[]> {
    if (!db) throw new Error("Firestore is not initialized");
    const q = query(collection(db, 'reports_expense_breakdown'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return { id: doc.id, ...data } as unknown as ExpenseReport;
    });
  }
}

export const reportsService = new ReportsService();
