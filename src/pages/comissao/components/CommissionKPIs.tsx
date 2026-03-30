import { TrendingUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  const houseMargin = totalRevenue > 0 ? (houseNet / totalRevenue) * 100 : 0;
  const houseMarginFormatted = houseMargin.toFixed(0);
  
  const commissionPercentage = totalRevenue > 0 ? (totalCommissions / totalRevenue) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
      <div className="bg-card/60 backdrop-blur-xl p-6 rounded-xl border border-border/50 overflow-hidden relative group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors"></div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Faturamento Total (Mês)</p>
        <h3 className="text-3xl font-black tracking-tight text-foreground">{formatCurrency(totalRevenue)}</h3>
        <div className="mt-4 flex items-center gap-1 text-primary text-xs font-bold">
          <TrendingUp className="size-4" />
          +12% vs mês anterior
        </div>
      </div>
      
      <div className="bg-card/60 backdrop-blur-xl p-6 rounded-xl border border-border/50">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Total Rateado (Comissões)</p>
        <h3 className="text-3xl font-black tracking-tight text-foreground">{formatCurrency(totalCommissions)}</h3>
        <div className="mt-4 w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div className="bg-primary h-full transition-all duration-1000" style={{ width: `${commissionPercentage}%` }}></div>
        </div>
      </div>
      
      <div className="bg-card/60 backdrop-blur-xl p-6 rounded-xl border border-border/50">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Líquido (Pós Comissões)</p>
        <h3 className="text-3xl font-black tracking-tight text-primary">{formatCurrency(houseNet)}</h3>
        <div className="mt-4 flex items-center gap-1 text-muted-foreground text-xs">
          Margem de <span className="text-foreground font-bold">{houseMarginFormatted}%</span>
        </div>
      </div>
      
      <div className="bg-destructive p-6 rounded-xl border border-destructive shadow-sm">
        <p className="text-xs font-black uppercase tracking-widest text-destructive-foreground/90 mb-2">Pendentes no Mês</p>
        <h3 className="text-3xl font-black tracking-tight text-destructive-foreground">{formatCurrency(pendingPayments)}</h3>
        <div className="mt-4 flex items-center gap-2 text-destructive-foreground/80 text-xs font-bold uppercase tracking-wider">
          <div className="size-2 rounded-full bg-destructive-foreground animate-pulse"></div>
          Pagamentos em aberto
        </div>
      </div>
    </div>
  )
}
