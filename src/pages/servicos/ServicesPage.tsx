import { useState, useEffect, useMemo } from "react"
import { Plus, Loader2, Scissors, TrendingUp, Clock, DollarSign } from "lucide-react"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-provider"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"

import { servicesService } from "./services/services.service"
import { barbersService } from "../barbeiros/services/barbers.service"
import type { Service, ServiceCategory, ServiceFormData } from "./types"
import type { Barber } from "../barbeiros/types"

import { ServiceCard } from "./components/ServiceCard"
import { ServiceFilters } from "./components/ServiceFilters"
import { ServiceSheet } from "./components/ServiceSheet"

const CATEGORIES: ServiceCategory[] = ["Cabelo", "Barba", "Combo", "Tratamento", "Outros"]

export default function ServicesPage() {
  const { setIsLoading: setGlobalLoading } = useLoading()
  
  const [services, setServices] = useState<Service[]>([])
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      const [servicesData, barbersData] = await Promise.all([
        servicesService.getServices(),
        barbersService.getBarbers()
      ])
      setServices(servicesData)
      setBarbers(barbersData)
    } catch {
      toast.error("Erro ao carregar serviços")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesSearch = 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      const matchesCategory = categoryFilter === "all" || s.category === categoryFilter
      return matchesSearch && matchesCategory && s.isActive
    })
  }, [services, searchTerm, categoryFilter])

  const handleCreate = () => {
    setEditingService(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setIsSheetOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este serviço?")) {
      try {
        await servicesService.deleteService(id)
        toast.success("Serviço excluído com sucesso!")
        fetchData()
      } catch {
        toast.error("Erro ao excluir serviço")
      }
    }
  }

  const handleSave = async (data: ServiceFormData) => {
    try {
      const serviceData = {
        ...data,
        price: parseFloat(data.price),
        duration: parseInt(data.duration),
      }

      if (editingService) {
        await servicesService.updateService(editingService.id, serviceData)
        toast.success("Serviço atualizado!")
      } else {
        await servicesService.createService(serviceData)
        toast.success("Serviço criado!")
      }
      setIsSheetOpen(false)
      fetchData()
    } catch {
      toast.error("Erro ao salvar serviço")
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCategoryFilter("all")
  }

  // KPIs
  const kpis = [
    { 
      label: "Total Serviços", 
      value: services.filter(s => s.isActive).length, 
      icon: Scissors, 
      color: "text-primary",
      gradient: "from-primary/20 to-primary/5"
    },
    { 
      label: "Média de Preço", 
      value: (services.filter(s => s.isActive).reduce((acc, s) => acc + s.price, 0) / (services.filter(s => s.isActive).length || 1)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), 
      icon: DollarSign, 
      color: "text-emerald-500",
      gradient: "from-emerald-500/20 to-emerald-500/5"
    },
    { 
      label: "Tempo Médio", 
      value: `${Math.round(services.filter(s => s.isActive).reduce((acc, s) => acc + s.duration, 0) / (services.filter(s => s.isActive).length || 1))} min`, 
      icon: Clock, 
      color: "text-blue-500",
      gradient: "from-blue-500/20 to-blue-500/5"
    },
    { 
      label: "Ativos", 
      value: "100%", 
      icon: TrendingUp, 
      color: "text-purple-500",
      gradient: "from-purple-500/20 to-purple-500/5"
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Serviços
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Gerencie o catálogo de serviços oferecidos pela sua barbearia.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            className="w-full sm:w-auto h-11 sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 font-bold gap-2 shadow-lg shadow-primary/20 transition-all border-0 order-first sm:order-last"
          >
            <Plus className="size-5 stroke-[3px]" />
            Novo Serviço
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
              <p className={`text-lg sm:text-2xl font-black mt-1 ${kpi.color} relative z-10 tabular-nums`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <ServiceFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={CATEGORIES}
          onClear={clearFilters}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-card/40 rounded-3xl border border-border/50">
            <Loader2 className="size-8 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground font-medium animate-pulse text-sm">Carregando...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card/20 rounded-3xl border border-dashed border-border/50 px-4 text-center">
             <div className="p-4 bg-primary/10 rounded-full mb-4">
               <Scissors className="size-8 text-primary/40" />
             </div>
             <h3 className="text-lg font-black tracking-tight mb-2">Nenhum serviço</h3>
             <p className="text-muted-foreground max-w-xs mb-6 font-medium text-xs">
               Não encontramos nenhum serviço com os filtros atuais.
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ServiceSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        service={editingService}
        categories={CATEGORIES}
        barbers={barbers}
        onSave={handleSave}
      />
    </AdminLayout>
  )
}
