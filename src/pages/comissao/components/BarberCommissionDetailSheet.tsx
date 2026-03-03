import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from "@/components/ui/sheet"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Scissors, 
  Package, 
  Calendar, 
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CommissionTransaction, BarberCommissionStats } from "../types"

interface BarberCommissionDetailSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  barber: BarberCommissionStats | null
  transactions: CommissionTransaction[]
  onMarkAsPaid: (id: string) => void
}

export function BarberCommissionDetailSheet({ 
  isOpen, 
  onOpenChange, 
  barber, 
  transactions,
  onMarkAsPaid
}: BarberCommissionDetailSheetProps) {
  if (!barber) return null

  const barberTransactions = transactions.filter(tx => tx.barberId === barber.barberId)

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl rounded-l-2xl border-l border-border/50 bg-card/95 backdrop-blur-xl p-0 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-border/50 bg-muted/20">
          <SheetHeader>
            <div className="flex items-center gap-4 mb-2">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                    {barber.barberName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                   <SheetTitle className="text-2xl font-black tracking-tighter">Detalhes de Comissões</SheetTitle>
                   <SheetDescription className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-0.5">
                      Extrato detalhado • {barber.barberName}
                   </SheetDescription>
                </div>
            </div>
          </SheetHeader>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total a Receber</p>
                    <p className="text-2xl font-black tracking-tighter text-rose-500">
                        R$ {barber.pendingCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total Já Pago</p>
                    <p className="text-2xl font-black tracking-tighter text-emerald-500">
                        R$ {barber.paidCommission.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Lançamentos Recentes</h3>
                
                <div className="border border-border/50 rounded-xl overflow-hidden">
                    <Table>
                        <TableHeader className="bg-muted/20">
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Item</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right">Comissão</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-center">Status</TableHead>
                                <TableHead className="text-[10px] font-black uppercase tracking-widest text-right"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {barberTransactions.map((tx) => (
                                <TableRow key={tx.id} className="border-border/30 group">
                                    <TableCell className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{tx.description}</span>
                                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                                                <Calendar className="size-2.5" />
                                                {format(new Date(tx.date), "dd/MM/yyyy")}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <p className="text-xs font-black tabular-nums text-primary">
                                            R$ {tx.commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className={cn(
                                            "inline-flex p-1 rounded-full",
                                            tx.status === "PAID" ? "text-emerald-500 bg-emerald-500/10" : "text-rose-500 bg-rose-500/10"
                                        )}>
                                            {tx.status === "PAID" ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {tx.status === "PENDING" && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="h-7 px-2 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-500/10 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => onMarkAsPaid(tx.id)}
                                            >
                                                Pagar
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>

        <div className="p-8 border-t border-border/50 bg-muted/20">
            <Button 
                className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs"
                onClick={() => onOpenChange(false)}
            >
                Fechar Detalhamento
            </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
