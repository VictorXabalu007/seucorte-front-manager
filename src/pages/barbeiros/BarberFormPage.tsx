import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  ArrowLeft, Save, User, Phone, Mail, Award, Palette, 
  DollarSign, Scissors, Check, CalendarDays, Plus, Trash2,
  Clock, Package
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Input } from "@/components/ui/input"
import { MoneyInput } from "@/components/ui/money-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker } from "@/components/ui/time-picker"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useLoading } from "@/components/loading-provider"
import { getActiveUnidadeId } from "@/lib/auth"

import { barbersService } from "./services/barbers.service"
import { servicesService } from "../servicos/services/services.service"
import type { Barber } from "./types"
import type { Service } from "../servicos/types"

// Enum blocks
const BlockTypeOptions = [
  { value: "DAY_OFF", label: "Folga" },
  { value: "VACATION", label: "Férias" },
  { value: "BLOCK", label: "Bloqueio" },
]

const DAYS_OF_WEEK = [
  { id: 1, name: "Segunda-feira" },
  { id: 2, name: "Terça-feira" },
  { id: 3, name: "Quarta-feira" },
  { id: 4, name: "Quinta-feira" },
  { id: 5, name: "Sexta-feira" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
]

const PRESET_COLORS = [
  "#baf91a", "#876dff", "#ff6b6b", "#4ecdc4", "#ffe66d", "#10B981", "#F59E0B"
]

const barberSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  specialty: z.string().optional(),
  bio: z.string().optional(),
  color: z.string().min(4, "Selecione uma cor"),
  commissionType: z.enum(["PERCENTAGE", "FIXED"]),
  commissionValue: z.number().min(0, "Valor da comissão é obrigatório"),
  productCommissionType: z.enum(["PERCENTAGE", "FIXED"]),
  productCommissionValue: z.number().min(0, "Valor da comissão é obrigatório"),
  isActive: z.boolean(),
  serviceIds: z.array(z.string()),
  
  schedules: z.array(z.object({
    dayOfWeek: z.number(),
    isWorking: z.boolean(),
    startTime1: z.string().optional(),
    endTime1: z.string().optional(),
    startTime2: z.string().optional(),
    endTime2: z.string().optional(),
  })),

  blocks: z.array(z.object({
    date: z.string().min(10, "Data é obrigatória"),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    type: z.enum(["VACATION", "DAY_OFF", "BLOCK"]),
    reason: z.string().optional(),
  }))
})

type BarberFormValues = z.infer<typeof barberSchema>

