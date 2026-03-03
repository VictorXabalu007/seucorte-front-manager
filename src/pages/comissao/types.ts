export type CommissionType = "SERVICE" | "PRODUCT";
export type PaymentStatus = "PENDING" | "PAID";

export interface CommissionTransaction {
  id: string;
  date: string;
  type: CommissionType;
  description: string;
  barberId: string;
  barberName: string;
  totalValue: number;
  commissionValue: number;
  houseValue: number;
  status: PaymentStatus;
}

export interface BarberCommissionStats {
  barberId: string;
  barberName: string;
  avatar?: string;
  totalServices: number;
  totalProducts: number;
  totalRevenue: number;
  totalCommission: number;
  paidCommission: number;
  pendingCommission: number;
}

export interface CommissionSummary {
  totalRevenue: number;
  totalCommissions: number;
  houseNet: number;
  pendingPayments: number;
  transactions: CommissionTransaction[];
  barberStats: BarberCommissionStats[];
}
