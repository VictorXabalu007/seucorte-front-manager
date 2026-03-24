import { DollarSign, Clock, Tag, PackageOpen, MoreVertical, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { ComboCardProps } from "../types"

export function ComboCard({ combo, servicesList, onEdit, onDelete }: ComboCardProps) {
  const isInactive = !combo.isActive
  const includedServicesIds = combo.serviceIds || []
  const includedServices = servicesList.filter(s => includedServicesIds.includes(s.id))

  return (
    <div className={cn(
      "group relative flex flex-col justify-between p-4 rounded-3xl border transition-all duration-500 overflow-hidden",
      isInactive 
        ? "bg-card/20 border-border/30 opacity-70 grayscale-[0.5]" 
        : "bg-card/40 border-border/50 hover:bg-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
    )}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-transform duration-500 group-hover:scale-110" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
          <PackageOpen className={cn("size-6", isInactive && "opacity-50")} />
        </div>
        <div className="flex items-center gap-2">
          {!combo.isActive && (
            <Badge variant="secondary" className="bg-muted text-muted-foreground font-black uppercase text-[9px] tracking-widest px-2 py-0.5 rounded-lg border-0">
              Inativo
            </Badge>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 -mr-2">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Menu de opções do combo</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl border-border/50 shadow-xl p-2 font-medium">
              <DropdownMenuItem onClick={() => onEdit(combo)} className="rounded-xl focus:bg-primary/10 focus:text-primary cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                Editar combo
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50 mx-2 my-2" />
              <DropdownMenuItem onClick={() => onDelete(combo.id)} className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <h3 className={cn("text-lg font-black tracking-tight line-clamp-1", isInactive && "text-muted-foreground")}>
          {combo.name}
        </h3>
        {combo.description ? (
          <p className="text-xs font-medium text-muted-foreground line-clamp-2 min-h-[32px]">{combo.description}</p>
        ) : (
          <p className="text-xs font-medium text-muted-foreground/50 italic min-h-[32px]">Sem descrição</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex divide-x divide-border/50 bg-black/5 dark:bg-white/5 rounded-2xl p-2.5">
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            <DollarSign className="size-4 text-emerald-500" />
            <span className="text-sm font-black text-emerald-500 tracking-tight">
              {Number(combo.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-1">
            <Clock className="size-4 text-blue-500" />
            <span className="text-sm font-black text-blue-500 tracking-tight">
              {combo.duration} min
            </span>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1.5 ml-1">
            <Tag className="size-3" />
            Serviços Inclusos
          </p>
          <div className="min-h-[44px]">
            {includedServices.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {includedServices.map((service) => (
                  <Badge 
                    key={service.id} 
                    variant="outline"
                    className="bg-card font-bold text-[10px] tracking-tight hover:bg-card truncate max-w-full px-2 py-0.5 rounded-lg border-border/80"
                  >
                    {service.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-[11px] font-medium text-muted-foreground pt-1.5">Nenhum serviço selecionado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