export default function BarberFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setIsLoading } = useLoading()
  const isEditing = !!id

  const [services, setServices] = useState<Service[]>([])

  const form = useForm<BarberFormValues>({
    resolver: zodResolver(barberSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      specialty: "",
      bio: "",
      color: "#baf91a",
      commissionType: "PERCENTAGE",
      commissionValue: 30,
      productCommissionType: "PERCENTAGE",
      productCommissionValue: 10,
      isActive: true,
      serviceIds: [],
      schedules: DAYS_OF_WEEK.map(day => ({
        dayOfWeek: day.id,
        isWorking: day.id !== 0, // Domingo folga por padrão
        startTime1: "08:00",
        endTime1: "12:00",
        startTime2: "13:00",
        endTime2: "18:00",
      })),
      blocks: [],
    },
  })

  const { fields: scheduleFields } = useFieldArray({
    control: form.control,
    name: "schedules",
  })

  const { fields: blockFields, append: appendBlock, remove: removeBlock } = useFieldArray({
    control: form.control,
    name: "blocks",
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        const servicesData = await servicesService.getServices()
        setServices(servicesData)

        if (isEditing) {
          const barber = await barbersService.getBarberById(id)
          
          if (barber) {
            form.reset({
              name: barber.name,
              email: barber.email,
              phone: barber.phone || "",
              specialty: barber.specialty || "",
              bio: barber.bio || "",
              color: barber.color || "#baf91a",
              commissionType: barber.commissionType || "PERCENTAGE",
              commissionValue: typeof barber.commissionValue === "number" ? barber.commissionValue : parseFloat(barber.commissionValue as any) || 30,
              productCommissionType: (barber as any).productCommissionType || "PERCENTAGE",
              productCommissionValue: typeof (barber as any).productCommissionValue === "number" ? (barber as any).productCommissionValue : parseFloat((barber as any).productCommissionValue as any) || 10,
              isActive: barber.isActive !== false,
              serviceIds: barber.serviceIds || [],
              schedules: barber.schedules?.length > 0 ? barber.schedules : form.getValues().schedules,
              blocks: barber.blocks || [],
            })
          } else {
            toast.error("Barbeiro não encontrado")
            navigate("/barbeiros")
          }
        }
      } catch (error) {
        toast.error("Erro ao carregar dados")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [id, isEditing, navigate, form, setIsLoading])

  const onSubmit = async (data: BarberFormValues) => {
    try {
      setIsLoading(true)
      const payload = {
        ...data,
        commissionValue: data.commissionValue,
        unidadeId: getActiveUnidadeId(),
      }

      if (isEditing) {
        await barbersService.updateBarber(id, payload as any)
        toast.success("Barbeiro atualizado com sucesso!")
      } else {
        await barbersService.createBarber(payload as any)
        toast.success("Barbeiro cadastrado com sucesso!")
      }
      
      navigate("/barbeiros")
    } catch (error) {
      toast.error("Erro ao salvar barbeiro")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/barbeiros")}
            className="rounded-xl"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              {isEditing ? "Editar Barbeiro" : "Novo Barbeiro"}
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Configure o perfil, horários de trabalho e regras de comissão.
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Bloco 1: Informações Básicas */}
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <User className="size-5" />
                </div>
                <h2 className="text-xl font-bold">Informações Básicas</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <label className="text-xs font-bold text-muted-foreground">Nome Completo</label>
                      <FormControl>
                        <Input placeholder="Ex: João Silva" {...field} className="h-12 rounded-xl bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Mail className="size-3" /> Email
                      </label>
                      <FormControl>
                        <Input placeholder="barbeiro@exemplo.com" {...field} className="h-12 rounded-xl bg-background/50" />
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
                        <Phone className="size-3" /> Telefone
                      </label>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} className="h-12 rounded-xl bg-background/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Award className="size-3" /> Especialidade
                      </label>
                      <FormControl>
                        <Input placeholder="Ex: Degradê e Barba" {...field} className="h-12 rounded-xl bg-background/50" />
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
                        <Palette className="size-3" /> Cor no Calendário
                      </label>
                      <div className="flex flex-wrap gap-2 pt-1 h-12 items-center">
                        {PRESET_COLORS.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`size-8 rounded-full border-2 transition-all ${field.value === color ? "border-primary scale-110 shadow-lg shadow-primary/20" : "border-transparent hover:scale-105"}`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <label className="text-xs font-bold text-muted-foreground">Descrição/Bio</label>
                      <FormControl>
                        <Textarea 
                          placeholder="Conte um pouco sobre a experiência..." 
                          {...field} 
                          className="min-h-[100px] resize-none rounded-xl bg-background/50" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Bloco 2: Horários Regular */}
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Horário de Trabalho</h2>
                  <p className="text-xs text-muted-foreground">Configure os horários fixos de atendimento na semana</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Header Grid */}
                <div className="hidden md:grid gap-4 grid-cols-12 px-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-3">Dia da Semana</div>
                  <div className="col-span-4 text-center">Manhã (Início - Fim)</div>
                  <div className="col-span-4 text-center">Tarde (Início - Fim)</div>
                  <div className="col-span-1 text-center">Ativo</div>
                </div>

                {scheduleFields.map((field, index) => {
                  const dayName = DAYS_OF_WEEK.find(d => d.id === field.dayOfWeek)?.name
                  const isWorkingPath = `schedules.${index}.isWorking` as const
                  const isWorking = form.watch(isWorkingPath)

                  return (
                    <div key={field.id} className={cn(
                      "grid gap-4 md:grid-cols-12 items-center p-4 rounded-2xl border transition-all",
                      isWorking ? "bg-background/40 border-border" : "bg-muted/10 border-transparent opacity-60"
                    )}>
                      {/* Mobile Header */}
                      <div className="flex items-center justify-between md:hidden mb-2">
                        <span className="font-bold text-sm">{dayName}</span>
                        <FormField
                          control={form.control}
                          name={isWorkingPath}
                          render={({ field: checkboxField }) => (
                            <div className="flex items-center space-x-2">
                              <Checkbox 
                                id={`mobile-work-${index}`} 
                                checked={checkboxField.value}
                                onCheckedChange={checkboxField.onChange}
                              />
                              <label htmlFor={`mobile-work-${index}`} className="text-sm font-medium">Trabalha?</label>
                            </div>
                          )}
                        />
                      </div>

                      <div className="hidden md:flex col-span-3 font-bold text-sm items-center">
                        {dayName}
                      </div>

                      {/* Manhã */}
                      <div className="col-span-12 md:col-span-4 flex items-center gap-2">
                        <span className="text-xs font-bold text-muted-foreground md:hidden w-14">Manhã</span>
                        <FormField
                          control={form.control}
                          name={`schedules.${index}.startTime1`}
                          render={({ field: timeField }) => (
                            <TimePicker disabled={!isWorking} value={timeField.value} onChange={timeField.onChange} className="bg-background" />
                          )}
                        />
                        <span className="text-muted-foreground">até</span>
                        <FormField
                          control={form.control}
                          name={`schedules.${index}.endTime1`}
                          render={({ field: timeField }) => (
                            <TimePicker disabled={!isWorking} value={timeField.value} onChange={timeField.onChange} className="bg-background" />
                          )}
                        />
                      </div>

                      {/* Tarde */}
                      <div className="col-span-12 md:col-span-4 flex items-center gap-2 mt-2 md:mt-0">
                        <span className="text-xs font-bold text-muted-foreground md:hidden w-14">Tarde</span>
                        <FormField
                          control={form.control}
                          name={`schedules.${index}.startTime2`}
                          render={({ field: timeField }) => (
                            <TimePicker disabled={!isWorking} value={timeField.value} onChange={timeField.onChange} className="bg-background" />
                          )}
                        />
                        <span className="text-muted-foreground">até</span>
                        <FormField
                          control={form.control}
                          name={`schedules.${index}.endTime2`}
                          render={({ field: timeField }) => (
                            <TimePicker disabled={!isWorking} value={timeField.value} onChange={timeField.onChange} className="bg-background" />
                          )}
                        />
                      </div>

                      <div className="hidden md:flex col-span-1 justify-center">
                         <FormField
                          control={form.control}
                          name={isWorkingPath}
                          render={({ field: checkboxField }) => (
                            <Checkbox 
                              checked={checkboxField.value}
                              onCheckedChange={checkboxField.onChange}
                              className="size-5 rounded"
                            />
                          )}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bloco 3: Exceções, Férias e Folgas */}
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <CalendarDays className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Férias e Folgas Extras</h2>
                    <p className="text-xs text-muted-foreground">Adicione dias específicos que o barbeiro não irá trabalhar ou terá horário reduzido</p>
                  </div>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => appendBlock({ date: new Date().toISOString().split('T')[0], type: "DAY_OFF", startTime: "", endTime: "", reason: "" })}
                  className="rounded-xl gap-2 font-bold"
                >
                  <Plus className="size-4" /> Adicionar
                </Button>
              </div>

              {blockFields.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border/50 rounded-2xl bg-background/20">
                  <p className="text-sm text-muted-foreground font-medium">Nenhum bloqueio ou folga configurado.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {blockFields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 rounded-2xl border bg-background/40 relative group">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => removeBlock(index)}
                        className="absolute -right-2 -top-2 size-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="size-4" />
                      </Button>

                      <FormField control={form.control} name={`blocks.${index}.type` as const} render={({ field: tField }) => (
                        <FormItem className="md:col-span-3">
                          <label className="text-xs font-bold text-muted-foreground">Tipo</label>
                          <Select onValueChange={tField.onChange} defaultValue={tField.value}>
                            <FormControl>
                              <SelectTrigger className="h-10 rounded-xl bg-background border-input">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl">
                              {BlockTypeOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value} className="rounded-lg">
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />

                      <FormField control={form.control} name={`blocks.${index}.date` as const} render={({ field: dField }) => (
                        <FormItem className="md:col-span-3">
                          <label className="text-xs font-bold text-muted-foreground">Data</label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  type="button"
                                  variant={"outline"}
                                  className={cn(
                                    "w-full h-10 rounded-xl pl-3 text-left font-normal bg-background border-input",
                                    !dField.value && "text-muted-foreground"
                                  )}
                                >
                                  {dField.value ? (
                                    format(new Date(`${dField.value}T12:00:00`), "dd/MM/yyyy", { locale: ptBR })
                                  ) : (
                                    <span>Selecione uma data</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0 rounded-xl" align="start">
                              <Calendar
                                mode="single"
                                selected={dField.value ? new Date(`${dField.value}T12:00:00`) : undefined}
                                onSelect={(date) => {
                                  if (date) {
                                    dField.onChange(format(date, "yyyy-MM-dd"))
                                  } else {
                                    dField.onChange("")
                                  }
                                }}
                                disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )} />

                      {/* Optional times for partial blocks */}
                      <div className="md:col-span-3 flex items-center gap-2">
                        <FormField control={form.control} name={`blocks.${index}.startTime` as const} render={({ field: sField }) => (
                          <FormItem className="flex-1">
                            <label className="text-xs font-bold text-muted-foreground">Início (Opcional)</label>
                            <TimePicker value={sField.value} onChange={sField.onChange} className="bg-background" />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name={`blocks.${index}.endTime` as const} render={({ field: eField }) => (
                          <FormItem className="flex-1">
                            <label className="text-xs font-bold text-muted-foreground">Fim (Opcional)</label>
                            <TimePicker value={eField.value} onChange={eField.onChange} className="bg-background" />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bloco 4: Serviços */}
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Scissors className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Serviços Prestados</h2>
                    <p className="text-xs text-muted-foreground">Selecione os serviços que este profissional realiza.</p>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-wider">
                  {form.watch("serviceIds")?.length || 0} SELECIONADOS
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="serviceIds"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                               "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group text-left",
                               isSelected 
                                ? "bg-primary/10 border-primary text-foreground shadow-sm shadow-primary/5" 
                                : "bg-background/50 border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-background"
                             )}
                           >
                              <div className="flex items-center gap-3">
                                <div>
                                  <p className={cn("text-sm font-black uppercase tracking-tighter", isSelected ? "text-primary" : "")}>{service?.name || "Sem Nome"}</p>
                                  <p className={cn("text-[10px] font-bold opacity-80", isSelected ? "text-primary/70" : "text-muted-foreground")}>
                                    {service?.category || "Outros"} • {service?.duration || 0} min
                                  </p>
                                </div>
                              </div>
                              <div className={cn(
                                "size-6 rounded-full border-2 flex items-center justify-center transition-all",
                                isSelected ? "bg-primary border-primary text-primary-foreground" : "border-border/50 text-transparent"
                              )}>
                                <Check className="size-4" />
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

            {/* Bloco 5: Comissões */}
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
               <div className="flex items-center gap-3 mb-6">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <DollarSign className="size-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Regras de Comissão</h2>
                  <p className="text-xs text-muted-foreground">Defina como o profissional será pago por serviços e produtos.</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Comissão sobre Serviços */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Scissors className="size-4 text-primary" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Serviços</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="commissionType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                          >
                             <div className={cn("flex items-center space-x-2 p-3 rounded-xl border transition-colors cursor-pointer", field.value === 'PERCENTAGE' ? "bg-primary/10 border-primary" : "bg-background/50 border-border/50")}>
                               <RadioGroupItem value="PERCENTAGE" id="srv-percentage" />
                               <label htmlFor="srv-percentage" className="font-bold text-xs cursor-pointer flex-1">
                                 Porcentagem (%)
                               </label>
                             </div>
                             <div className={cn("flex items-center space-x-2 p-3 rounded-xl border transition-colors cursor-pointer", field.value === 'FIXED' ? "bg-primary/10 border-primary" : "bg-background/50 border-border/50")}>
                               <RadioGroupItem value="FIXED" id="srv-fixed" />
                               <label htmlFor="srv-fixed" className="font-bold text-xs cursor-pointer flex-1">
                                 Valor Fixo (R$)
                               </label>
                             </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="commissionValue"
                    render={({ field }) => {
                      const isFixed = form.watch("commissionType") === "FIXED"
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">
                                {isFixed ? "R$" : "%"}
                              </div>
                              {isFixed ? (
                                <MoneyInput
                                  value={field.value || 0}
                                  onChange={field.onChange}
                                  className="h-11 rounded-xl bg-background/50 pl-10 text-lg font-black border-border shadow-none"
                                />
                              ) : (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="h-11 rounded-xl bg-background/50 pl-10 text-lg font-black border-border shadow-none"
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>

                {/* Comissão sobre Produtos */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="size-4 text-emerald-500" />
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Produtos</h3>
                  </div>
                  <FormField
                    control={form.control}
                    name="productCommissionType"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                          >
                             <div className={cn("flex items-center space-x-2 p-3 rounded-xl border transition-colors cursor-pointer", field.value === 'PERCENTAGE' ? "bg-emerald-500/10 border-emerald-500/50" : "bg-background/50 border-border/50")}>
                               <RadioGroupItem value="PERCENTAGE" id="prod-percentage" />
                               <label htmlFor="prod-percentage" className="font-bold text-xs cursor-pointer flex-1">
                                 Porcentagem (%)
                               </label>
                             </div>
                             <div className={cn("flex items-center space-x-2 p-3 rounded-xl border transition-colors cursor-pointer", field.value === 'FIXED' ? "bg-emerald-500/10 border-emerald-500/50" : "bg-background/50 border-border/50")}>
                               <RadioGroupItem value="FIXED" id="prod-fixed" />
                               <label htmlFor="prod-fixed" className="font-bold text-xs cursor-pointer flex-1">
                                 Valor Fixo (R$)
                               </label>
                             </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="productCommissionValue"
                    render={({ field }) => {
                      const isFixed = form.watch("productCommissionType") === "FIXED"
                      return (
                        <FormItem>
                          <FormControl>
                            <div className="relative">
                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">
                                {isFixed ? "R$" : "%"}
                              </div>
                              {isFixed ? (
                                <MoneyInput
                                  value={field.value || 0}
                                  onChange={field.onChange}
                                  className="h-11 rounded-xl bg-background/50 pl-10 text-lg font-black border-border shadow-none"
                                />
                              ) : (
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) => field.onChange(Number(e.target.value))}
                                  className="h-11 rounded-xl bg-background/50 pl-10 text-lg font-black border-border shadow-none"
                                />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center justify-between pt-4">
               <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-2xl bg-card border">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="size-5 rounded"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <label className="text-sm font-bold cursor-pointer">
                          Profissional Ativo
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Desmarque para ocultar da agenda temporariamente.
                        </p>
                      </div>
                    </FormItem>
                  )}
                />

              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/barbeiros")}
                  className="rounded-xl h-12 px-6 font-bold"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 px-8 shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <Save className="size-5" />
                  {isEditing ? "Salvar Alterações" : "Cadastrar Profissional"}
                </Button>
              </div>
            </div>
            
          </form>
        </Form>
      </div>
    </AdminLayout>
  )
}
