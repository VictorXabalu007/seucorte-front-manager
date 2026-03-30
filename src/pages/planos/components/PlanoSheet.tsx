import { useEffect, useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  Trash2,
  PlusCircle,
  Save,
  Type,
  Activity,
  Scissors,
  Users,
  Search,
  X
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Plano } from "../types/plano"
import type { Service } from "../../servicos/types"

const planoSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  price: z.coerce.number().min(0, "Preço inválido"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  features: z.array(z.string().min(1, "Característica não pode ser vazia")).min(1, "Adicione pelo menos uma característica"),
  billingCycle: z.enum(["monthly", "yearly"]),
  isActive: z.boolean(),
  serviceIds: z.array(z.string()).optional(),
  clienteIds: z.array(z.string()).optional(),
})

type PlanoFormValues = z.infer<typeof planoSchema>

interface PlanoSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: PlanoFormValues) => void
  plano?: Plano | null
  servicosDisponiveis: Service[]
  clientesDisponiveis: any[]
}

export function PlanoSheet({
  isOpen,
  onOpenChange,
  onSave,
  plano,
  servicosDisponiveis,
  clientesDisponiveis
}: PlanoSheetProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(planoSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      features: [""],
      billingCycle: "monthly",
      isActive: true,
      serviceIds: [],
      clienteIds: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features" as never,
  })

  useEffect(() => {
    if (isOpen) {
      if (plano) {
        form.reset({
          name: plano.name,
          price: plano.price,
          description: plano.description,
          features: plano.features,
          billingCycle: plano.billingCycle,
          isActive: plano.isActive,
          serviceIds: plano.servicos ? plano.servicos.map((s: any) => s.id) : [],
          clienteIds: clientesDisponiveis
            .filter(c => c.assinaturas?.some((a: any) => a.plano.id === plano.id && a.isActive))
            .map(c => c.id),
        })
      } else {
        form.reset({
          name: "",
          price: 0,
          description: "",
          features: [""],
          billingCycle: "monthly",
          isActive: true,
          serviceIds: [],
          clienteIds: [],
        })
      }
    }
  }, [isOpen, plano, form])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-md overflow-y-auto rounded-l-2xl">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <CreditCard className="size-6" />
            </div>
            {plano ? "Editar Plano" : "Criar Novo Plano"}
          </SheetTitle>
          <p className="text-sm text-muted-foreground text-left">
            {plano 
              ? "Ajuste os valores e benefícios deste plano de assinatura." 
              : "Defina o nome, preço e as vantagens do novo plano para seus clientes."
            }
          </p>
        </SheetHeader>

        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSave, (errors) => console.log("Erro na validação do plano:", errors))} 
            className="space-y-6 pb-6"
          >
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Identificação & Custo</p>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <Type className="size-3 text-primary" /> Nome do Plano
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Master Experience" className="bg-background/50 border-border rounded-xl focus:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-3 text-primary" /> Valor Mensal
                      </FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0,00" className="bg-background/50 border-border rounded-xl focus:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingCycle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground">Ciclo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border rounded-xl h-10">
                            <SelectValue placeholder="Selecione o ciclo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border bg-card">
                          <SelectItem value="monthly" className="font-medium text-sm">Mensal</SelectItem>
                          <SelectItem value="yearly" className="font-medium text-sm">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Serviços Cobertos pelo Plano</p>
              
              <FormField
                control={form.control}
                name="serviceIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Scissors className="size-3 text-primary" /> Selecione os serviços
                      </FormLabel>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Apenas os serviços marcados abaixo usarão o saldo de fichas do cliente.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                      {servicosDisponiveis.map((service) => {
                        const isChecked = field.value?.includes(service.id) || false
                        return (
                          <div
                            key={service.id}
                            className={`flex flex-row items-start space-x-3 space-y-0 rounded-lg border p-3 cursor-pointer transition-colors ${
                              isChecked ? "bg-primary/5 border-primary/30" : "bg-card border-border/50 hover:bg-muted/50"
                            }`}
                            onClick={() => {
                              const currentValues = field.value || []
                              const newValue = isChecked
                                ? currentValues.filter((v) => v !== service.id)
                                : [...currentValues, service.id]
                              field.onChange(newValue)
                            }}
                          >
                            <FormControl>
                              <Checkbox
                                checked={isChecked}
                                onClick={(e) => e.stopPropagation()}
                                onCheckedChange={(checked) => {
                                  const currentValues = field.value || []
                                  const newValue = checked
                                    ? [...currentValues, service.id]
                                    : currentValues.filter((v) => v !== service.id)
                                  field.onChange(newValue)
                                }}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none mt-0">
                              <FormLabel className="text-xs font-semibold cursor-pointer">
                                {service.name}
                              </FormLabel>
                              <p className="text-[10px] text-muted-foreground">
                                {service.creditsCost} {service.creditsCost === 1 ? 'ficha' : 'fichas'}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                      {servicosDisponiveis.length === 0 && (
                        <div className="col-span-full py-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                          Nenhum serviço cadastrado na unidade.
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground">Descrição Curta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva os benefícios gerais do plano..." className="bg-background/50 border-border rounded-xl focus:ring-primary/20 min-h-[80px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Clientes Assinantes</p>
              
              <div className="relative mb-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                <Input 
                  placeholder="Buscar clientes por nome..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-9 text-xs bg-background/50 border-border rounded-xl focus:ring-primary/20"
                />
              </div>

              <FormField
                control={form.control}
                name="clienteIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-2">
                      {clientesDisponiveis
                        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((cliente) => {
                          const isChecked = field.value?.includes(cliente.id) || false
                          return (
                            <div
                              key={cliente.id}
                              className={`flex flex-row items-center space-x-3 space-y-0 rounded-lg border p-2 cursor-pointer transition-colors ${
                                isChecked ? "bg-primary/5 border-primary/30" : "bg-card border-border/50 hover:bg-muted/50"
                              }`}
                              onClick={() => {
                                const currentValues = field.value || []
                                const newValue = isChecked
                                  ? currentValues.filter((v) => v !== cliente.id)
                                  : [...currentValues, cliente.id]
                                field.onChange(newValue)
                              }}
                            >
                              <FormControl>
                                <Checkbox
                                  checked={isChecked}
                                  onClick={(e) => e.stopPropagation()}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || []
                                    const newValue = checked
                                      ? [...currentValues, cliente.id]
                                      : currentValues.filter((v) => v !== cliente.id)
                                    field.onChange(newValue)
                                  }}
                                />
                              </FormControl>
                              <div className="flex-1 min-w-0">
                                <FormLabel className="text-[11px] font-bold cursor-pointer truncate block">
                                  {cliente.name}
                                </FormLabel>
                                <p className="text-[9px] text-muted-foreground truncate">
                                  {cliente.email || cliente.phone}
                                </p>
                              </div>
                              <Users className={`size-3 ${isChecked ? "text-primary" : "text-muted-foreground/30"}`} />
                            </div>
                          )
                        })}
                      {clientesDisponiveis.length === 0 && (
                        <div className="py-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border font-medium">
                          Nenhum cliente disponível.
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Recursos & Vantagens</p>
                <Button type="button" variant="ghost" size="sm" onClick={() => append("")} className="h-7 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1">
                  <Plus className="size-3" /> Adicionar
                </Button>
              </div>
              
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`features.${index}` as any}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <div className="size-6 shrink-0 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                            <CheckCircle2 className="size-3.5" />
                          </div>
                          <FormControl>
                            <Input placeholder={`Vantagem ${index + 1}`} className="h-9 bg-background/50 border-border rounded-lg text-xs" {...inputField} />
                          </FormControl>
                          {fields.length > 1 && (
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="size-9 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                    <Activity className="size-3 text-primary" /> Status do Plano
                  </FormLabel>
                  <Select 
                    onValueChange={(val) => field.onChange(val === "true")} 
                    defaultValue={field.value ? "true" : "false"}
                    value={field.value ? "true" : "false"}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background/50 border-border rounded-xl h-10">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border bg-card">
                      <SelectItem value="true" className="font-medium text-sm">Disponível para Venda</SelectItem>
                      <SelectItem value="false" className="font-medium text-sm">Indisponível (Pausado)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="mt-8 flex gap-3 sm:flex-row flex-col pt-6 border-t border-border/50">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1 border-border text-muted-foreground hover:bg-muted rounded-xl h-11 font-bold">
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 shadow-lg shadow-primary/20 flex items-center gap-2">
                {plano ? (
                  <>
                    <Save className="size-4" />
                    Salvar Plano
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" />
                    Criar Plano
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
