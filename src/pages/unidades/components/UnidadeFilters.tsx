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

interface UnidadeFiltersProps {
  searchTerm: string
  setSearchTerm: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  onClear: () => void
}

export function UnidadeFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onClear,
}: UnidadeFiltersProps) {
  const hasFilters = searchTerm !== "" || statusFilter !== "all"

  return (
    <div className="flex flex-col md:flex-row gap-3 items-center bg-card/40 border border-border/50 p-3 rounded-2xl backdrop-blur-sm">
      <div className="relative w-full md:flex-1 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <Input
          placeholder="Buscar unidade por nome, endereço..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-11 bg-background/50 border-border/50 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/30 transition-all font-medium"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      <div className="flex gap-3 w-full md:w-auto h-11">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[160px] h-full bg-background/50 border-border/50 rounded-xl font-bold focus:ring-primary/20">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-primary/60" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/50 shadow-2xl">
            <SelectItem value="all" className="font-bold">Todos Status</SelectItem>
            <SelectItem value="active" className="font-bold">Ativas</SelectItem>
            <SelectItem value="inactive" className="font-bold">Inativas</SelectItem>
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant="outline"
            onClick={onClear}
            className="h-full rounded-xl border-border/50 font-bold px-4 hover:bg-primary/5 transition-colors gap-2"
          >
            <X className="size-4" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  )
}
