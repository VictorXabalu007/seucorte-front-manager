export type TransactionType = 'ENTRADA' | 'SAIDA';
export type TransactionOrigem = 'AGENDAMENTO' | 'PRODUTO_VENDA' | 'ASSINATURA' | 'COMISSAO' | 'RESTOCK' | 'MANUAL';

export type TransactionCategory = 
  | 'SERVICE' 
  | 'PRODUCT' 
  | 'SUBSCRIPTION'
  | 'COMMISSION'
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
  tipo: TransactionType;
  origem: TransactionOrigem;
  categoria: TransactionCategory;
  descricao: string;
  valor: number;
  paymentMethod?: PaymentMethod;
  agendamentoId?: string;
  comissaoId?: string;
  produtoEstoqueId?: string;
  assinaturaFaturaId?: string;
}

export interface FinancialSummary {
  totalIn: number;
  totalOut: number;
  netBalance: number;
  profitMargin: number;
  totalTransactions: number;
}
