import api from "@/lib/api";
import type { InventoryItem, InventoryStats } from "../types/inventory";

export const inventoryService = {
  getItems: async (params?: { search?: string; category?: string }): Promise<InventoryItem[]> => {
    const response = await api.get<InventoryItem[]>("/inventory", { params });
    return response.data;
  },

  getStats: async (): Promise<InventoryStats> => {
    const response = await api.get<InventoryStats>("/inventory/stats");
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

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(`/inventory/${id}`);
  },

  // Mock data generator for development
  getMockItems: (): InventoryItem[] => [
    {
      id: "1",
      name: "Pomada Matte Suavecito",
      description: "Pote de 150g - Premium",
      category: "Finalização",
      price: 85.00,
      stock: 42,
      minStock: 10,
      unit: "Unidades",
      status: "SAFE",
      isActive: true,
      commissionType: "PERCENTAGE",
      commissionValue: 10,
      linkedService: "Corte Tesoura",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "2",
      name: "Lâmina Derby Extra",
      description: "Caixa com 100un",
      category: "Barbearia",
      price: 45.00,
      stock: 5,
      minStock: 15,
      unit: "Caixas",
      status: "CRITICAL",
      isActive: true,
      commissionType: "FIXED",
      commissionValue: 2,
      linkedService: "Barba Completa",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "3",
      name: "Shampoo Anticaspa",
      description: "Grooming Premium 250ml",
      category: "Lavagem",
      price: 65.00,
      stock: 12,
      minStock: 10,
      unit: "Unidades",
      status: "SAFE",
      isActive: true,
      commissionType: "PERCENTAGE",
      commissionValue: 15,
      linkedService: "Lavagem",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "4",
      name: "Óleo para Barba Woodsmoke",
      description: "30ml - Hidratação intensa",
      category: "Barba",
      price: 55.00,
      stock: 3,
      minStock: 5,
      unit: "Unidades",
      status: "LOW",
      isActive: true,
      commissionType: "FIXED",
      commissionValue: 5,
      linkedService: "Barba Terapia",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "5",
      name: "Spray Fixador Extra Forte",
      description: "400ml - Longa duração",
      category: "Finalização",
      price: 75.00,
      stock: 15,
      minStock: 5,
      unit: "Unidades",
      status: "SAFE",
      isActive: true,
      commissionType: "PERCENTAGE",
      commissionValue: 10,
      linkedService: "Penteados",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "6",
      name: "Condicionador Refrish",
      description: "Refreshing Mint 1L",
      category: "Lavagem",
      price: 120.00,
      stock: 2,
      minStock: 4,
      unit: "Galões",
      status: "LOW",
      isActive: true,
      commissionType: "PERCENTAGE",
      commissionValue: 5,
      linkedService: "SPA Capilar",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "7",
      name: "Cera de Bigode Moustache",
      description: "Lata de 15g - Extra Hold",
      category: "Barba",
      price: 35.00,
      stock: 20,
      minStock: 5,
      unit: "Unidades",
      status: "SAFE",
      isActive: true,
      commissionType: "FIXED",
      commissionValue: 1.5,
      linkedService: "Aparar Bigode",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "8",
      name: "Loção Pós-Barba Eucalipto",
      description: "100ml - Refrescante",
      category: "Barba",
      price: 40.00,
      stock: 1,
      minStock: 10,
      unit: "Unidades",
      status: "CRITICAL",
      isActive: true,
      commissionType: "PERCENTAGE",
      commissionValue: 10,
      linkedService: "Barba Completa",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "9",
      name: "Toalha Descartável Algodão",
      description: "Pacote com 50un",
      category: "Descartáveis",
      price: 25.00,
      stock: 100,
      minStock: 20,
      unit: "Pacotes",
      status: "SAFE",
      isActive: true,
      commissionType: "FIXED",
      commissionValue: 0.5,
      linkedService: "Todos",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "10",
      name: "Talo p/ Pescoço Barber",
      description: "Frasco 200g",
      category: "Finalização",
      price: 15.00,
      stock: 8,
      minStock: 5,
      unit: "Unidades",
      status: "SAFE",
      isActive: true,
      commissionType: "FIXED",
      commissionValue: 1,
      linkedService: "Acabamento",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "11",
      name: "Pente Pro Carbon",
      description: "Antiestático - Corte",
      category: "Ferramentas",
      price: 20.00,
      stock: 15,
      minStock: 5,
      unit: "Unidades",
      status: "SAFE",
      isActive: true,
      commissionType: "FIXED",
      commissionValue: 1,
      linkedService: "Corte",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "12",
      name: "Capa de Corte Premium",
      description: "Nylon Impermeável",
      category: "Acessórios",
      price: 45.00,
      stock: 30,
      minStock: 10,
      unit: "Unidades",
      status: "SAFE",
      isActive: true,
      commissionType: "FIXED",
      commissionValue: 0,
      linkedService: "Todos",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]
};
