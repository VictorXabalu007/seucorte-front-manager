import { useState, useMemo, useEffect } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useLoading } from "@/components/loading-provider"
import { CommissionKPIs } from "./components/CommissionKPIs"
import { BarberPerformance } from "./components/BarberPerformance"
import { CommissionFilters } from "./components/CommissionFilters"
import { CommissionTable } from "./components/CommissionTable"
import { BarberCommissionDetailSheet } from "./components/BarberCommissionDetailSheet"
import { toast } from "sonner"
import { Filter } from "lucide-react"
import type { CommissionTransaction, BarberCommissionStats } from "./types"

export default function ComissaoPage() {
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(false)
  }, [setIsLoading])

  // Mock Data for Transactions
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([
    {
      id: "1",
      date: new Date().toISOString(),
      type: "SERVICE",
      description: "Corte Moderno + Barba",
      barberId: "ricardo",
      barberName: "Ricardo Barber",
      totalValue: 85.00,
      commissionValue: 42.50,
      houseValue: 42.50,
      status: "PENDING"
    },
    {
      id: "2",
      date: new Date(Date.now() - 3600000).toISOString(),
      type: "PRODUCT",
      description: "Pomada Suavecito Matte",
      barberId: "ricardo",
      barberName: "Ricardo Barber",
      totalValue: 95.00,
      commissionValue: 9.50,
      houseValue: 85.50,
      status: "PAID"
    },
    {
      id: "3",
      date: new Date(Date.now() - 7200000).toISOString(),
      type: "SERVICE",
      description: "Luzes + Hidratação",
      barberId: "joao",
      barberName: "João Silva",
      totalValue: 120.00,
      commissionValue: 60.00,
      houseValue: 60.00,
      status: "PENDING"
    },
    {
      id: "4",
      date: new Date(Date.now() - 86400000).toISOString(),
      type: "SERVICE",
      description: "Corte Kids",
      barberId: "pedro",
      barberName: "Pedro Santos",
      totalValue: 45.00,
      commissionValue: 22.50,
      houseValue: 22.50,
      status: "PENDING"
    },
    {
      id: "5",
      date: new Date(Date.now() - 90000000).toISOString(),
      type: "PRODUCT",
      description: "Shampoo Anticaspa Pro",
      barberId: "joao",
      barberName: "João Silva",
      totalValue: 65.00,
      commissionValue: 6.50,
      houseValue: 58.50,
      status: "PAID"
    },
    {
      id: "6",
      date: new Date(Date.now() - 95000000).toISOString(),
      type: "SERVICE",
      description: "Barba Terapia",
      barberId: "ricardo",
      barberName: "Ricardo Barber",
      totalValue: 60.00,
      commissionValue: 30.00,
      houseValue: 30.00,
      status: "PENDING"
    }
  ])

  // Filters State
  const [searchTerm, setSearchTerm] = useState("")
  const [barberFilter, setBarberFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Detail Sheet State
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null)

  // Function to get active barber stats from current transactions
  const barberStats = useMemo(() => {
     const barbers = ["ricardo", "joao", "pedro"]
     const names: Record<string, string> = { "ricardo": "Ricardo Barber", "joao": "João Silva", "pedro": "Pedro Santos" }
     
     return barbers.map(id => {
        const bTx = transactions.filter(tx => tx.barberId === id)
        const totalServices = bTx.filter(tx => tx.type === "SERVICE").length
        const totalProducts = bTx.filter(tx => tx.type === "PRODUCT").length
        const totalRevenue = bTx.reduce((acc, tx) => acc + tx.totalValue, 0)
        const totalCommission = bTx.reduce((acc, tx) => acc + tx.commissionValue, 0)
        const paidCommission = bTx.filter(tx => tx.status === "PAID").reduce((acc, tx) => acc + tx.commissionValue, 0)
        const pendingCommission = bTx.filter(tx => tx.status === "PENDING").reduce((acc, tx) => acc + tx.commissionValue, 0)

        return {
          barberId: id,
          barberName: names[id],
          totalServices,
          totalProducts,
          totalRevenue,
          totalCommission,
          paidCommission,
          pendingCommission
        } as BarberCommissionStats
     })
  }, [transactions])

  const summary = useMemo(() => {
    return {
      totalRevenue: transactions.reduce((acc, tx) => acc + tx.totalValue, 0),
      totalCommissions: transactions.reduce((acc, tx) => acc + tx.commissionValue, 0),
      houseNet: transactions.reduce((acc, tx) => acc + tx.houseValue, 0),
      pendingPayments: transactions.filter(tx => tx.status === "PENDING").reduce((acc, tx) => acc + tx.commissionValue, 0)
    }
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           tx.barberName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesBarber = barberFilter === "all" || tx.barberId === barberFilter
      const matchesStatus = statusFilter === "all" || tx.status === statusFilter
      const matchesType = typeFilter === "all" || tx.type === typeFilter

      return matchesSearch && matchesBarber && matchesStatus && matchesType
    })
  }, [transactions, searchTerm, barberFilter, statusFilter, typeFilter])

  const handleMarkAsPaid = (id: string) => {
    setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, status: "PAID" } : tx))
    toast.success("Comissão liquidada com sucesso!")
  }

  const handleLiquidateBarber = (barberId: string) => {
    const hasPending = transactions.some(tx => tx.barberId === barberId && tx.status === "PENDING")
    if (!hasPending) {
        toast.info("Não há comissões pendentes para este barbeiro.")
        return
    }

    setTransactions(prev => prev.map(tx => tx.barberId === barberId ? { ...tx, status: "PAID" } : tx))
    const barberName = barberStats.find(b => b.barberId === barberId)?.barberName
    toast.success(`Todas as comissões de ${barberName} foram liquidadas!`)
  }

  const handleOpenDetails = (barberId: string) => {
    setSelectedBarberId(barberId)
    setIsDetailOpen(true)
  }

  const selectedBarberStats = useMemo(() => 
    barberStats.find(b => b.barberId === selectedBarberId) || null
  , [barberStats, selectedBarberId])

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-10 pb-20">
        <div className="w-full">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground bg-gradient-to-tr from-foreground to-foreground/50 bg-clip-text text-transparent">
               Gestão de Comissões
            </h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm mt-1">
               Controle financeiro, rateio de lucros e pagamentos.
            </p>
        </div>

        <CommissionKPIs 
          totalRevenue={summary.totalRevenue}
          totalCommissions={summary.totalCommissions}
          houseNet={summary.houseNet}
          pendingPayments={summary.pendingPayments}
        />

        <BarberPerformance 
          stats={barberStats} 
          onViewDetails={handleOpenDetails}
          onLiquidate={handleLiquidateBarber}
        />

        <div className="space-y-6 pt-4">
            <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Filter className="size-4 text-primary" />
                </div>
                <h2 className="text-xl font-black tracking-tight">Todas as Movimentações</h2>
            </div>
            
            <CommissionFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              barberFilter={barberFilter}
              setBarberFilter={setBarberFilter}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
            />

            <CommissionTable 
              transactions={filteredTransactions} 
              onMarkAsPaid={handleMarkAsPaid} 
            />
        </div>

        <BarberCommissionDetailSheet 
            isOpen={isDetailOpen}
            onOpenChange={setIsDetailOpen}
            barber={selectedBarberStats}
            transactions={transactions}
            onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </AdminLayout>
  )
}
