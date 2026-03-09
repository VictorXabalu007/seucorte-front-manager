import { Calendar, Filter, ChevronDown, Download, BarChart3, Users, Scissors, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { ReportCategory, ReportPeriod } from "../types"
import { cn } from "@/lib/utils"

interface ReportHeaderProps {
  category: ReportCategory
  setCategory: (category: ReportCategory) => void
  period: ReportPeriod
  setPeriod: (period: ReportPeriod) => void
  onExport: () => void
}

export function ReportHeader({
  category,
  setCategory,
  period,
  setPeriod,
  onExport
}: ReportHeaderProps) {
  const categories = [
    { id: "finance", label: "Financeiro", icon: BarChart3, color: "text-emerald-500", bg: "group-hover:bg-emerald-500/10" },
    { id: "clients", label: "Clientes", icon: Users, color: "text-blue-500", bg: "group-hover:bg-blue-500/10" },
    { id: "services", label: "Serviços", icon: Scissors, color: "text-purple-500", bg: "group-hover:bg-purple-500/10" },
    { id: "occupancy", label: "Ocupação", icon: Percent, color: "text-orange-500", bg: "group-hover:bg-orange-500/10" },
  ] as const

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
            Relatórios & Analytics
          </h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">
            Visão detalhada do desempenho da sua barbearia.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={onExport}
            className="flex-1 sm:flex-none h-11 border-border/50 rounded-2xl px-6 font-bold gap-2 text-muted-foreground hover:bg-muted/50 transition-all uppercase text-[10px] tracking-widest"
          >
            <Download className="size-4" />
            Exportar PDF
          </Button>
          <div className="hidden sm:block w-px h-11 bg-border/50 mx-2" />
          <Select value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)}>
            <SelectTrigger className="w-[180px] h-11 bg-card/40 border-border/50 rounded-2xl font-bold px-4 focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                <SelectValue placeholder="Período" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-md">
              <SelectItem value="7d" className="rounded-xl font-bold">Últimos 7 dias</SelectItem>
              <SelectItem value="30d" className="rounded-xl font-bold">Últimos 30 dias</SelectItem>
              <SelectItem value="90d" className="rounded-xl font-bold">Últimos 30 dias</SelectItem>
              <SelectItem value="12m" className="rounded-xl font-bold">Últimos 12 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((cat) => {
          const isActive = category === cat.id
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id as ReportCategory)}
              className={cn(
                "group relative overflow-hidden flex flex-col items-center justify-center p-6 rounded-[2rem] border transition-all duration-300",
                isActive 
                  ? "bg-primary/10 border-primary/20 shadow-xl shadow-primary/5" 
                  : "bg-card/40 border-border/50 hover:bg-card/60 hover:border-border"
              )}
            >
              <div className={cn(
                "p-3 rounded-2xl transition-all duration-300",
                isActive ? "bg-primary text-primary-foreground scale-110" : cn("bg-muted/50", cat.color, cat.bg)
              )}>
                <Icon className="size-6" />
              </div>
              <span className={cn(
                "mt-3 font-black text-[11px] uppercase tracking-widest transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {cat.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full mx-10" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
