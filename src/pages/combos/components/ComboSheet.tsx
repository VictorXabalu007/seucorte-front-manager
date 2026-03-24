import { useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Save, PackageOpen, Check, Scissors } from "lucide-react"
import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MoneyInput } from "@/components/ui/money-input"
import type { Service } from "../../servicos/types"
import type { ComboFormData, ComboSheetProps } from "../types"

const comboSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  duration: z.string().min(1, "Duração é obrigatória"),
  price: z.number().min(0.01, "Preço é obrigatório"),
  isActive: z.boolean(),
  serviceIds: z.array(z.string()).min(1, "Selecione pelo menos um serviço"),
})

export function ComboSheet({
  isOpen,
  onOpenChange,
  combo,
  servicesList,
  onSave
}: ComboSheetProps) {
  const form = useForm<ComboFormData>({
    resolver: zodResolver(comboSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "0",
      price: 0,
      isActive: true,
      serviceIds: [],
    },
  })

  // Calculate suggested price and duration based on selected services
  const selectedServiceIds = form.watch("serviceIds")
  
  const suggestedTotals = useMemo(() => {
    let totalDuration = 0
    let totalPrice = 0
    
    selectedServiceIds.forEach(id => {
      const s = servicesList.find(serv => serv.id === id)
      if (s) {
        totalDuration += Number(s.duration)
        totalPrice += Number(s.price)
      }
    })
    
    return { duration: totalDuration.toString(), price: totalPrice }
  }, [selectedServiceIds, servicesList])

  useEffect(() => {
    if (isOpen) {
      if (combo) {
        form.reset({
          name: combo.name || "",
          description: combo.description || "",
          duration: (combo.duration ?? 0).toString(),
          price: Number(combo.price) || 0,
          isActive: combo.isActive ?? true,
          serviceIds: combo.serviceIds || [],
        })
      } else {
        form.reset({
          name: "",
          description: "",
          duration: "0",
          price: 0,
          isActive: true,
          serviceIds: [],
        })
      }
    }
  }, [combo, isOpen, form])

  const onSubmit = (data: ComboFormData) => {
    onSave(data)
  }

  const handleUseSuggestedTotals = () => {
    form.setValue("duration", suggestedTotals.duration)
    form.setValue("price", suggestedTotals.price)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md rounded-l-2xl border-l border-border bg-card/95 backdrop-blur-md p-0 overflow-y-auto invisible-scrollbar">
        <SheetHeader className="p-8 pb-4">
          <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <PackageOpen className="size-6 text-primary" />
            </div>
            {combo ? "Editar Combo" : "Novo Combo"}
          </SheetTitle>
          <div className="sr-only">
            <p>Formulário para {combo ? "edição" : "criação"} de combo.</p>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 pt-0">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Nome do Combo
                    </label>
                    <FormControl>
                      <Input
                        placeholder="Ex: Barba + Cabelo + Sobrancelha"
                        {...field}
                        className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-2 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Serviços que compõem este combo
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="serviceIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-2">
                        {servicesList?.map((service) => {
                          const isSelected = field.value?.includes(service.id)
                          return (
                            <button
                              key={service.id}
                              type="button"
                              onClick={() => {
                                const current = field.value || []
                                if (isSelected) {
                                  field.onChange(current.filter(id => id !== service.id))
                                } else {
                                  field.onChange([...current, service.id])
                                }
                              }}
                              className={cn(
                                "flex items-center gap-3 p-3 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden",
                                isSelected
                                  ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5"
                                  : "bg-card/40 border-border/50 text-muted-foreground hover:border-primary/50"
                              )}
                            >
                              {isSelected && (
                                <div className="absolute top-2 right-2">
                                  <Check className="size-3 text-primary" />
                                </div>
                              )}
                              <div className={cn(
                                "size-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-colors",
                                isSelected ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                              )}>
                                <Scissors className="size-4" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-tight truncate">{service.name}</p>
                                <p className={cn("text-[9px] font-bold opacity-70", isSelected ? "text-primary/70" : "text-muted-foreground")}>
                                  R$ {Number(service.price).toFixed(2)}
                                </p>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {selectedServiceIds.length > 0 && (
                  <div className="bg-primary/5 rounded-2xl p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-2 border border-primary/20">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-0.5">Sugerido</p>
                      <p className="text-xs font-bold text-muted-foreground">
                        {suggestedTotals.duration} min • R$ {Number(suggestedTotals.price).toFixed(2)}
                      </p>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleUseSuggestedTotals}
                      variant="outline" 
                      size="sm"
                      className="h-8 rounded-xl border-primary/30 text-primary hover:bg-primary/10 font-bold text-xs"
                    >
                      Copiar Valores
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Preço do Combo (R$)
                      </label>
                      <FormControl>
                        <MoneyInput
                          placeholder="R$ 0,00"
                          value={field.value}
                          onChange={field.onChange}
                          className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Duração (min)
                      </label>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="60"
                          {...field}
                          className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Descrição
                    </label>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que está incluso no pacote..."
                        className="bg-card/40 border-border/50 rounded-2xl min-h-[100px] resize-none focus-visible:ring-primary/20 focus-visible:border-primary font-medium p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-8 flex gap-3 sm:flex-row flex-col pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-border text-muted-foreground hover:bg-muted rounded-xl h-11 font-bold w-full"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 w-full"
              >
                {combo ? (
                  <>
                    <Save className="size-4" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <Plus className="size-4 stroke-[3px]" />
                    Criar Combo
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
