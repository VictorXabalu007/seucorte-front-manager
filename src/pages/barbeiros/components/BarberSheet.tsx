import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, User, Save, Phone, Mail, Award, Palette, DollarSign, PlusCircle, Scissors, Check } from "lucide-react"
import { cn } from "@/lib/utils"

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
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Barber, BarberFormData } from "../types"

const barberSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  bio: z.string().optional(),
  color: z.string().min(4, "Selecione uma cor"),
  commissionType: z.enum(["PERCENTAGE", "FIXED"]),
  commissionValue: z.string().min(1, "Valor da comissão é obrigatório"),
  cutPrice: z.string().min(1, "Valor do corte é obrigatório"),
  isActive: z.boolean(),
  serviceIds: z.array(z.string()),
}).superRefine((data, ctx) => {
  if (data.commissionType === "FIXED") {
    const commission = parseFloat(data.commissionValue)
    const price = parseFloat(data.cutPrice)
    
    if (commission > price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A comissão fixa não pode ser maior que o valor do corte",
        path: ["commissionValue"],
      })
    }
  }
})

interface BarberSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  barber: Barber | null
  services: any[] // Pass services list
  onSave: (data: BarberFormData) => void
}

const PRESET_COLORS = [
  "#baf91a", "#876dff", "#ff6b6b", "#4ecdc4", "#ffe66d"
]

export function BarberSheet({
  isOpen,
  onOpenChange,
  barber,
  services,
  onSave
}: BarberSheetProps) {
  const form = useForm<BarberFormData>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      bio: "",
      color: "#baf91a",
      commissionType: "PERCENTAGE",
      commissionValue: "30",
      cutPrice: "0",
      isActive: true,
      serviceIds: [],
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (barber) {
        form.reset({
          name: barber.name,
          email: barber.email,
          phone: barber.phone || "",
          specialty: barber.specialty || "",
          bio: barber.bio || "",
          color: barber.color,
          commissionType: barber.commissionType,
          commissionValue: barber.commissionValue.toString(),
          cutPrice: (barber.cutPrice || 0).toString(),
          isActive: barber.isActive,
          serviceIds: barber.serviceIds || [],
        })
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          specialty: "",
          bio: "",
          color: "#baf91a",
          commissionType: "PERCENTAGE",
          commissionValue: "30",
          cutPrice: "0",
          isActive: true,
          serviceIds: [],
        })
      }
    }
  }, [barber, isOpen, form])

  const onSubmit = (data: BarberFormData) => {
    onSave(data)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-md overflow-y-auto rounded-l-2xl">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              {barber ? <User className="size-6" /> : <Plus className="size-6" />}
            </div>
            {barber ? "Editar Barbeiro" : "Novo Barbeiro"}
          </SheetTitle>
          <div className="sr-only">
             <p>Formulário para {barber ? "edição" : "criação"} de barbeiro e atribuição de serviços.</p>
          </div>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Informações Básicas</p>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <User className="size-3 text-primary" /> Nome Completo
                    </label>
                    <FormControl>
                      <Input
                        placeholder="Ex: João Silva"
                        {...field}
                        className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Mail className="size-3 text-primary" /> Email
                      </label>
                      <FormControl>
                        <Input
                          placeholder="barbeiro@exemplo.com"
                          {...field}
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Phone className="size-3 text-primary" /> Telefone
                      </label>
                      <FormControl>
                        <Input
                          placeholder="(00) 00000-0000"
                          {...field}
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="specialty"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <Award className="size-3 text-primary" /> Especialidade
                    </label>
                    <FormControl>
                      <Input
                        placeholder="Ex: Degradê e Barba"
                        {...field}
                        className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cutPrice"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Scissors className="size-3 text-primary" /> Valor do Corte
                      </label>
                      <FormControl>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 pl-8 font-medium"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Palette className="size-3 text-primary" /> Cor no Calendário
                      </label>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`size-6 rounded-full border-2 transition-all ${field.value === color ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent hover:scale-105"}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-bold text-muted-foreground ml-1">
                      Descrição/Bio
                    </label>
                    <FormControl>
                      <Textarea
                        placeholder="Conte um pouco sobre a experiência..."
                        {...field}
                        className="bg-background/50 border-border rounded-xl focus:ring-primary/20 font-medium min-h-[80px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Serviços Prestados</p>
                <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-wider">
                  {form.watch("serviceIds")?.length || 0} SELECIONADOS
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="serviceIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-2">
                       {services?.map((service) => {
                         const isSelected = field.value?.includes(service?.id)
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
                               "flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group text-left",
                               isSelected 
                                ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5" 
                                : "bg-background/30 border-border/50 text-muted-foreground hover:border-primary/50"
                             )}
                           >
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "size-8 rounded-lg flex items-center justify-center transition-colors",
                                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                                )}>
                                  <Scissors className="size-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-black uppercase tracking-tighter">{service?.name || "Sem Nome"}</p>
                                  <p className={cn("text-[10px] font-bold opacity-80", isSelected ? "text-primary/70" : "text-muted-foreground")}>
                                    {service?.category || "Outros"} • {service?.duration || 0} min
                                  </p>
                                </div>
                              </div>
                              <div className={cn(
                                "size-5 rounded-full border flex items-center justify-center transition-all",
                                isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border text-transparent"
                              )}>
                                <Check className="size-3" />
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

            <div className="space-y-4 pt-4 border-t border-border/50">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Regras de Comissão</p>
              
              <FormField
                control={form.control}
                name="commissionType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-3"
                      >
                         <div key="PERCENTAGE" className="flex items-center space-x-2 p-3 rounded-xl bg-background/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                           <RadioGroupItem value="PERCENTAGE" id="percentage" />
                           <label htmlFor="percentage" className="font-bold text-xs cursor-pointer flex-1">
                             Porcentagem (%)
                           </label>
                         </div>
                         <div key="FIXED" className="flex items-center space-x-2 p-3 rounded-xl bg-background/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                           <RadioGroupItem value="FIXED" id="fixed" />
                           <label htmlFor="fixed" className="font-bold text-xs cursor-pointer flex-1">
                             Valor Fixo (R$)
                           </label>
                         </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commissionValue"
                render={({ field }) => {
                  const cutPrice = parseFloat(form.watch("cutPrice") || "0")
                  const isFixed = form.watch("commissionType") === "FIXED"
                  const isDisabled = isFixed && cutPrice <= 0

                  return (
                    <FormItem>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      {isFixed ? "Valor Fixo (R$)" : "Porcentagem (%)"}
                    </label>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">
                              {isFixed ? "R$" : "%"}
                            </div>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              disabled={isDisabled}
                              className={`bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 pl-10 font-black text-lg ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            />
                          </div>
                          {isDisabled && (
                            <p className="text-[10px] text-amber-500 font-bold bg-amber-500/10 p-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                              Defina o valor do corte acima para habilitar a comissão fixa.
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>

            <SheetFooter className="mt-8 flex gap-3 sm:flex-row flex-col pt-6 border-t border-border/50">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1 border-border text-muted-foreground hover:bg-muted rounded-xl h-11 font-bold">
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 shadow-lg shadow-primary/20 flex items-center gap-2">
                {barber ? (
                  <>
                    <Save className="size-4" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" />
                    Cadastrar Barbeiro
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
