import { useState, useEffect } from "react"
import { Plus, Loader2, PackageOpen, LayoutGrid, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-provider"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"

import { combosService } from "./services/combos.service"
import { servicesService } from "../servicos/services/services.service"
import type { Service } from "../servicos/types"
import type { ComboFormData } from "./types"

import { ComboCard } from "./components/ComboCard"
import { ComboSheet } from "./components/ComboSheet"
import { getActiveUnidadeId } from "@/lib/auth"

export default function CombosPage() {
  const { setIsLoading: setGlobalLoading } = useLoading()
  
  const [combos, setCombos] = useState<Service[]>([])
  const [servicesList, setServicesList] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingCombo, setEditingCombo] = useState<Service | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      const unidadeId = getActiveUnidadeId()
      const [combosData, allServicesData] = await Promise.all([
        combosService.getCombos(unidadeId || ""),
        servicesService.getServices(unidadeId || "")
      ])
      setCombos(combosData)
      setServicesList(allServicesData)
    } catch {
      toast.error("Erro ao carregar combos")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreate = () => {
    setEditingCombo(null)
    setIsSheetOpen(true)
  }

  const handleEdit = (combo: Service) => {
    setEditingCombo(combo)
    setIsSheetOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este combo/pacote?")) {
      try {
        await combosService.deleteCombo(id)
        toast.success("Combo excluído com sucesso!")
        fetchData()
      } catch {
        toast.error("Erro ao excluir combo")
      }
    }
  }

  const handleSave = async (data: ComboFormData) => {
    try {
      const comboData = {
        ...data,
        price: data.price,
        duration: parseInt(data.duration),
        unidadeId: getActiveUnidadeId() || "",
      }

      if (editingCombo) {
        await combosService.updateCombo(editingCombo.id, comboData)
        toast.success("Combo atualizado!")
      } else {
        await combosService.createCombo(comboData)
        toast.success("Combo criado!")
      }
      setIsSheetOpen(false)
      fetchData()
    } catch {
      toast.error("Erro ao salvar combo")
    }
  }

  // KPIs
  const activeCombos = combos.filter(c => c.isActive)
  const kpis = [
    { 
      label: "Total Pacotes", 
      value: activeCombos.length, 
      icon: PackageOpen, 
      color: "text-primary",
    },
    { 
      label: "Média de Desconto", 
      value: "N/A", // Could be calculated if needed 
      icon: AlertCircle, 
      color: "text-emerald-500",
    },
    { 
      label: "Categorias", 
      value: "Combos", 
      icon: LayoutGrid, 
      color: "text-blue-500",
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Pacotes e Combos
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Agrupe serviços em pacotes para aumentar seu ticket médio e facilitar agendamentos.
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleCreate}
            className="w-full sm:w-auto h-11 sm:h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 font-bold gap-2 shadow-lg shadow-primary/20 transition-all border-0 order-first sm:order-last"
          >
            <Plus className="size-5 stroke-[3px]" />
            Novo Combo
          </Button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
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

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-card/40 rounded-3xl border border-border/50">
            <Loader2 className="size-8 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground font-medium animate-pulse text-sm">Carregando...</p>
          </div>
        ) : combos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-card/20 rounded-3xl border border-dashed border-border/50 px-4 text-center">
             <div className="p-4 bg-primary/10 rounded-full mb-4">
               <PackageOpen className="size-8 text-primary/40" />
             </div>
             <h3 className="text-lg font-black tracking-tight mb-2">Nenhum combo criado</h3>
             <p className="text-muted-foreground max-w-xs mb-6 font-medium text-xs">
               Você ainda não possui nenhum pacote cadastrado. Agrupe seus serviços para vender mais!
             </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {combos.map((combo) => (
              <ComboCard
                key={combo.id}
                combo={combo}
                servicesList={servicesList}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <ComboSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        combo={editingCombo}
        servicesList={servicesList}
        onSave={handleSave}
      />
    </AdminLayout>
  )
}
