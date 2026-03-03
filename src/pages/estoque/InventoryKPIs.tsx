import { Package, AlertTriangle, TrendingUp, Link2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  subtextText: string
  subtextIcon?: any
  icon: any
  variant?: "default" | "warning" | "success"
}

const KpiCard = ({ title, value, subtextText, subtextIcon: SubIcon, icon: Icon, variant = "default" }: KpiCardProps) => (
  <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className={cn(
        "p-2.5 rounded-xl transition-colors duration-300",
        variant === "default" && "bg-muted text-muted-foreground",
        variant === "warning" && "bg-amber-500/10 text-amber-500",
        variant === "success" && "bg-primary/10 text-primary"
      )}>
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{title}</span>
        <div className="text-3xl font-black tracking-tighter text-foreground tabular-nums">{value}</div>
      </div>
    </div>
    <div className="flex items-center gap-1.5">
      {SubIcon && <SubIcon className={cn("size-3.5", variant === "success" ? "text-primary" : "text-muted-foreground")} />}
      <span className={cn("text-xs font-bold", variant === "warning" ? "text-amber-500" : variant === "success" ? "text-primary" : "text-muted-foreground tracking-tight")}>{subtextText}</span>
    </div>
  </div>
)

import type { InventoryItem } from "./types/inventory"

interface InventoryKPIsProps {
  items: InventoryItem[]
  isLoading: boolean
}

export function InventoryKPIs({ items, isLoading }: InventoryKPIsProps) {
  const totalItems = items.length
  const lowStockItems = items.filter(item => item.status !== 'SAFE').length
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card/50 rounded-2xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <KpiCard 
        title="Total de Itens" 
        value={totalItems.toLocaleString()} 
        subtextText="Cadastrados" 
        subtextIcon={TrendingUp} 
        icon={Package} 
        variant="success" 
      />
      <KpiCard 
        title="Baixo Estoque" 
        value={lowStockItems.toString()} 
        subtextText={lowStockItems > 0 ? "Requer atenção" : "Estoque saudável"} 
        icon={AlertTriangle} 
        variant={lowStockItems > 0 ? "warning" : "success"} 
      />
      <KpiCard 
        title="Consumo Mensal" 
        value="R$ 4.25k" 
        subtextText="Previsto: R$ 5.00k" 
        icon={TrendingUp} 
      />
      <KpiCard 
        title="Eficiência" 
        value="85%" 
        subtextText="Itens vinculados" 
        icon={Link2} 
        variant="success" 
      />
    </div>
  )
}
