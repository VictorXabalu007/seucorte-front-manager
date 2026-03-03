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
  Activity
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

const planoSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  price: z.coerce.number().min(0, "Preço inválido"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  features: z.array(z.string().min(1, "Característica não pode ser vazia")).min(1, "Adicione pelo menos uma característica"),
  billingCycle: z.enum(["monthly", "yearly"]),
  active: z.boolean(),
})

type PlanoFormValues = z.infer<typeof planoSchema>

interface PlanoSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: PlanoFormValues) => void
  plano?: Plano | null
}

export function PlanoSheet({
  isOpen,
  onOpenChange,
  onSave,
  plano
}: PlanoSheetProps) {
  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(planoSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      features: [""],
      billingCycle: "monthly",
      active: true,
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
          active: plano.active,
        })
      } else {
        form.reset({
          name: "",
          price: 0,
          description: "",
          features: [""],
          billingCycle: "monthly",
          active: true,
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
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6 pb-6">
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
              name="active"
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
