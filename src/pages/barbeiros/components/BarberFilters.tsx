import { Search, X, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface BarberFiltersProps {
  searchTerm: string
  setSearchTerm: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  onClear: () => void
}

export function BarberFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onClear
}: BarberFiltersProps) {
  const hasActiveFilters = searchTerm !== "" || statusFilter !== "all"

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Buscar barbeiros por nome, especialidade ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="w-full md:w-[180px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 bg-card/40 border-border/50 rounded-2xl font-medium focus:ring-primary/20">
              <div className="flex items-center gap-2">
                <Filter className="size-4 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/50 rounded-xl">
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="inactive">Inativos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClear}
            className="h-11 px-4 rounded-2xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 font-bold transition-all text-sm gap-2"
          >
            <X className="size-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}
