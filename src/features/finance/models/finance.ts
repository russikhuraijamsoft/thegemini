export type AccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
export type AccountGroup = 'CURRENT_ASSET' | 'FIXED_ASSET' | 'CURRENT_LIABILITY' | 'LONG_TERM_LIABILITY' | 'REVENUE' | 'COST_OF_SALES' | 'OPERATING_EXPENSE' | 'OTHER_INCOME' | 'OTHER_EXPENSE';

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  group: AccountGroup;
  balance: number;
  isActive: boolean;
  description?: string;
}

export type TransactionStatus = 'DRAFT' | 'POSTED' | 'VOIDED';

export interface TransactionLine {
  id: string;
  accountId: string;
  accountName: string;
  description?: string;
  debit: number;
  credit: number;
}

export interface Transaction {
  id: string;
  date: string;
  reference: string;
  description: string;
  status: TransactionStatus;
  lines: TransactionLine[];
  totalDebit: number;
  totalCredit: number;
  createdBy: string;
  createdAt: string;
}

export type ExpenseStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  description: string;
  status: ExpenseStatus;
  receiptUrl?: string;
  paymentMethod: string;
  createdBy: string;
  createdAt: string;
}
