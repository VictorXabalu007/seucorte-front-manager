import { useState, useEffect, useMemo } from "react"
import { Plus, Loader2, Building2, TrendingUp, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-provider"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"

import { unidadesService } from "./services/unidades.service"
import type { Unidade, UnidadeFormData } from "./types"

import { UnidadeCard } from "./components/UnidadeCard"
import { UnidadeFilters } from "./components/UnidadeFilters"
import { UnidadeSheet } from "./components/UnidadeSheet"

export default function UnidadesPage() {
  const { setIsLoading: setGlobalLoading } = useLoading()
  
  const [unidades, setUnidades] = useState<Unidade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingUnidade, setEditingUnidade] = useState<Unidade | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      const data = await unidadesService.getUnidades()
      setUnidades(data)
    } catch {
      toast.error("Erro ao carregar unidades")
      // Mock data for demonstration if API fails
      setUnidades([
        { 
          id: "1", 
          name: "Seu Corte - Centro", 
          address: "Rua Principal, 123", 
          phone: "(11) 98888-7777", 
          email: "centro@seucorte.com",
          isActive: true, 
          ownerId: "own1", 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        },
        { 
          id: "2", 
          name: "Seu Corte - Shopping", 
          address: "Av. das Américas, 500", 
          phone: "(11) 97777-6666", 
          email: "shopping@seucorte.com",
          isActive: false, 
          ownerId: "own1", 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        },
      ])
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredUnidades = useMemo(() => {
    return unidades.filter((u) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.address?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      
      const matchesStatus = 
        statusFilter === "all" || 
        (statusFilter === "active" ? u.isActive : !u.isActive)

      return matchesSearch && matchesStatus
    })
  }, [unidades, searchTerm, statusFilter])

  const handleCreate = () => {
    setEditingUnidade(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (unidade: Unidade) => {
    setEditingUnidade(unidade)
    setIsSheetOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta unidade?")) {
      try {
        await unidadesService.deleteUnidade(id)
        toast.success("Unidade excluída com sucesso!")
        fetchData()
      } catch {
        toast.error("Erro ao excluir unidade")
      }
    }
  }

  const handleSave = async (data: UnidadeFormData) => {
    try {
      if (editingUnidade) {
        await unidadesService.updateUnidade(editingUnidade.id, data)
        toast.success("Unidade atualizada!")
      } else {
        await unidadesService.createUnidade(data)
        toast.success("Unidade criada!")
      }
      setIsSheetOpen(false)
      fetchData()
    } catch {
      toast.error("Erro ao salvar unidade")
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  // KPIs
  const kpis = [
    { 
      label: "Total Unidades", 
      value: unidades.length, 
      icon: Building2, 
      color: "text-primary",
      gradient: "from-primary/20 to-primary/5"
    },
    { 
      label: "Unidades Ativas", 
      value: unidades.filter(u => u.isActive).length, 
      icon: CheckCircle2, 
      color: "text-emerald-500",
      gradient: "from-emerald-500/20 to-emerald-500/5"
    },
    { 
      label: "Unidades Inativas", 
      value: unidades.filter(u => !u.isActive).length, 
      icon: XCircle, 
      color: "text-orange-500",
      gradient: "from-orange-500/20 to-orange-500/5"
    },
    { 
      label: "Crescimento", 
      value: "+12%", 
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
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Unidades
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Gerencie suas barbearias, localizações e informações de contato.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            className="w-full sm:w-auto h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 font-bold gap-2 shadow-xl shadow-primary/20 transition-all border-0 order-first sm:order-last"
          >
            <Plus className="size-5 stroke-[3px]" />
            Nova Unidade
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpis.map((kpi) => (
            <div 
              key={kpi.label} 
              className="relative overflow-hidden bg-card/40 border border-border/50 rounded-3xl p-4 backdrop-blur-sm group hover:border-primary/20 transition-colors"
            >
              <div className={`absolute -right-2 -bottom-2 opacity-10 group-hover:scale-110 transition-transform duration-500 ${kpi.color}`}>
                <kpi.icon size={64} />
              </div>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest relative z-10">{kpi.label}</p>
              <p className={`text-2xl font-black mt-1 ${kpi.color} relative z-10 tabular-nums`}>{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <UnidadeFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onClear={clearFilters}
        />

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 bg-card/40 rounded-[2.5rem] border border-border/50 backdrop-blur-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Loader2 className="size-10 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-bold animate-pulse tracking-tight">Carregando unidades...</p>
          </div>
        ) : filteredUnidades.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-[2.5rem] border border-dashed border-border/50 px-4 text-center">
             <div className="p-5 bg-primary/10 rounded-full mb-6">
               <Building2 className="size-10 text-primary/40" />
             </div>
             <h3 className="text-xl font-black tracking-tight mb-2">Nenhuma unidade encontrada</h3>
             <p className="text-muted-foreground max-w-xs mb-8 font-medium text-sm">
               Não encontramos nenhuma unidade {statusFilter !== "all" ? (statusFilter === "active" ? "ativa" : "inativa") : ""} com os termos pesquisados.
             </p>
             <Button 
               variant="outline" 
               onClick={clearFilters}
               className="rounded-2xl border-border font-bold hover:bg-primary/5 h-11 px-8"
             >
               Limpar Filtros
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredUnidades.map((unidade) => (
              <UnidadeCard
                key={unidade.id}
                unidade={unidade}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <UnidadeSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        unidade={editingUnidade}
        onSave={handleSave}
      />
    </AdminLayout>
  )
}
