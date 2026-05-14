import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
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
import { financeiroService } from "@/services/financeiro.service"
import { getActiveUnidadeId } from "@/lib/auth"
import { toast } from "sonner"

const schema = z.object({
  tipo: z.enum(["ENTRADA", "SAIDA"]),
  descricao: z.string().min(3, "Descrição muito curta"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  date: z.string(),
  categoria: z.string().min(1, "Selecione uma categoria"),
  paymentMethod: z.string().min(1, "Selecione um método"),
})

type FormData = z.infer<typeof schema>

interface TransactionSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave?: () => void
}

export function TransactionSheet({ isOpen, onOpenChange, onSave }: TransactionSheetProps) {
  const [isLoading, setIsLoading] = useState(false)

  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      tipo: "ENTRADA",
      descricao: "",
      valor: 0,
      date: new Date().toISOString().split("T")[0],
      categoria: "",
      paymentMethod: "",
    }
  })

  const tipo = watch("tipo")

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      const unidadeId = getActiveUnidadeId()
      if (!unidadeId) {
        toast.error("Unidade não identificada")
        return
      }

      await financeiroService.createTransaction({
        ...data,
        unidadeId,
        origem: "MANUAL",
      })

      toast.success("Movimentação registrada com sucesso!")
      reset()
      onSave?.()
      onOpenChange(false)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao registrar movimentação")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      if (!open) reset()
      onOpenChange(open)
    }}>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Tipo de Lançamento</p>
            <div className="grid grid-cols-2 gap-3">
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setValue("tipo", "ENTRADA")}
                    className={`h-16 rounded-xl border-2 flex flex-col items-center gap-1 group transition-all ${tipo === "ENTRADA" ? "border-emerald-500 bg-emerald-500/10" : "border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10"}`}
                >
                    <ArrowUpCircle className="size-5 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Entrada</span>
                </Button>
                <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => setValue("tipo", "SAIDA")}
                    className={`h-16 rounded-xl border-2 flex flex-col items-center gap-1 group transition-all ${tipo === "SAIDA" ? "border-rose-500 bg-rose-500/10" : "border-rose-500/20 bg-rose-500/5 hover:bg-rose-500/10"}`}
                >
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
              <Controller
                control={control}
                name="descricao"
                render={({ field }) => (
                  <Input {...field} placeholder="Ex: Pagamento Aluguel Sala" className="h-11 bg-background/50 border-border rounded-xl focus:ring-primary/20" />
                )}
              />
              {errors.descricao && <span className="text-[10px] text-rose-500">{errors.descricao.message}</span>}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-3 text-primary" /> Valor
                    </Label>
                    <Controller
                      control={control}
                      name="valor"
                      render={({ field }) => (
                        <MoneyInput 
                            {...field}
                            placeholder="R$ 0,00" 
                            className="h-11 bg-background/50 border-border rounded-xl focus:ring-primary/20"
                            onChange={(val) => field.onChange(val)}
                        />
                      )}
                    />
                    {errors.valor && <span className="text-[10px] text-rose-500">{errors.valor.message}</span>}
                </div>
                <div className="space-y-2">
                    <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Calendar className="size-3 text-primary" /> Data
                    </Label>
                    <Controller
                      control={control}
                      name="date"
                      render={({ field }) => (
                        <Input type="date" {...field} className="h-11 bg-background/50 border-border rounded-xl focus:ring-primary/20" />
                      )}
                    />
                </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <Tag className="size-3 text-primary" /> Categoria
              </Label>
              <Controller
                control={control}
                name="categoria"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 bg-background/50 border-border rounded-xl">
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="SERVICE">Serviços</SelectItem>
                      <SelectItem value="PRODUCT">Venda de Produtos</SelectItem>
                      <SelectItem value="SUBSCRIPTION">Assinaturas</SelectItem>
                      <SelectItem value="COMMISSION">Comissões</SelectItem>
                      <SelectItem value="RENT">Aluguel / Sala</SelectItem>
                      <SelectItem value="UTILITIES">Contas (Luz, Água, Net)</SelectItem>
                      <SelectItem value="SUPPLIES">Insumos e Estoque</SelectItem>
                      <SelectItem value="SALARY">Salários</SelectItem>
                      <SelectItem value="MARKETING">Marketing</SelectItem>
                      <SelectItem value="OTHER">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categoria && <span className="text-[10px] text-rose-500">{errors.categoria.message}</span>}
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                <CreditCard className="size-3 text-primary" /> Método de Pagamento
              </Label>
              <Controller
                control={control}
                name="paymentMethod"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 bg-background/50 border-border rounded-xl">
                      <SelectValue placeholder="Selecione o método" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="PIX">PIX</SelectItem>
                      <SelectItem value="CASH">Dinheiro</SelectItem>
                      <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                      <SelectItem value="DEBIT_CARD">Cartão de Débito</SelectItem>
                      <SelectItem value="TRANSFER">Transferência</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.paymentMethod && <span className="text-[10px] text-rose-500">{errors.paymentMethod.message}</span>}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 bg-background/80 backdrop-blur-md border-t border-border/50">
            <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Plus className="size-4 mr-2" /> {isLoading ? 'Salvando...' : 'Salvar Movimentação'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
