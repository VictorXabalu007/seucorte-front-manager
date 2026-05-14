import { useState } from "react"
import { Edit2, Trash2, Mail, Phone, Award, DollarSign, Percent } from "lucide-react"
import type { Barber } from "../types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatBRL } from "@/lib/utils"
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal" // Note: adjust path if needed, usually @/components/ui/DeleteConfirmationModal

interface BarberCardProps {
  barber: Barber
  onEdit: (barber: Barber) => void
  onDelete: (id: string) => void | Promise<void>
}

export function BarberCard({ barber, onEdit, onDelete }: BarberCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  return (
    <>
      <Card className="group overflow-hidden bg-card/40 border-border/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
        <CardHeader className="p-4 pb-0 flex flex-row items-center justify-between space-y-0">
          <Badge 
            variant="outline" 
            className={`${barber.isActive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"} font-bold px-2 py-0.5 rounded-lg text-[10px] uppercase tracking-wider`}
          >
            {barber.isActive ? "Ativo" : "Inativo"}
          </Badge>
          <div className="flex items-center gap-0.5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => onEdit(barber)}
            >
              <Edit2 className="size-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="size-8 rounded-lg text-muted-foreground hover:text-destructive transition-colors"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
             <div 
              className="absolute inset-0 rounded-full blur-xl opacity-20 transition-all duration-500 group-hover:opacity-40"
              style={{ backgroundColor: barber.color }}
             />
             <Avatar className="size-20 border-2 border-border/50 group-hover:border-primary transition-colors relative z-10">
               <AvatarImage src={barber.avatarUrl} alt={barber.name} />
               <AvatarFallback className="bg-muted text-xl font-black">
                 {barber.name.substring(0, 2).toUpperCase()}
               </AvatarFallback>
             </Avatar>
             <div 
              className="absolute -bottom-1 -right-1 size-6 rounded-full border-4 border-background z-20 flex items-center justify-center"
              style={{ backgroundColor: barber.color }}
             >
               <Award className="size-3 text-background stroke-[3px]" />
             </div>
          </div>

          <h3 className="font-black text-lg tracking-tight group-hover:text-primary transition-colors line-clamp-1">
            {barber.name}
          </h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-0.5 opacity-80">
            {barber.specialty || "Barbeiro"}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2 mt-6">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
            <Mail className="size-3" />
            <span className="truncate">{barber.email}</span>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground/80">
            <Phone className="size-3" />
            <span>{barber.phone || "Sem telefone"}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary/50 rounded-xl">
             {barber.commissionType === "PERCENTAGE" ? (
               <>
                 <Percent className="size-3 text-primary animate-pulse" />
                 <span className="text-xs font-black text-primary">{barber.commissionValue}%</span>
               </>
             ) : (
               <>
                 <DollarSign className="size-3 text-emerald-500" />
                 <span className="text-xs font-black text-emerald-500">
                    {barber.commissionValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                 </span>
               </>
             )}
          </div>
          <div className="text-[10px] font-bold text-muted-foreground/50 uppercase">
            Comissão
          </div>
        </div>
      </CardContent>
    </Card>

    <DeleteConfirmationModal
      isOpen={isDeleteModalOpen}
      onOpenChange={setIsDeleteModalOpen}
      onConfirm={() => {
        onDelete(barber.id)
        setIsDeleteModalOpen(false)
      }}
      title="Inativar Barbeiro"
      description="Tem certeza que deseja inativar este barbeiro? O histórico de atendimentos e relatórios será preservado, mas ele não aparecerá mais na agenda para novos agendamentos."
      itemName={barber.name}
      confirmLabel="Sim, inativar"
    />
  </>
  )
}
