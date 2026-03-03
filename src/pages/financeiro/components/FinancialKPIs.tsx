import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FinancialKpiCardProps {
  title: string
  value: number
  subtext: string
  icon: any
  variant: "success" | "danger" | "info" | "warning"
  prefix?: string
  suffix?: string
  trend?: {
    value: number
    positive: boolean
  }
}

const FinancialKpiCard = ({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  variant, 
  prefix = "R$", 
  suffix = "",
  trend 
}: FinancialKpiCardProps) => (
  <div className="bg-card/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group relative overflow-hidden">
    <div className={cn(
      "absolute -right-4 -top-4 size-24 blur-3xl opacity-10 group-hover:opacity-20 transition-opacity duration-500",
      variant === "success" && "bg-emerald-500",
      variant === "danger" && "bg-rose-500",
      variant === "info" && "bg-blue-500",
      variant === "warning" && "bg-amber-500"
    )} />
    
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 relative z-10">
      <div className={cn(
        "p-2.5 sm:p-3 rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 w-fit",
        variant === "success" && "bg-emerald-500/10 text-emerald-500",
        variant === "danger" && "bg-rose-500/10 text-rose-500",
        variant === "info" && "bg-blue-500/10 text-blue-500",
        variant === "warning" && "bg-amber-500/10 text-amber-500"
      )}>
        <Icon className="size-5 sm:size-6" />
      </div>
      <div className="flex flex-col items-start sm:items-end">
        <span className="text-[9px] sm:text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-1">{title}</span>
        <div className="flex items-baseline gap-1">
          {prefix && <span className="text-[10px] sm:text-sm font-black text-muted-foreground/40">{prefix}</span>}
          <div className="text-xl sm:text-3xl font-black tracking-tighter text-foreground tabular-nums">
            {value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {suffix && <span className="text-[10px] sm:text-sm font-black text-muted-foreground/40">{suffix}</span>}
        </div>
      </div>
    </div>
    
    <div className="mt-4 flex items-center justify-between relative z-10">
      <div className="flex items-center gap-1.5">
        {trend ? (
            <div className={cn(
                "flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-black tracking-widest",
                trend.positive ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
            )}>
                {trend.positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {trend.value}%
            </div>
        ) : (
            <div className={cn(
                "size-1.5 rounded-full",
                variant === "success" ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground/30"
            )} />
        )}
        <span className="text-xs font-bold text-muted-foreground">{subtext}</span>
      </div>
    </div>
  </div>
)

interface FinancialKPIsProps {
  summary: {
    totalIn: number
    totalOut: number
    netBalance: number
    profitMargin: number
  }
}

export function FinancialKPIs({ summary }: FinancialKPIsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      <FinancialKpiCard
        title="Receitas"
        value={summary.totalIn}
        subtext="Total este mês"
        icon={TrendingUp}
        variant="success"
        trend={{ value: 12.5, positive: true }}
      />
      <FinancialKpiCard
        title="Despesas"
        value={summary.totalOut}
        subtext="Fixas e Variáveis"
        icon={TrendingDown}
        variant="danger"
        trend={{ value: 8.2, positive: false }}
      />
      <FinancialKpiCard
        title="Saldo Líquido"
        value={summary.netBalance}
        subtext="Disponível em caixa"
        icon={Wallet}
        variant="info"
      />
      <FinancialKpiCard
        title="Margem de Lucro"
        value={summary.profitMargin}
        subtext="Eficiência operacional"
        icon={PieChart}
        variant="warning"
        prefix=""
        suffix="%"
      />
    </div>
  )
}
