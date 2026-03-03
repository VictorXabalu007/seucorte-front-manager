import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Professional, Service } from "../types"

interface AppointmentFiltersProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  professionalFilter: string
  setProfessionalFilter: (v: string) => void
  serviceFilter: string
  setServiceFilter: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  dateFilter: string
  professionals: Professional[]
  services: Service[]
  onClear: () => void
}

export function AppointmentFilters({
  searchTerm, setSearchTerm,
  professionalFilter, setProfessionalFilter,
  serviceFilter, setServiceFilter,
  statusFilter, setStatusFilter,
  dateFilter,
  professionals, services,
  onClear,
}: AppointmentFiltersProps) {
  const hasFilters = searchTerm || professionalFilter !== "all" || serviceFilter !== "all" || statusFilter !== "all" || dateFilter !== "all"

  return (
    <div className="bg-card/40 border border-border/50 rounded-2xl p-4 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 lg:h-9 bg-background/50 border-border/50 rounded-xl text-xs font-medium focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <div className="grid grid-cols-2 lg:flex gap-3">
          {/* Barbeiro */}
          <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
            <SelectTrigger className="w-full lg:w-40 h-11 lg:h-9 rounded-xl bg-background/50 border-border/50 text-xs font-bold">
              <SelectValue placeholder="Barbeiro" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-md">
              <SelectItem value="all" className="text-xs font-bold">Todos Barbeiros</SelectItem>
              {professionals.map(p => (
                <SelectItem key={p.id} value={p.id} className="text-xs font-bold">{p.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Serviço */}
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-full lg:w-40 h-11 lg:h-9 rounded-xl bg-background/50 border-border/50 text-xs font-bold">
              <SelectValue placeholder="Serviço" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-md">
              <SelectItem value="all" className="text-xs font-bold">Todos Serviços</SelectItem>
              {services.map(s => (
                <SelectItem key={s.id} value={s.id} className="text-xs font-bold">{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-40 h-11 lg:h-9 rounded-xl bg-background/50 border-border/50 text-xs font-bold">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-md">
              <SelectItem value="all" className="text-xs font-bold">Todos Status</SelectItem>
              <SelectItem value="SCHEDULED" className="text-xs font-bold">Agendado</SelectItem>
              <SelectItem value="CONFIRMED" className="text-xs font-bold">Confirmado</SelectItem>
              <SelectItem value="COMPLETED" className="text-xs font-bold">Concluído</SelectItem>
              <SelectItem value="CANCELLED" className="text-xs font-bold">Cancelado</SelectItem>
              <SelectItem value="NO_SHOW" className="text-xs font-bold">Não Compareceu</SelectItem>
            </SelectContent>
          </Select>
          
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClear}
              className="w-full lg:w-auto h-11 lg:h-9 px-3 text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl font-bold"
            >
              <X className="size-3.5 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

