import api from "@/lib/api"
import type { Cliente } from "../types/cliente"

class ClienteService {
  async getClientes(params?: { search?: string; page?: number; limit?: number; unidadeId?: string }): Promise<{ data: Cliente[], total: number, pages: number }> {
    const res = await api.get("/clientes", { params })
    return res.data
  }

  async getCliente(id: string): Promise<Cliente> {
    const res = await api.get(`/clientes/${id}`)
    return res.data
  }

  async getClienteProfile(id: string): Promise<Cliente & { stats: any }> {
    const res = await api.get(`/clientes/${id}/profile`)
    return res.data
  }

  async createCliente(data: Partial<Cliente>): Promise<Cliente> {
    const res = await api.post("/clientes", data)
    return res.data
  }

  async updateCliente(id: string, data: Partial<Cliente>): Promise<Cliente> {
    const res = await api.patch(`/clientes/${id}`, data)
    return res.data
  }

  async deleteCliente(id: string): Promise<void> {
    await api.delete(`/clientes/${id}`)
  }

  async getStats(unidadeId?: string): Promise<{
    total: number;
    vipTotal: number;
    blockedTotal: number;
    totalRevenue: number;
    avgSpent: number;
  }> {
    const res = await api.get("/clientes/stats", { params: { unidadeId } })
    return res.data
  }
}

export const clienteService = new ClienteService()
