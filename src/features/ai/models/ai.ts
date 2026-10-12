export type AiInsightType = 'SALES' | 'INVENTORY' | 'MENU' | 'CRM' | 'HR' | 'FINANCE';
export type AiAlertPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AiInsight {
  id: string;
  type: AiInsightType;
  title: string;
  description: string;
  recommendation: string;
  impact?: string;
  timestamp: string;
}

export interface AiAlert {
  id: string;
  priority: AiAlertPriority;
  message: string;
  timestamp: string;
}

export interface AiForecast {
  date: string;
  projectedSales: number;
  projectedOrders: number;
  confidence: number;
}
