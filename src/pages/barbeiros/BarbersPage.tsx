import { useState, useEffect, useMemo } from "react"
import { Plus, Loader2, User, Star, TrendingUp, DollarSign, Wallet } from "lucide-react"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-provider"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"

import { barbersService } from "./services/barbers.service"
import { servicesService } from "../servicos/services/services.service"
import type { Barber, BarberFormData } from "./types"
import type { Service } from "../servicos/types"

import { BarberCard } from "./components/BarberCard"
import { BarberFilters } from "./components/BarberFilters"
import { useNavigate } from "react-router-dom"

export default function BarbersPage() {
  const { setIsLoading: setGlobalLoading } = useLoading()
  const navigate = useNavigate()
  
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Removed sheet state
  // const [isSheetOpen, setIsSheetOpen] = useState(false)
  // const [editingBarber, setEditingBarber] = useState<Barber | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      const [barbersData, servicesData] = await Promise.all([
        barbersService.getBarbers(),
        servicesService.getServices()
      ])
      setBarbers(barbersData)
      setServices(servicesData)
    } catch {
      toast.error("Erro ao carregar barbeiros")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredBarbers = useMemo(() => {
    return barbers.filter((b) => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.specialty?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
        b.email.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" && b.isActive) || 
        (statusFilter === "inactive" && !b.isActive)
        
      return matchesSearch && matchesStatus
    })
  }, [barbers, searchTerm, statusFilter])

  const handleCreate = () => {
    navigate("/barbeiros/novo")
  }

  const handleEdit = (barber: Barber) => {
    navigate(`/barbeiros/${barber.id}/editar`)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja remover este barbeiro?")) {
      try {
        await barbersService.deleteBarber(id)
        toast.success("Barbeiro removido com sucesso!")
        fetchData()
      } catch {
        toast.error("Erro ao remover barbeiro")
      }
    }
  }

  // Sheet handleSave removed
  
  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  // KPIs
  const kpis = [
    { 
      label: "Total Barbeiros", 
      value: barbers.length, 
      icon: User, 
      color: "text-primary",
    },
    { 
      label: "Ativos", 
      value: barbers.filter(b => b.isActive).length, 
      icon: Star, 
      color: "text-emerald-500",
    },
    { 
      label: "Comissão Média", 
      value: `${Math.round(barbers.reduce((acc, b) => acc + (b.commissionType === "PERCENTAGE" ? b.commissionValue : 0), 0) / (barbers.filter(b => b.commissionType === "PERCENTAGE").length || 1))}%`, 
      icon: TrendingUp, 
      color: "text-blue-500",
    },
    { 
      label: "Ganhos Totais", 
      value: "R$ 0,00", 
      icon: Wallet, 
      color: "text-purple-500",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Barbeiros
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Gerencie sua equipe, especialidades e regras de comissão.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            className="w-full sm:w-auto h-11 sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 font-bold gap-2 shadow-lg shadow-primary/20 transition-all border-0 order-first sm:order-last"
          >
            <Plus className="size-5 stroke-[3px]" />
            Novo Barbeiro
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          {kpis.map((kpi) => (
            <div 
              key={kpi.label} 
              className={`relative overflow-hidden bg-card/40 border border-border/50 rounded-2xl p-3 sm:p-4 backdrop-blur-sm group`}
            >
              <div className={`absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-500 ${kpi.color}`}>
                <kpi.icon size={48} className="sm:size-16" />
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest relative z-10">{kpi.label}</p>
              <p className={`text-xl sm:text-2xl font-black mt-1 ${kpi.color} relative z-10 tabular-nums`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <BarberFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClear={clearFilters}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-card/40 rounded-3xl border border-border/50">
            <Loader2 className="size-8 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground font-medium animate-pulse text-sm">Carregando...</p>
          </div>
        ) : filteredBarbers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card/20 rounded-3xl border border-dashed border-border/50 px-4 text-center">
             <div className="p-4 bg-primary/10 rounded-full mb-4">
               <User className="size-8 text-primary/40" />
             </div>
             <h3 className="text-lg font-black tracking-tight mb-2">Nenhum barbeiro</h3>
             <p className="text-muted-foreground max-w-xs mb-6 font-medium text-xs">
               Não encontramos nenhum barbeiro com os filtros atuais.
             </p>
             <Button 
               variant="outline" 
               onClick={clearFilters}
               className="rounded-xl border-border font-bold hover:bg-primary/5 h-10 px-6"
             >
               Limpar Filtros
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredBarbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
