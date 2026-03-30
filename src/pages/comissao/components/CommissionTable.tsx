import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { 
  Scissors, 
  Package, 
  CheckCircle2,
  Download,
  ChevronLeft,
  ChevronRight,
  CreditCard
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
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="w-1.5 h-6 bg-primary rounded-full"></span>
          Histórico de Movimentações
        </h2>
        <button className="flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
          <Download className="size-4" />
          Exportar Relatório
        </button>
      </div>

      <div className="bg-card/40 rounded-2xl border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full text-left border-collapse">
            <TableHeader>
              <TableRow className="bg-muted/30 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:bg-muted/30">
                <TableHead className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Barbeiro</TableHead>
                <TableHead className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Data/Hora</TableHead>
                <TableHead className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Tipo/Serviço</TableHead>
                <TableHead className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Valor Bruto</TableHead>
                <TableHead className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto text-right">% Com.</TableHead>
                <TableHead className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto text-right">Valor Com.</TableHead>
                <TableHead className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-sm divide-y divide-border/50">
              {transactions.map((tx) => {
                const commissionPercentage = Math.round((tx.commissionValue / tx.totalValue) * 100)
                
                return (
                  <TableRow key={tx.id} className="hover:bg-muted/30 transition-colors group border-border/50">
                    <TableCell className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center text-xs font-bold text-primary border border-border/50 uppercase">
                          {tx.barberName.substring(0, 2)}
                        </div>
                        <span className="font-bold text-foreground group-hover:text-primary transition-colors">{tx.barberName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="p-4 text-muted-foreground">
                      {format(new Date(tx.date), "dd MMM '•' HH:mm", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {tx.type === "SERVICE" ? (
                           <Scissors className="size-4 text-blue-500 shrink-0" />
                        ) : (
                           <Package className="size-4 text-amber-500 shrink-0" />
                        )}
                        <span className="font-medium text-foreground">{tx.description}</span>
                        {tx.isPlano && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 text-[10px] font-black border border-violet-500/20 uppercase tracking-widest shrink-0">
                            <CreditCard className="size-2.5" />
                            Plano
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="p-4 font-medium tabular-nums">
                      R$ {tx.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="p-4 text-right text-muted-foreground tabular-nums">
                      {commissionPercentage}%
                    </TableCell>
                    <TableCell className="p-4 text-right font-bold text-emerald-500 tabular-nums">
                      R$ {tx.commissionValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        {tx.status === "PAID" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-bold border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Pago
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                              Pendente
                            </span>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              title="Marcar como Pago"
                              onClick={() => onMarkAsPaid(tx.id)}
                              className="h-7 px-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white border-0 text-xs"
                            >
                              <CheckCircle2 className="size-3 mr-1" /> Pagar
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        
        <div className="p-4 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-4">
          <span>Mostrando 1 a {transactions.length} de {transactions.length} registros</span>
          <div className="flex gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors disabled:opacity-50">
              <ChevronLeft className="size-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors font-bold">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors font-bold">3</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
