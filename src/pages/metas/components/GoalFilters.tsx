import { Search, Filter, X, Target, TrendingUp, Calendar, User, LayoutGrid } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { MetaType, MetaStatus } from "../types"

interface GoalFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  typeFilter: string
  setTypeFilter: (type: string) => void
  statusFilter: string
  setStatusFilter: (status: string) => void
  onClear: () => void
}

export function GoalFilters({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  statusFilter,
  setStatusFilter,
  onClear
}: GoalFiltersProps) {
  const isFiltered = searchTerm !== "" || typeFilter !== "all" || statusFilter !== "all"

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-end lg:items-center bg-card/40 border border-border/50 p-4 rounded-[2.5rem] backdrop-blur-sm">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar metas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 h-12 bg-background/50 border-border/40 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all"
        />
      </div>

      <div className="flex flex-wrap sm:flex-nowrap gap-3 w-full lg:w-auto">
        <div className="flex-1 sm:w-48">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-2xl font-bold px-4 focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <Target className="size-4 text-primary" />
                <SelectValue placeholder="Tipo de Meta" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-md">
              <SelectItem value="all" className="rounded-xl font-bold">Todos os Tipos</SelectItem>
              <SelectItem value="revenue" className="rounded-xl font-bold">Faturamento</SelectItem>
              <SelectItem value="bookings" className="rounded-xl font-bold">Agendamentos</SelectItem>
              <SelectItem value="new_clients" className="rounded-xl font-bold">Novos Clientes</SelectItem>
              <SelectItem value="services" className="rounded-xl font-bold">Serviços</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 sm:w-48">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-12 bg-background/50 border-border/40 rounded-2xl font-bold px-4 focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <LayoutGrid className="size-4 text-primary" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-md">
              <SelectItem value="all" className="rounded-xl font-bold">Todos Status</SelectItem>
              <SelectItem value="active" className="rounded-xl font-bold text-primary">Ativas</SelectItem>
              <SelectItem value="completed" className="rounded-xl font-bold text-emerald-500">Alcançadas</SelectItem>
              <SelectItem value="failed" className="rounded-xl font-bold text-rose-500">Não Alcançadas</SelectItem>
              <SelectItem value="pending" className="rounded-xl font-bold text-amber-500">Pendentes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={onClear}
            className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
          >
            <X className="size-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}
