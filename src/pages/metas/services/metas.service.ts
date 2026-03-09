import type { Meta, MetaFormData } from "../types"

const mockMetas: Meta[] = [
  {
    id: "1",
    title: "Meta de Faturamento - Março",
    targetValue: 15000,
    currentValue: 12450,
    type: "revenue",
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    unitName: "Seu Corte - Centro",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "2",
    title: "Meta de Novos Clientes",
    targetValue: 50,
    currentValue: 42,
    type: "new_clients",
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    unitName: "Seu Corte - Centro",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "3",
    title: "Meta de Serviços - Barbeiro Lucas",
    targetValue: 200,
    currentValue: 185,
    type: "services",
    status: "active",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    professionalName: "Lucas Silva",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export const metasService = {
  getMetas: async (): Promise<Meta[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockMetas), 800)
    })
  },

  createMeta: async (data: MetaFormData): Promise<Meta> => {
    return new Promise((resolve) => {
      const newMeta: Meta = {
        id: Math.random().toString(36).substr(2, 9),
        ...data,
        currentValue: 0,
        status: data.status || "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setTimeout(() => resolve(newMeta), 800)
    })
  },

  updateMeta: async (id: string, data: Partial<MetaFormData>): Promise<Meta> => {
    return new Promise((resolve, reject) => {
      const meta = mockMetas.find(m => m.id === id)
      if (!meta) return reject(new Error("Meta not found"))
      
      const updatedMeta = { ...meta, ...data, updatedAt: new Date().toISOString() }
      setTimeout(() => resolve(updatedMeta), 800)
    })
  },

  deleteMeta: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 800)
    })
  }
}
