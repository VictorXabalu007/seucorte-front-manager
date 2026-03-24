import api from "@/lib/api";
import { getActiveUnidadeId } from "@/lib/auth";
import type { InventoryItem, InventoryStats } from "../types/inventory";

export const inventoryService = {
  getItems: async (params?: { search?: string; category?: string }): Promise<InventoryItem[]> => {
    const unidadeId = getActiveUnidadeId() || "";
    const response = await api.get<InventoryItem[]>("/inventory", { 
      params: { ...params, unidadeId } 
    });
    return response.data;
  },

  getStats: async (): Promise<InventoryStats> => {
    const unidadeId = getActiveUnidadeId() || "";
    const response = await api.get<InventoryStats>("/inventory/stats", {
      params: { unidadeId }
    });
    return response.data;
  },

  createItem: async (data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await api.post<InventoryItem>("/inventory", data);
    return response.data;
  },

  updateItem: async (id: string, data: Partial<InventoryItem>): Promise<InventoryItem> => {
    const response = await api.patch<InventoryItem>(`/inventory/${id}`, data);
    return response.data;
  },

  restock: async (id: string, quantity: number): Promise<InventoryItem> => {
    const response = await api.post<InventoryItem>(`/inventory/${id}/restock`, { quantity });
    return response.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },

  // Mock data generator for development
  getMockItems: (): InventoryItem[] => [
    {
      id: "1",
      name: "Pomada Matte Suavecito",
      description: "Pote de 150g - Premium",
      category: "Cabelo",
      salePrice: 85.00,
      costPrice: 45.00,
      stock: 42,
      minStock: 10,
      status: "SAFE",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Lâmina Derby Extra",
      description: "Caixa com 100un",
      category: "Insumos",
      salePrice: 45.00,
      costPrice: 20.00,
      stock: 5,
      minStock: 15,
      status: "CRITICAL",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Shampoo Anticaspa",
      description: "Grooming Premium 250ml",
      category: "Cabelo",
      salePrice: 65.00,
      costPrice: 30.00,
      stock: 12,
      minStock: 10,
      status: "SAFE",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};
