import { MapPin, Phone, Mail, Edit2, Trash2, Building2 } from "lucide-react"
import type { Unidade } from "../types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface UnidadeCardProps {
  unidade: Unidade
  onEdit: (unidade: Unidade) => void
  onDelete: (id: string) => void
}

export function UnidadeCard({ unidade, onEdit, onDelete }: UnidadeCardProps) {
  return (
    <div className="group relative overflow-hidden bg-card/40 border border-border/50 rounded-3xl p-5 backdrop-blur-sm hover:border-primary/30 transition-all duration-300">
      {/* Background Icon */}
      <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-500 text-primary">
        <Building2 size={120} />
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner group-hover:scale-105 transition-transform duration-300">
              {unidade.logoUrl ? (
                <img src={unidade.logoUrl} alt={unidade.name} className="size-full object-cover rounded-2xl" />
              ) : (
                <Building2 className="size-6 stroke-[2.5px]" />
              )}
            </div>
            <div>
              <h3 className="font-black tracking-tight text-lg leading-tight group-hover:text-primary transition-colors">
                {unidade.name}
              </h3>
              <Badge variant={unidade.isActive ? "default" : "secondary"} className="mt-1 h-5 text-[10px] uppercase font-black tracking-widest px-2">
                {unidade.isActive ? "Ativa" : "Inativa"}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(unidade)}
              className="size-8 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Edit2 className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(unidade.id)}
              className="size-8 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2 mt-auto">
          {unidade.address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <MapPin className="size-4 text-primary/60" />
              <span className="truncate">{unidade.address}</span>
            </div>
          )}
          {unidade.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <Phone className="size-4 text-primary/60" />
              <span>{unidade.phone}</span>
            </div>
          )}
          {unidade.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
              <Mail className="size-4 text-primary/60" />
              <span className="truncate">{unidade.email}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
