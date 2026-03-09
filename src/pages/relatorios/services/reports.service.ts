import type { FinancialReport, ClientReport, ServiceReport, ReportPeriod } from "../types"

const mockFinancialReport: FinancialReport = {
  revenueOverTime: [
    { date: "Seg", value: 1200 },
    { date: "Ter", value: 1500 },
    { date: "Qua", value: 1100 },
    { date: "Qui", value: 1800 },
    { date: "Sex", value: 2500 },
    { date: "Sáb", value: 3200 },
    { date: "Dom", value: 800 },
  ],
  expensesOverTime: [
    { date: "Seg", value: 400 },
    { date: "Ter", value: 300 },
    { date: "Qua", value: 600 },
    { date: "Qui", value: 200 },
    { date: "Sex", value: 800 },
    { date: "Sáb", value: 1100 },
    { date: "Dom", value: 300 },
  ],
  revenueByService: [
    { name: "Corte Cabelo", value: 4500, color: "hsl(var(--primary))" },
    { name: "Barba", value: 2800, color: "hsl(var(--chart-2))" },
    { name: "Combo", value: 3500, color: "hsl(var(--chart-3))" },
    { name: "Produtos", value: 1200, color: "hsl(var(--chart-4))" },
  ],
  summary: [
    { title: "Faturamento Total", value: "R$ 12.800", change: 12.5, isPositive: true },
    { title: "Ticket Médio", value: "R$ 85,00", change: 5.2, isPositive: true },
    { title: "Despesas", value: "R$ 3.700", change: 2.1, isPositive: false },
    { title: "Lucro Líquido", value: "R$ 9.100", change: 18.3, isPositive: true },
  ]
}

const mockClientReport: ClientReport = {
  newClientsOverTime: [
    { date: "Seg", value: 4 },
    { date: "Ter", value: 6 },
    { date: "Qua", value: 3 },
    { date: "Qui", value: 8 },
    { date: "Sex", value: 12 },
    { date: "Sáb", value: 15 },
    { date: "Dom", value: 2 },
  ],
  retentionRate: 75,
  demographics: [
    { label: "18-25", value: 30 },
    { label: "26-35", value: 45 },
    { label: "36-45", value: 15 },
    { label: "46+", value: 10 },
  ],
  topClients: [
    { name: "João Silva", appointments: 12, totalSpent: 1200 },
    { name: "Pedro Santos", appointments: 10, totalSpent: 950 },
    { name: "Lucas Costa", appointments: 8, totalSpent: 840 },
  ],
  summary: [
    { title: "Novos Clientes", value: 50, change: 8.5, isPositive: true },
    { title: "Taxa Retenção", value: "75%", change: 2.1, isPositive: true },
    { title: "Agendamentos", value: 185, change: 15.2, isPositive: true },
    { title: "Cancelamentos", value: 5, change: 1.2, isPositive: false },
  ]
}

const mockServiceReport: ServiceReport = {
  mostRequestedServices: [
    { name: "Corte Degradê", count: 85, revenue: 4250 },
    { name: "Barba Terapia", count: 42, revenue: 1680 },
    { name: "Corte + Barba", count: 38, revenue: 2660 },
  ],
  averageServiceTime: 45,
  servicesByCategory: [
    { name: "Cabelo", value: 120 },
    { name: "Barba", value: 65 },
    { name: "Estética", value: 20 },
  ],
  summary: [
    { title: "Total Serviços", value: 205, change: 12.1, isPositive: true },
    { title: "Tempo Médio", value: "45 min", change: 0, isPositive: true },
    { title: "Ocupação", value: "82%", change: 4.5, isPositive: true },
    { title: "Serviço Top", value: "Degradê", change: 10.2, isPositive: true },
  ]
}

export const reportsService = {
  getFinancialReport: async (period: ReportPeriod): Promise<FinancialReport> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockFinancialReport), 800)
    })
  },
  getClientReport: async (period: ReportPeriod): Promise<ClientReport> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockClientReport), 800)
    })
  },
  getServiceReport: async (period: ReportPeriod): Promise<ServiceReport> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mockServiceReport), 800)
    })
  }
}
