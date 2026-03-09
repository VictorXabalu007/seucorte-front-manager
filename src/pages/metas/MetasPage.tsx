import { useState, useEffect, useMemo } from "react"
import { Target, TrendingUp, Calendar, Plus, Loader2, Target as GoalIcon, Star } from "lucide-react"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-provider"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"

import { metasService } from "./services/metas.service"
import type { Meta, MetaFormData } from "./types"

import { GoalCard } from "./components/GoalCard"
import { GoalFilters } from "./components/GoalFilters"
import { GoalSheet } from "./components/GoalSheet"

export default function MetasPage() {
  const { setIsLoading: setGlobalLoading } = useLoading()
  
  const [metas, setMetas] = useState<Meta[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingMeta, setEditingMeta] = useState<Meta | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      const data = await metasService.getMetas()
      setMetas(data)
    } catch {
      toast.error("Erro ao carregar metas")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredMetas = useMemo(() => {
    return metas.filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = typeFilter === "all" || m.type === typeFilter
      const matchesStatus = statusFilter === "all" || m.status === statusFilter

      return matchesSearch && matchesType && matchesStatus
    })
  }, [metas, searchTerm, typeFilter, statusFilter])

  const handleCreate = () => {
    setEditingMeta(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (meta: Meta) => {
    setEditingMeta(meta)
    setIsSheetOpen(true)
  }

  const handleSave = async (data: MetaFormData) => {
    try {
      if (editingMeta) {
        await metasService.updateMeta(editingMeta.id, data)
        toast.success("Meta atualizada com sucesso!")
      } else {
        await metasService.createMeta(data)
        toast.success("Nova meta cadastrada!")
      }
      setIsSheetOpen(false)
      fetchData()
    } catch {
      toast.error("Erro ao salvar meta")
    }
  }

  const clearFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setStatusFilter("all")
  }

  // KPIs
  const activeMetas = metas.filter(m => m.status === "active")
  const completedMetas = metas.filter(m => m.status === "completed")
  const averageProgress = metas.length > 0 
    ? Math.round(metas.reduce((acc, m) => acc + (m.currentValue / m.targetValue), 0) / metas.length * 100) 
    : 0

  const kpis = [
    { 
      label: "Metas Ativas", 
      value: activeMetas.length, 
      icon: GoalIcon, 
      color: "text-primary",
      subValue: "Em andamento"
    },
    { 
      label: "Progresso Médio", 
      value: `${averageProgress}%`, 
      icon: TrendingUp, 
      color: "text-purple-500",
      subValue: "Global"
    },
    { 
      label: "Concluídas", 
      value: completedMetas.length, 
      icon: Star, 
      color: "text-emerald-500",
      subValue: "Este mês"
    },
    { 
      label: "Próx. Vencimento", 
      value: "15/03", 
      icon: Calendar, 
      color: "text-orange-500",
      subValue: "Faturamento"
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Metas & Desempenho
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Acompanhe o crescimento do seu negócio e de sua equipe.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            className="w-full sm:w-auto h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 font-black gap-2 shadow-xl shadow-primary/20 transition-all border-0 order-first sm:order-last uppercase text-[10px] tracking-widest"
          >
            <Plus className="size-5 stroke-[3px]" />
            Nova Meta
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
              <div className="flex items-baseline gap-2 relative z-10">
                <p className={`text-2xl font-black mt-1 ${kpi.color} tabular-nums`}>{kpi.value}</p>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">{kpi.subValue}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <GoalFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
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
            <p className="text-muted-foreground font-bold animate-pulse tracking-tight">Carregando metas...</p>
          </div>
        ) : filteredMetas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-[2.5rem] border border-dashed border-border/50 px-4 text-center">
             <div className="p-5 bg-primary/10 rounded-full mb-6">
               <GoalIcon className="size-10 text-primary/40" />
             </div>
             <h3 className="text-xl font-black tracking-tight mb-2">Nenhuma meta encontrada</h3>
             <p className="text-muted-foreground max-w-xs mb-8 font-medium text-sm">
               Não encontramos nenhuma meta com os critérios selecionados.
             </p>
             <Button 
               variant="outline" 
               onClick={clearFilters}
               className="rounded-2xl border-border font-bold hover:bg-primary/5 h-11 px-8 uppercase text-[10px] tracking-widest"
             >
               Limpar Filtros
             </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetas.map((meta) => (
              <GoalCard
                key={meta.id}
                meta={meta}
                onEdit={handleEdit}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      <GoalSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        meta={editingMeta}
        onSave={handleSave}
      />
    </AdminLayout>
  )
}
