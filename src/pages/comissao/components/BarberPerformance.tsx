import { Star, TrendingUp, Package, Scissors, CheckCircle2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import type { BarberCommissionStats } from "../types"

interface BarberPerformanceCardProps {
  stats: BarberCommissionStats
  onViewDetails: (barberId: string) => void
  onLiquidate: (barberId: string) => void
}

const BarberPerformanceCard = ({ stats, onViewDetails, onLiquidate }: BarberPerformanceCardProps) => {
  const performanceRate = (stats.paidCommission / stats.totalCommission) * 100 || 0

  return (
    <div className="bg-card/40 border border-border/50 rounded-xl p-4 sm:p-6 hover:shadow-xl transition-all duration-500 group overflow-hidden relative flex flex-col h-full">
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity hidden sm:block">
        <TrendingUp className="size-24 text-primary" />
      </div>

      <div className="flex items-center gap-4 mb-4 sm:mb-6 relative z-10">
        <div className="relative">
          <Avatar className="size-12 sm:size-16 rounded-xl border-2 border-primary/20 p-1 bg-background">
            <AvatarImage src={stats.avatar} className="rounded-xl object-cover" />
            <AvatarFallback className="rounded-xl bg-primary text-primary-foreground font-black text-lg sm:text-xl">
              {stats.barberName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 size-5 sm:size-6 bg-emerald-500 rounded-lg border-2 sm:border-4 border-card flex items-center justify-center">
            <CheckCircle2 className="size-2 sm:size-3 text-white" />
          </div>
        </div>
        <div>
          <h3 className="font-black text-base sm:text-lg tracking-tight group-hover:text-primary transition-colors">{stats.barberName}</h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={cn("size-2.5 sm:size-3", i <= 4 ? "text-amber-400 fill-amber-400" : "text-muted")} />
              ))}
            </div>
            <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Master</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6 relative z-10">
        <div className="bg-muted/30 p-2.5 sm:p-3 rounded-2xl border border-border/30">
          <p className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
            <Scissors className="size-3 text-blue-500" /> Serviços
          </p>
          <p className="text-base sm:text-lg font-black tracking-tighter tabular-nums">{stats.totalServices}</p>
        </div>
        <div className="bg-muted/30 p-2.5 sm:p-3 rounded-2xl border border-border/30">
          <p className="text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1 flex items-center gap-1">
            <Package className="size-3 text-amber-500" /> Produtos
          </p>
          <p className="text-base sm:text-lg font-black tracking-tighter tabular-nums">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="space-y-4 relative z-10 flex-1">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2 sm:gap-0">
          <div>
            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Pendente</p>
            <p className="text-xl sm:text-2xl font-black tracking-tight text-rose-500 tabular-nums">
              R$ {stats.pendingCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total</p>
            <p className="text-xs sm:text-sm font-bold text-foreground tabular-nums">
              R$ {stats.totalCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
            <span>Pagamento</span>
            <span>{performanceRate.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-1000 shadow-[0_0_8px_rgba(var(--primary),0.5)]"
              style={{ width: `${performanceRate}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3 relative z-10">
          <Button 
            variant="outline" 
            className="rounded-xl h-11 sm:h-10 font-black text-[9px] uppercase tracking-widest border-border/50 hover:bg-muted"
            onClick={() => onViewDetails(stats.barberId)}
          >
              Detalhes
          </Button>
          <Button 
            className="rounded-xl h-11 sm:h-10 font-black text-[9px] uppercase tracking-widest bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 border-0"
            disabled={stats.pendingCommission <= 0}
            onClick={() => onLiquidate(stats.barberId)}
          >
              Pagar
          </Button>
      </div>
    </div>
  )
}

interface BarberPerformanceProps {
  stats: BarberCommissionStats[]
  onViewDetails: (barberId: string) => void
  onLiquidate: (barberId: string) => void
}

export function BarberPerformance({ stats, onViewDetails, onLiquidate }: BarberPerformanceProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="size-4 text-primary" />
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">Desempenho por Barbeiro</h2>
        </div>
        <p className="text-[10px] font-black text-muted-foreground bg-muted px-3 py-1.5 rounded-full w-fit uppercase tracking-widest">
            {stats.length} Barbeiros
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((barber) => (
          <BarberPerformanceCard 
            key={barber.barberId} 
            stats={barber} 
            onViewDetails={onViewDetails}
            onLiquidate={onLiquidate}
          />
        ))}
      </div>
    </div>
  )
}
