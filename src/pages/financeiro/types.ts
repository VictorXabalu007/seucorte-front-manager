export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionCategory = 
  | 'SERVICE' 
  | 'PRODUCT' 
  | 'RENT' 
  | 'UTILITIES' 
  | 'SUPPLIES' 
  | 'SALARY' 
  | 'MARKETING' 
  | 'OTHER';

export type PaymentMethod = 'CASH' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'TRANSFER';

export interface FinancialTransaction {
  id: string;
  date: string;
  type: TransactionType;
  category: TransactionCategory;
  description: string;
  value: number;
  paymentMethod: PaymentMethod;
  status: 'COMPLETED' | 'PENDING' | 'CANCELLED';
}

export interface FinancialSummary {
  totalIn: number;
  totalOut: number;
  netBalance: number;
  projectedRevenue: number;
  profitMargin: number;
}
