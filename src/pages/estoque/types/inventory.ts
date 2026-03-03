export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  unit: string;
  status: 'SAFE' | 'LOW' | 'CRITICAL';
  isActive: boolean;
  commissionType: 'PERCENTAGE' | 'FIXED';
  commissionValue: number;
  linkedService?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryStats {
  totalItems: number;
  lowStockCount: number;
  monthlyConsumption: number;
  efficiency: number;
}

export interface InventoryFormData {
  name: string;
  description?: string;
  category: string;
  price: string;
  stock: string;
  minStock: string;
  unit: string;
  commissionType: 'PERCENTAGE' | 'FIXED';
  commissionValue: string;
  linkedService?: string;
}
