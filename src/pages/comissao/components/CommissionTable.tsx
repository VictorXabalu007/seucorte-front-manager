import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Scissors, 
  Package, 
  Calendar, 
  Clock, 
  ArrowRight,
  MoreHorizontal,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { CommissionTransaction } from "../types"

interface CommissionTableProps {
  transactions: CommissionTransaction[]
  onMarkAsPaid: (id: string) => void
}

export function CommissionTable({ transactions, onMarkAsPaid }: CommissionTableProps) {
  return (
    <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm self-start">
      <div className="p-4 sm:p-8 border-b border-border/50 bg-muted/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
          <h3 className="text-lg sm:text-xl font-black tracking-tight">Detalhamento de Comissões</h3>
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Histórico de vendas por barbeiro</p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
            <Button variant="outline" size="sm" className="flex-1 md:flex-none rounded-xl font-black text-[10px] uppercase tracking-widest h-11 sm:h-9 px-4 border-border/50 bg-card/40">Exportar</Button>
            <Button size="sm" className="flex-1 md:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest h-11 sm:h-9 px-4 shadow-lg shadow-primary/20 border-0">Pagar Tudo</Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Data & Hora</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Tipo</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Item</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Barbeiro</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Venda Bruta</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Divisão (Casa / Barbeiro)</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Status</TableHead>
              <TableHead className="text-right py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => (
              <TableRow key={tx.id} className="group border-border/30 hover:bg-primary/[0.02] transition-colors">
                <TableCell className="py-5 px-8">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-black tracking-tight flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar className="size-3 text-primary" />
                      {format(new Date(tx.date), "dd 'de' MMM", { locale: ptBR })}
                    </p>
                    <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
                      <Clock className="size-3" />
                      {format(new Date(tx.date), "HH:mm")}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border whitespace-nowrap",
                    tx.type === "SERVICE" 
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {tx.type === "SERVICE" ? <Scissors className="size-2.5" /> : <Package className="size-2.5" />}
                    {tx.type === "SERVICE" ? "Serviço" : "Produto"}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{tx.description}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center text-[10px] font-black text-primary uppercase">
                       {tx.barberName.substring(0, 2)}
                    </div>
                    <p className="text-xs font-bold">{tx.barberName}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-black tabular-nums whitespace-nowrap">R$ {tx.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">CASA</span>
                            <span className="text-xs font-black text-slate-500 tabular-nums">R$ {tx.houseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <ArrowRight className="size-3 text-muted-foreground/30" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-primary uppercase leading-none mb-1">PRO</span>
                            <span className="text-xs font-black text-primary tabular-nums">R$ {tx.commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <div className={cn(
                        "flex items-center gap-1.5 whitespace-nowrap",
                        tx.status === "PAID" ? "text-emerald-500" : "text-rose-500"
                    )}>
                        {tx.status === "PAID" ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                        <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                            {tx.status === "PAID" ? "Liquidado" : "Pendente"}
                        </span>
                    </div>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {tx.status === "PENDING" && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Marcar como Pago"
                            onClick={() => onMarkAsPaid(tx.id)}
                            className="size-8 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                        >
                            <CheckCircle2 className="size-4" />
                        </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="size-8 rounded-xl hover:bg-muted transition-all"
                    >
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-border/30">
        {transactions.map((tx) => (
          <div key={tx.id} className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border self-start",
                    tx.type === "SERVICE" 
                      ? "bg-blue-500/10 text-blue-500 border-blue-500/20" 
                      : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {tx.type === "SERVICE" ? "Serviço" : "Produto"}
                </div>
                <p className="text-xs font-black tracking-tight mt-1">{tx.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <div className="size-4 rounded bg-primary/10 flex items-center justify-center text-[8px] font-black text-primary uppercase">
                       {tx.barberName.substring(0, 2)}
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground">{tx.barberName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black tabular-nums">R$ {tx.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                <div className={cn(
                    "flex items-center justify-end gap-1 mt-1",
                    tx.status === "PAID" ? "text-emerald-500" : "text-rose-500"
                )}>
                    {tx.status === "PAID" ? <CheckCircle2 className="size-3" /> : <AlertCircle className="size-3" />}
                    <span className="text-[10px] font-black uppercase leading-none">{tx.status === "PAID" ? "Geral" : "Pend"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-muted/20 p-3 rounded-2xl border border-border/5">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-muted-foreground uppercase mb-1">Comissão Barbeiro</span>
                    <span className="text-xs font-black text-primary tabular-nums">R$ {tx.commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex flex-col text-right">
                    <span className="text-[8px] font-black text-muted-foreground uppercase mb-1">Cota da Casa</span>
                    <span className="text-xs font-black text-slate-500 tabular-nums">R$ {tx.houseValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/10 pt-3">
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-primary" />
                      <span className="text-[10px] font-bold text-foreground">{format(new Date(tx.date), "dd MMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                      <Clock className="size-3 text-muted-foreground/50" />
                      <span className="text-[10px] font-bold text-muted-foreground/50">{format(new Date(tx.date), "HH:mm")}</span>
                  </div>
              </div>
              <div className="flex gap-1">
                  {tx.status === "PENDING" && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-7 rounded-lg text-emerald-500"
                        onClick={() => onMarkAsPaid(tx.id)}
                    >
                        <CheckCircle2 className="size-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="size-7 rounded-lg">
                      <MoreHorizontal className="size-4 text-muted-foreground" />
                  </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 sm:p-6 bg-muted/10 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4 px-4 sm:px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              {transactions.length} transações recentes
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="ghost" className="flex-1 sm:flex-none h-11 sm:h-9 px-4 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">Anterior</Button>
              <Button variant="ghost" className="flex-1 sm:flex-none h-11 sm:h-9 px-4 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">Próximo</Button>
          </div>
      </div>
    </div>
  )
}
