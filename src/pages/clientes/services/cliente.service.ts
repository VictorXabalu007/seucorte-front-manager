import type { Cliente } from "../types/cliente"

class ClienteService {
  async getClientes(): Promise<Cliente[]> {
    // Simulating API call
    return this.getMockClientes()
  }

  getMockClientes(): Cliente[] {
    return [
      {
        id: "1",
        name: "João Silva",
        email: "joao@example.com",
        phone: "(11) 99999-9999",
        type: "pro",
        planId: "2",
        lastVisit: "2024-03-01",
        totalSpent: 450.00,
        appointmentsCount: 12,
        status: "active"
      },
      {
        id: "2",
        name: "Maria Oliveira",
        email: "maria@example.com",
        phone: "(11) 88888-8888",
        type: "customer",
        lastVisit: "2024-02-15",
        totalSpent: 85.00,
        appointmentsCount: 2,
        status: "active"
      },
      {
        id: "3",
        name: "Pedro Santos",
        email: "pedro@example.com",
        phone: "(11) 77777-7777",
        type: "pro",
        planId: "1",
        lastVisit: "2024-02-28",
        totalSpent: 280.00,
        appointmentsCount: 8,
        status: "active"
      },
      {
        id: "4",
        name: "Lucas Ferreira",
        email: "lucas@example.com",
        phone: "(11) 98888-7777",
        type: "customer",
        lastVisit: "2024-01-10",
        totalSpent: 45.00,
        appointmentsCount: 1,
        status: "inactive"
      }
    ]
  }
}

export const clienteService = new ClienteService()
