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
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar, 
  Clock, 
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  CreditCard,
  Banknote,
  Smartphone,
  Landmark
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { FinancialTransaction, PaymentMethod } from "../types"

interface CashFlowTableProps {
  transactions: FinancialTransaction[]
}

const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
        case 'CREDIT_CARD':
        case 'DEBIT_CARD':
            return <CreditCard className="size-3" />;
        case 'CASH':
            return <Banknote className="size-3" />;
        case 'PIX':
            return <Smartphone className="size-3" />;
        case 'TRANSFER':
            return <Landmark className="size-3" />;
        default:
            return <FileText className="size-3" />;
    }
}

const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        'SERVICE': 'Serviço',
        'PRODUCT': 'Produto',
        'RENT': 'Aluguel',
        'UTILITIES': 'Utilidades',
        'SUPPLIES': 'Insumos',
        'SALARY': 'Salários',
        'MARKETING': 'Marketing',
        'OTHER': 'Outros'
    };
    return labels[category] || category;
}

export function CashFlowTable({ transactions }: CashFlowTableProps) {
  return (
    <div className="bg-card/40 border border-border/50 rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="p-4 sm:p-8 border-b border-border/50 bg-muted/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="w-full md:w-auto">
          <h3 className="text-lg sm:text-xl font-black tracking-tight">Fluxo de Caixa Detalhado</h3>
          <p className="text-[10px] sm:text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Histórico de entradas e saídas</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:min-w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                <input 
                    type="text" 
                    placeholder="Filtrar por descrição..." 
                    className="w-full pl-10 pr-4 h-11 sm:h-10 bg-background/50 border border-border/50 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
            </div>
            <Button variant="outline" size="sm" className="h-11 sm:h-10 rounded-xl px-4 border-border/50 bg-background/50 shrink-0">
                <Filter className="size-4 mr-2 text-muted-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest">Filtros</span>
            </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/10">
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="py-6 px-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Data & Hora</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Tipo / Categoria</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Origem</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Descrição</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Pagamento</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 text-right">Valor</TableHead>
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
                  <div className="flex flex-col gap-1.5 whitespace-nowrap">
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border self-start",
                        tx.tipo === "ENTRADA" 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    )}>
                        {tx.tipo === "ENTRADA" ? <ArrowUpCircle className="size-2.5" /> : <ArrowDownCircle className="size-2.5" />}
                        {tx.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">{getCategoryLabel(tx.categoria)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest">
                    {tx.origem}
                  </Badge>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-bold text-foreground max-w-[200px] truncate">{tx.descricao}</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/30 rounded-lg border border-border/30 w-fit whitespace-nowrap">
                    {getPaymentIcon(tx.paymentMethod as PaymentMethod)}
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{tx.paymentMethod || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <p className={cn(
                    "text-sm font-black tabular-nums whitespace-nowrap",
                    tx.tipo === "ENTRADA" ? "text-emerald-500" : "text-rose-500"
                  )}>
                    {tx.tipo === "ENTRADA" ? "+" : "-"} R$ {Number(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </TableCell>
                <TableCell className="text-right px-8">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-muted transition-all">
                      <FileText className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-muted transition-all">
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
                    tx.tipo === "ENTRADA" 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                )}>
                    {tx.tipo === "ENTRADA" ? "Entrada" : "Saída"}
                </div>
                <p className="text-xs font-black tracking-tight mt-1">{tx.descricao}</p>
                <div className="flex gap-2 items-center">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{getCategoryLabel(tx.categoria)}</p>
                    <Badge variant="secondary" className="text-[8px] px-1 py-0">{tx.origem}</Badge>
                </div>
              </div>
              <div className="text-right">
                <p className={cn(
                    "text-sm font-black tabular-nums",
                    tx.tipo === "ENTRADA" ? "text-emerald-500" : "text-rose-500"
                )}>
                  {tx.tipo === "ENTRADA" ? "+" : "-"} R$ {Number(tx.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center justify-end gap-1.5 mt-1">
                    <Clock className="size-3 text-muted-foreground/50" />
                    <span className="text-[10px] font-bold text-muted-foreground/50">{format(new Date(tx.date), "HH:mm")}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/10 pt-3">
              <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                      <Calendar className="size-3 text-primary" />
                      <span className="text-[10px] font-bold text-foreground">{format(new Date(tx.date), "dd MMM", { locale: ptBR })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/40 rounded-lg">
                      {getPaymentIcon(tx.paymentMethod as PaymentMethod)}
                      <span className="text-[9px] font-black uppercase text-muted-foreground">{tx.paymentMethod || 'N/A'}</span>
                  </div>
              </div>
              <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="size-7 rounded-lg">
                      <FileText className="size-3.5 text-muted-foreground" />
                  </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 bg-muted/10 border-t border-border/50 flex justify-between items-center px-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
              Mostrando {transactions.length} transações recentes
          </p>
          <div className="flex gap-2">
              <Button variant="ghost" className="h-9 px-4 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">Anterior</Button>
              <Button variant="ghost" className="h-9 px-4 rounded-xl text-xs font-bold text-muted-foreground hover:text-foreground">Próximo</Button>
          </div>
      </div>
    </div>
  )
}
