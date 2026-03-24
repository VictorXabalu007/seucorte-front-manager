import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MoneyInput } from "@/components/ui/money-input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  DollarSign, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Calendar,
  FileText,
  Tag,
  CreditCard,
  Plus
} from "lucide-react"

interface TransactionSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionSheet({ isOpen, onOpenChange }: TransactionSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-md overflow-y-auto rounded-l-2xl">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign className="size-6" />
            </div>
            Nova Movimentação
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground text-left">
            Registre uma nova entrada ou saída do seu fluxo de caixa.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-20">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Tipo de Lançamento</p>
            <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 rounded-xl border-2 border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 flex flex-col items-center gap-1 group transition-all">
                    <ArrowUpCircle className="size-5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Entrada</span>
                </Button>
                <Button variant="outline" className="h-16 rounded-xl border-2 border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10 flex flex-col items-center gap-1 group transition-all">
                    <ArrowDownCircle className="size-5 text-rose-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Saída</span>
                </Button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Detalhes Obrigatórios</p>
            
            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <FileText className="size-3 text-primary" /> Descrição
              </Label>
              <Input placeholder="Ex: Pagamento Aluguel Sala" className="h-11 bg-background/50 border-border rounded-xl focus:ring-primary/20" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-3 text-primary" /> Valor
                    </Label>
                    <MoneyInput 
                        placeholder="R$ 0,00" 
                        className="h-11 bg-background/50 border-border rounded-xl focus:ring-primary/20"
                        value={0}
                        onChange={() => {}}
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Calendar className="size-3 text-primary" /> Data
                    </Label>
                    <Input type="date" className="h-11 bg-background/50 border-border rounded-xl focus:ring-primary/20" />
                </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <Tag className="size-3 text-primary" /> Categoria
              </Label>
              <Select>
                <SelectTrigger className="h-11 bg-background/50 border-border rounded-xl">
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="service">Serviços</SelectItem>
                  <SelectItem value="product">Venda de Produtos</SelectItem>
                  <SelectItem value="rent">Aluguel / Sala</SelectItem>
                  <SelectItem value="utilities">Contas (Luz, Água, Net)</SelectItem>
                  <SelectItem value="supplies">Insumos e Estoque</SelectItem>
                  <SelectItem value="salary">Salários / Comissões</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <CreditCard className="size-3 text-primary" /> Método de Pagamento
              </Label>
              <Select>
                <SelectTrigger className="h-11 bg-background/50 border-border rounded-xl">
                  <SelectValue placeholder="Selecione o método" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border">
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="money">Dinheiro</SelectItem>
                  <SelectItem value="credit">Cartão de Crédito</SelectItem>
                  <SelectItem value="debit">Cartão de Débito</SelectItem>
                  <SelectItem value="transfer">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border/50">
          <Button className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
            <Plus className="size-4 mr-2" /> Salvar Movimentação
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
