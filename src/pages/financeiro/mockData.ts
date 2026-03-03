import type { FinancialTransaction, FinancialSummary } from "./types";

export const mockTransactions: FinancialTransaction[] = [
  {
    id: "1",
    date: new Date().toISOString(),
    type: "INCOME",
    category: "SERVICE",
    description: "Corte de Cabelo + Barba - Reserva #123",
    value: 85.00,
    paymentMethod: "PIX",
    status: "COMPLETED"
  },
  {
    id: "2",
    date: new Date(Date.now() - 3600000).toISOString(),
    type: "EXPENSE",
    category: "SUPPLIES",
    description: "Compra de Shampoos e Pomadas",
    value: 450.00,
    paymentMethod: "CREDIT_CARD",
    status: "COMPLETED"
  },
  {
    id: "3",
    date: new Date(Date.now() - 86400000).toISOString(),
    type: "EXPENSE",
    category: "RENT",
    description: "Aluguel da Sala - Março",
    value: 2500.00,
    paymentMethod: "TRANSFER",
    status: "COMPLETED"
  },
  {
    id: "4",
    date: new Date(Date.now() - 172800000).toISOString(),
    type: "INCOME",
    category: "PRODUCT",
    description: "Venda Kit Barba Premium",
    value: 120.00,
    paymentMethod: "DEBIT_CARD",
    status: "COMPLETED"
  },
  {
    id: "5",
    date: new Date(Date.now() - 259200000).toISOString(),
    type: "EXPENSE",
    category: "UTILITIES",
    description: "Conta de Energia Elétrica",
    value: 380.50,
    paymentMethod: "PIX",
    status: "COMPLETED"
  }
];

export const mockFinancialSummary: FinancialSummary = {
  totalIn: 12450.00,
  totalOut: 5800.00,
  netBalance: 6650.00,
  projectedRevenue: 15000.00,
  profitMargin: 53.4
};
