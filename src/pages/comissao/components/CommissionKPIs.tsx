import { DollarSign, Percent, Wallet, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: number
  subtext: string
  icon: any
  variant: "primary" | "secondary" | "accent" | "destructive"
  prefix?: string
}

const KpiCard = ({ title, value, subtext, icon: Icon, variant, prefix = "R$" }: KpiCardProps) => (
  <div className="bg-card/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden">
    <div className={cn(
      "absolute -right-4 -top-4 size-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500",
      variant === "primary" && "bg-primary",
      variant === "secondary" && "bg-blue-500",
      variant === "accent" && "bg-emerald-500",
      variant === "destructive" && "bg-rose-500"
    )} />
    
    <div className="flex flex-col sm:flex-row sm:items-start justify-between relative z-10 gap-3 sm:gap-0">
      <div className={cn(
        "p-2.5 sm:p-3 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 w-fit",
        variant === "primary" && "bg-primary/10 text-primary",
        variant === "secondary" && "bg-blue-500/10 text-blue-500",
        variant === "accent" && "bg-emerald-500/10 text-emerald-500",
        variant === "destructive" && "bg-rose-500/10 text-rose-500"
      )}>
        <Icon className="size-5 sm:size-6" />
      </div>
      <div className="flex flex-col sm:items-end">
        <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-1">{title}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-[10px] sm:text-sm font-black text-muted-foreground/40">{prefix}</span>
          <div className="text-xl sm:text-3xl font-black tracking-tighter text-foreground tabular-nums">
            {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
    
    <div className="mt-4 flex items-center justify-between relative z-10 border-t border-border/10 pt-3">
      <div className="flex items-center gap-1.5">
        <div className={cn(
          "size-1 rounded-full",
          variant === "accent" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"
        )} />
        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground truncate">{subtext}</span>
      </div>
    </div>
  </div>
)

interface CommissionKPIsProps {
  totalRevenue: number
  totalCommissions: number
  houseNet: number
  pendingPayments: number
}

export function CommissionKPIs({ 
  totalRevenue, 
  totalCommissions, 
  houseNet, 
  pendingPayments 
}: CommissionKPIsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <KpiCard
        title="Faturamento"
        value={totalRevenue}
        subtext="Geral Bruto"
        icon={DollarSign}
        variant="primary"
      />
      <KpiCard
        title="Comissões"
        value={totalCommissions}
        subtext="Total Rateado"
        icon={Percent}
        variant="secondary"
      />
      <KpiCard
        title="Líquido"
        value={houseNet}
        subtext="Pós comissões"
        icon={Wallet}
        variant="accent"
      />
      <KpiCard
        title="Pendentes"
        value={pendingPayments}
        subtext="Aguardando Pg"
        icon={ArrowUpRight}
        variant="destructive"
      />
    </div>
  )
}
