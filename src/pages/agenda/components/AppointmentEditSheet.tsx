import { useEffect } from "react"
import { Edit2, CalendarIcon, User, Phone, Clock, Scissors, DollarSign } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose,
} from "@/components/ui/sheet"
import {
  Form, FormControl, FormField, FormItem, FormMessage,
} from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"

import { appointmentFormSchema, type AppointmentFormValues } from "../schema"
import type { Appointment, Professional, Service } from "../types"
import { TIME_SLOTS } from "../data/mockData"
import { cn } from "@/lib/utils"

interface AppointmentEditSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  onSave: (data: AppointmentFormValues) => void
  professionals: Professional[]
  services: Service[]
}

export function AppointmentEditSheet({
  isOpen, onOpenChange, appointment, onSave, professionals, services,
}: AppointmentEditSheetProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      clientName: "", clientPhone: "",
      professionalId: "", serviceId: "",
      dateObj: new Date(),
      startTime: "09:00", endTime: "09:30",
      paymentStatus: "PENDING", status: "SCHEDULED",
      amount: 0, notes: "",
    },
  })

  useEffect(() => {
    if (isOpen && appointment) {
      form.reset({
        clientName: appointment.clientName,
        clientPhone: appointment.clientPhone || "",
        professionalId: appointment.professionalId,
        serviceId: appointment.serviceId,
        dateObj: new Date(appointment.rawDate),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        paymentStatus: appointment.paymentStatus,
        status: appointment.status,
        amount: appointment.amount,
        notes: appointment.notes || "",
      })
    }
  }, [isOpen, appointment, form])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-md overflow-y-auto rounded-l-2xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-primary" />
            Editar Agendamento
          </SheetTitle>
          <p className="text-sm text-muted-foreground text-left">
            {appointment?.clientName} • {appointment?.date} • {appointment?.startTime}
          </p>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-5 py-2">
            {/* Cliente */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Cliente</p>
              <FormField control={form.control} name="clientName" render={({ field }) => (
                <FormItem>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5"><User className="size-3 text-primary" /> Nome</Label>
                  <FormControl>
                    <Input placeholder="Nome completo" className="bg-background/50 border-border rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="clientPhone" render={({ field }) => (
                <FormItem>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5"><Phone className="size-3 text-primary" /> WhatsApp</Label>
                  <FormControl>
                    <Input placeholder="(11) 99999-0000" className="bg-background/50 border-border rounded-xl" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Serviço */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Serviço</p>
              <FormField control={form.control} name="professionalId" render={({ field }) => (
                <FormItem>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Barbeiro</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50 border-border rounded-xl h-9">
                        <SelectValue placeholder="Selecione o barbeiro" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border bg-card">
                      {professionals.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="serviceId" render={({ field }) => (
                <FormItem>
                  <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5"><Scissors className="size-3 text-primary" /> Serviço</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-background/50 border-border rounded-xl h-9">
                        <SelectValue placeholder="Selecione o serviço" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded-xl border-border bg-card">
                      {services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.duration}min)</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            {/* Data e Hora */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data & Hora</p>
              <FormField control={form.control} name="dateObj" render={({ field }) => (
                <FormItem className="flex flex-col">
                  <Label className="text-xs text-slate-400 mb-1.5 block">Data</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal bg-background/50 border-border rounded-xl h-9", !field.value && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                          {field.value ? format(field.value, "PPP", { locale: ptBR }) : <span>Selecione a data</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-border rounded-xl" align="start">
                      <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={ptBR} />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )} />
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="startTime" render={({ field }) => (
                  <FormItem>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5"><Clock className="size-3 text-primary" /> Início</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="bg-background/50 border-border rounded-xl h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-xl border-border bg-card max-h-48">
                        {TIME_SLOTS.map(t => <SelectItem key={`s-${t}`} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="endTime" render={({ field }) => (
                  <FormItem>
                    <Label className="text-xs text-slate-400 mb-1.5 block">Término</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="bg-background/50 border-border rounded-xl h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-xl border-border bg-card max-h-48">
                        {TIME_SLOTS.map(t => <SelectItem key={`e-${t}`} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            {/* Pagamento */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pagamento</p>
              <div className="grid grid-cols-2 gap-3">
                <FormField control={form.control} name="paymentStatus" render={({ field }) => (
                  <FormItem>
                    <Label className="text-xs text-slate-400 mb-1.5 block">Status</Label>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl><SelectTrigger className="bg-background/50 border-border rounded-xl h-9"><SelectValue /></SelectTrigger></FormControl>
                      <SelectContent className="rounded-xl border-border bg-card">
                        <SelectItem value="PENDING">Pendente</SelectItem>
                        <SelectItem value="PAID">Pago</SelectItem>
                        <SelectItem value="REFUNDED">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="amount" render={({ field }) => (
                  <FormItem>
                    <Label className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5"><DollarSign className="size-3 text-primary" /> Valor</Label>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0,00" className="bg-background/50 border-border rounded-xl h-9" value={field.value} onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <FormField control={form.control} name="status" render={({ field }) => (
                <FormItem>
                  <Label className="text-xs text-muted-foreground mb-1.5 block">Status do Agendamento</Label>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger className="bg-background/50 border-border rounded-xl h-9"><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent className="rounded-xl border-border bg-card">
                      <SelectItem value="SCHEDULED">Agendado</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmado</SelectItem>
                      <SelectItem value="COMPLETED">Concluído</SelectItem>
                      <SelectItem value="CANCELLED">Cancelado</SelectItem>
                      <SelectItem value="NO_SHOW">Não Compareceu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>

            <SheetFooter className="mt-6 flex gap-3 sm:flex-row flex-col">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1 border-border text-muted-foreground hover:bg-muted rounded-xl">
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl shadow-lg shadow-primary/20">
                Salvar Alterações
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
