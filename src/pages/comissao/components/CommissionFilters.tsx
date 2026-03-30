import { 
  Search, 
  Filter, 
  Calendar, 
  ChevronDown,
  X 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface CommissionFiltersProps {
  searchTerm: string
  setSearchTerm: (val: string) => void
  barberFilter: string
  setBarberFilter: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  typeFilter: string
  setTypeFilter: (val: string) => void
}

export function CommissionFilters({
  searchTerm,
  setSearchTerm,
  barberFilter,
  setBarberFilter,
  statusFilter,
  setStatusFilter,
  typeFilter,
  setTypeFilter
}: CommissionFiltersProps) {
  
  const hasActiveFilters = barberFilter !== "all" || statusFilter !== "all" || typeFilter !== "all" || searchTerm !== ""

  const resetFilters = () => {
    setSearchTerm("")
    setBarberFilter("all")
    setStatusFilter("all")
    setTypeFilter("all")
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
      <div className="flex flex-1 items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
          <Input 
            placeholder="Buscar por item ou barbeiro..." 
            className="pl-11 h-12 bg-card/40 border-border/50 rounded-xl focus:ring-primary/20 text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-12 px-6 rounded-xl border-border/50 bg-card/40 flex items-center gap-2 group shrink-0">
              <Filter className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-bold">Filtros Avançados</span>
              {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 bg-primary/10 text-primary border-0 rounded-full size-5 p-0 flex items-center justify-center text-[10px]">
                      { (barberFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0) + (typeFilter !== "all" ? 1 : 0) }
                  </Badge>
              )}
              <ChevronDown className="size-4 text-muted-foreground/30 transition-transform group-data-[state=open]:rotate-180" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 rounded-xl border-border/50 shadow-2xl overflow-hidden" align="start">
              <div className="p-6 space-y-6">
                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Barbeiro</p>
                    <Select value={barberFilter} onValueChange={setBarberFilter}>
                        <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-border/50">
                            <SelectValue placeholder="Todos Barbeiros" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-border">
                            <SelectItem value="all">Todos Barbeiros</SelectItem>
                            <SelectItem value="ricardo">Ricardo Barber</SelectItem>
                            <SelectItem value="joao">João Silva</SelectItem>
                            <SelectItem value="pedro">Pedro Santos</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Status de Pagamento</p>
                    <div className="grid grid-cols-2 gap-2">
                        {["all", "PENDING", "PAID"].map((status) => (
                            <Button 
                                key={status}
                                variant={statusFilter === status ? "default" : "outline"}
                                className={cn(
                                    "h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    statusFilter === status 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                        : "border-border/50 text-muted-foreground hover:bg-muted"
                                )}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status === "all" ? "Todos" : status === "PENDING" ? "Pendente" : "Liquidado"}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Tipo de Atendimento</p>
                    <div className="grid grid-cols-3 gap-2">
                        {["all", "AVULSO", "PLANO"].map((tipo) => (
                            <Button 
                                key={tipo}
                                variant={typeFilter === tipo ? "default" : "outline"}
                                className={cn(
                                    "h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    typeFilter === tipo 
                                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                        : "border-border/50 text-muted-foreground hover:bg-muted"
                                )}
                                onClick={() => setTypeFilter(tipo)}
                            >
                                {tipo === "all" ? "Todos" : tipo === "AVULSO" ? "Avulso" : "Plano"}
                            </Button>
                        ))}
                    </div>
                </div>
              </div>
              
              <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-between">
                  <Button variant="ghost" size="sm" className="text-xs font-bold text-muted-foreground hover:text-rose-500 gap-2" onClick={resetFilters}>
                      <X className="size-3" /> Limpar Filtros
                  </Button>
                  <Button size="sm" className="rounded-xl h-9 px-4 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest">Aplicar</Button>
              </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex items-center gap-2 bg-card/40 border border-border/50 rounded-xl p-1.5 shrink-0">
          <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/10">Hoje</Button>
          <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all">Semana</Button>
          <Button variant="ghost" className="h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all">Mês</Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:bg-muted">
              <Calendar className="size-4" />
          </Button>
      </div>
    </div>
  )
}
