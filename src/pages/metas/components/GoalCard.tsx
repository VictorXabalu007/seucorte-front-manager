import { Target, TrendingUp, User, Building2, Calendar } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Meta } from "../types"

interface GoalCardProps {
  meta: Meta
  onEdit: (meta: Meta) => void
  onDelete: (id: string) => void
}

export function GoalCard({ meta, onEdit, onDelete }: GoalCardProps) {
  const percentage = Math.min(Math.round((meta.currentValue / meta.targetValue) * 100), 100)
  
  const statusConfig = {
    active: { color: "text-primary", bg: "bg-primary/10", label: "Ativa" },
    completed: { color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Alcançada" },
    failed: { color: "text-rose-500", bg: "bg-rose-500/10", label: "Não Alcançada" },
    pending: { color: "text-amber-500", bg: "bg-amber-500/10", label: "Pendente" },
  }

  const typeConfig = {
    revenue: { icon: TrendingUp, label: "Faturamento" },
    bookings: { icon: Calendar, label: "Agendamentos" },
    new_clients: { icon: User, label: "Novos Clientes" },
    services: { icon: Target, label: "Serviços" },
  }

  const TypeIcon = typeConfig[meta.type].icon
  const status = statusConfig[meta.status]

  return (
    <div 
      className="group relative overflow-hidden bg-card/40 border border-border/50 rounded-[2.5rem] p-6 backdrop-blur-sm hover:border-primary/20 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/5"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className={cn("p-3 rounded-2xl", status.bg)}>
            <TypeIcon className={cn("size-5", status.color)} />
          </div>
          <div>
            <h3 className="font-black tracking-tight text-lg line-clamp-1">{meta.title}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <Badge variant="outline" className="text-[10px] uppercase font-black tracking-widest bg-background/50 border-border/50">
                {typeConfig[meta.type].label}
              </Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {meta.professionalName || meta.unitName || "Geral"}
              </span>
            </div>
          </div>
        </div>
        <Badge className={cn("rounded-lg font-black uppercase tracking-tighter text-[10px]", status.bg, status.color, "border-0")}>
          {status.label}
        </Badge>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Progresso</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tabular-nums tracking-tighter">
                {meta.type === "revenue" ? `R$ ${meta.currentValue.toLocaleString()}` : meta.currentValue}
              </span>
              <span className="text-xs text-muted-foreground font-bold">
                / {meta.type === "revenue" ? `R$ ${meta.targetValue.toLocaleString()}` : meta.targetValue}
              </span>
            </div>
          </div>
          <div className="text-right">
            <span className={cn("text-2xl font-black tabular-nums tracking-tighter", status.color)}>
              {percentage}%
            </span>
          </div>
        </div>

        <Progress value={percentage} className="h-3 rounded-xl bg-muted" />

        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="size-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-widest">
              Expira em {new Date(meta.endDate).toLocaleDateString('pt-BR')}
            </span>
          </div>
          <div className="flex gap-2">
             <button 
                onClick={() => onEdit(meta)}
                className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-muted-foreground hover:text-primary"
             >
               <Target className="size-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className={cn("absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none", status.color)}>
        <TypeIcon size={120} />
      </div>
    </div>
  )
}
