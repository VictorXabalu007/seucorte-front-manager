export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  salePrice: number;
  costPrice: number;
  stock: number;
  minStock: number;
  status: 'SAFE' | 'LOW' | 'CRITICAL';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStats {
  totalItems: number;
  totalCost: number;
  totalPotentialRevenue: number;
  totalPotentialProfit: number;
  lowStockItems: number;
}

export interface InventoryFormData {
  name: string;
  description?: string;
  category: string;
  salePrice: number;
  costPrice: number;
  stock: string;
  minStock: string;
}
