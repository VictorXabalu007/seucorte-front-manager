import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Scissors, Save, X, Check, PlusCircle } from "lucide-react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Service, ServiceCategory, ServiceFormData } from "../types"

const serviceSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  duration: z.string().min(1, "Duração é obrigatória"),
  price: z.string().min(1, "Preço é obrigatório"),
  category: z.enum(["Cabelo", "Barba", "Combo", "Tratamento", "Outros"]),
  isActive: z.boolean(),
  barberIds: z.array(z.string()),
})

interface ServiceSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  service: Service | null
  categories: ServiceCategory[]
  barbers: any[] // Pass barbers list
  onSave: (data: ServiceFormData) => void
}

export function ServiceSheet({
  isOpen,
  onOpenChange,
  service,
  categories,
  barbers,
  onSave
}: ServiceSheetProps) {
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      duration: "30",
      price: "",
      category: "Outros",
      isActive: true,
      barberIds: [],
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (service) {
        form.reset({
          name: service.name || "",
          description: service.description || "",
          duration: (service.duration ?? 30).toString(),
          price: (service.price ?? 0).toString(),
          category: service.category || "Outros",
          isActive: service.isActive ?? true,
          barberIds: service.barberIds || [],
        })
      } else {
        form.reset({
          name: "",
          description: "",
          duration: "30",
          price: "",
          category: "Outros",
          isActive: true,
          barberIds: [],
        })
      }
    }
  }, [service, isOpen, form])

  const onSubmit = (data: ServiceFormData) => {
    onSave(data)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md rounded-l-2xl border-l border-border bg-card/95 backdrop-blur-md p-0 overflow-y-auto invisible-scrollbar">
        <SheetHeader className="p-8 pb-4">
          <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Plus className="size-6 text-primary" />
            </div>
            {service ? "Editar Serviço" : "Novo Serviço"}
          </SheetTitle>
          <div className="sr-only">
            <p>Formulário para {service ? "edição" : "criação"} de serviço e atribuição de barbeiros.</p>
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
                      Nome do Serviço
                    </label>
                    <FormControl>
                      <Input
                        placeholder="Ex: Corte Moderno"
                        {...field}
                        className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Preço (R$)
                      </label>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0,00"
                          {...field}
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
                          placeholder="30"
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
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Categoria
                    </label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-popover border-border/50 rounded-xl">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                        placeholder="Descreva o que está incluso no serviço..."
                        className="bg-card/40 border-border/50 rounded-2xl min-h-[100px] resize-none focus-visible:ring-primary/20 focus-visible:border-primary font-medium p-4"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-4 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Barbeiros que realizam este serviço
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="barberIds"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-2 gap-2">
                        {barbers?.map((barber) => {
                          const isSelected = field.value?.includes(barber.id)
                          return (
                            <button
                              key={barber.id}
                              type="button"
                              onClick={() => {
                                const current = field.value || []
                                if (isSelected) {
                                  field.onChange(current.filter(id => id !== barber.id))
                                } else {
                                  field.onChange([...current, barber.id])
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
                                {barber.name?.charAt(0) || "B"}
                              </div>
                              <div className="min-w-0">
                                <p className="text-[10px] font-black uppercase tracking-tight truncate">{barber.name || "Sem Nome"}</p>
                                <p className={cn("text-[9px] font-bold opacity-70", isSelected ? "text-primary/70" : "text-muted-foreground")}>
                                  {barber.specialty || "Barbeiro"}
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
              </div>
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
                {service ? (
                  <>
                    <Save className="size-4" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" />
                    Cadastrar Serviço
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
