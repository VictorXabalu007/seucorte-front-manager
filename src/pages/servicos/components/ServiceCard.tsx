import { MoreVertical, Clock, DollarSign, Edit2, Trash2 } from "lucide-react"
import type { Service } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatBRL } from "@/lib/utils"

interface ServiceCardProps {
  service: Service
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
}

export function ServiceCard({ service, onEdit, onDelete }: ServiceCardProps) {
  return (
    <Card className="group overflow-hidden bg-card/40 border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider">
            {service.category}
          </Badge>
          <Badge 
            variant="outline" 
            className={`font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider ${
              service.isActive 
                ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            {service.isActive ? "Ativo" : "Inativo"}
          </Badge>
        </div>
        <div className="flex items-center gap-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onEdit(service)}
          >
            <Edit2 className="size-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="size-8 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
            onClick={() => onDelete(service.id)}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <h3 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1">
          {service.name}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2 h-10 font-medium">
          {service.description || "Nenhuma descrição informada."}
        </p>
        
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="size-3.5" />
            <span className="text-xs font-bold">{service.duration} min</span>
          </div>
          <div className="flex items-center gap-1.5 text-primary">
            <DollarSign className="size-3.5" />
            <span className="text-sm font-black">
              {formatBRL(service.price)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
