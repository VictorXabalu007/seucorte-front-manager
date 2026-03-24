import { Package, AlertTriangle, TrendingUp, DollarSign, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatBRL } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: string
  subtextText: string
  subtextIcon?: any
  icon: any
  variant?: "default" | "warning" | "success" | "info"
}

const KpiCard = ({ title, value, subtextText, subtextIcon: SubIcon, icon: Icon, variant = "default" }: KpiCardProps) => (
  <div className="bg-card p-4 sm:p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-300 group">
    <div className="flex items-start justify-between mb-4">
      <div className={cn(
        "p-2.5 rounded-xl transition-colors duration-300",
        variant === "default" && "bg-muted text-muted-foreground",
        variant === "warning" && "bg-amber-500/10 text-amber-500",
        variant === "success" && "bg-emerald-500/10 text-emerald-500",
        variant === "info" && "bg-sky-500/10 text-sky-500"
      )}>
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col items-end text-right">
        <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{title}</span>
        <div className="text-2xl sm:text-3xl font-black tracking-tighter text-foreground tabular-nums line-clamp-1">{value}</div>
      </div>
    </div>
    <div className="flex items-center gap-1.5 overflow-hidden">
      {SubIcon && <SubIcon className={cn("size-3.5 shrink-0", variant === "success" ? "text-emerald-500" : "text-muted-foreground")} />}
      <span className={cn("text-xs font-bold truncate", variant === "warning" ? "text-amber-500" : variant === "success" ? "text-emerald-500" : "text-muted-foreground tracking-tight")}>{subtextText}</span>
    </div>
  </div>
)

import type { InventoryItem, InventoryStats } from "./types/inventory"

interface InventoryKPIsProps {
  stats: InventoryStats | null
  isLoading: boolean
}

export function InventoryKPIs({ stats, isLoading }: InventoryKPIsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-card/50 rounded-2xl animate-pulse border border-border/50" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <KpiCard 
        title="Custo do Estoque" 
        value={formatBRL(stats.totalCost)} 
        subtextText="Investimento atual" 
        subtextIcon={Wallet} 
        icon={Package} 
        variant="default" 
      />
      <KpiCard 
        title="Lucro Previsto" 
        value={formatBRL(stats.totalPotentialProfit)} 
        subtextText="Retorno projetado" 
        subtextIcon={TrendingUp} 
        icon={TrendingUp} 
        variant="success" 
      />
      <KpiCard 
        title="Faturamento Total" 
        value={formatBRL(stats.totalPotentialRevenue)} 
        subtextText="Venda de todo estoque" 
        subtextIcon={DollarSign} 
        icon={DollarSign} 
        variant="info"
      />
      <KpiCard 
        title="Baixo Estoque" 
        value={stats.lowStockItems.toString()} 
        subtextText={stats.lowStockItems > 0 ? "Itens críticos" : "Nivel saudável"} 
        icon={AlertTriangle} 
        variant={stats.lowStockItems > 0 ? "warning" : "success"} 
      />
    </div>
  )
}
