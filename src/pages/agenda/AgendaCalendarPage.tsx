import { useState, useMemo, useEffect, useCallback } from "react"
import {
  ChevronLeft, ChevronRight, Plus, List, Clock, User,
  CalendarIcon, RefreshCcw, Scissors, Phone,
} from "lucide-react"
import { toast } from "sonner"
import {
  format, addDays, startOfWeek, addWeeks, subWeeks,
  isSameDay, startOfMonth, endOfMonth, endOfWeek,
  eachDayOfInterval, isSameMonth, addMonths, subMonths, addDays as _addDays
} from "date-fns"
import type { DateRange } from "react-day-picker"
import { ptBR } from "date-fns/locale"
import { useNavigate } from "react-router-dom"
import { useLoading } from "@/components/loading-provider"
import { getActiveUnidadeId } from "@/lib/auth"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { agendaService } from "./services/agenda.service"
import type { Appointment, Professional, Service } from "./types"
import type { AppointmentFormValues } from "./schema"
import { AppointmentCreateSheet } from "./components/AppointmentCreateSheet"
import { AppointmentEditSheet } from "./components/AppointmentEditSheet"
import { AppointmentDeleteAlert } from "./components/AppointmentDeleteAlert"
import { AppointmentStatusBadge } from "./components/AppointmentStatusBadge"
import { AppointmentDateFilter } from "./components/AppointmentDateFilter"

const HOURS = Array.from({ length: 17 }, (_, i) => i + 7) // 07:00 to 23:00

const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: "bg-blue-500/20 border-blue-400/30 text-blue-400",
  CONFIRMED: "bg-primary/20 border-primary/30 text-primary",
  COMPLETED: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400",
  CANCELLED: "bg-destructive/20 border-destructive/30 text-destructive-foreground line-through opacity-80",
  NO_SHOW: "bg-orange-500/20 border-orange-400/30 text-orange-400",
}

// Função para obter a cor do barbeiro da lista de profissionais carregada
const getProfessionalColor = (professionals: Professional[], id: string) => {
  const prof = professionals.find(p => p.id === id)
  return prof?.color || "#10B981"
}

export default function AgendaCalendarPage() {
  const navigate = useNavigate()
  const { setIsLoading: setGlobalLoading } = useLoading()
  const unidadeId = getActiveUnidadeId()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("week")
  const [professionalFilter, setProfessionalFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  // Sheets state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createInitialData, setCreateInitialData] = useState<Partial<AppointmentFormValues> | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null)
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!unidadeId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      let start: Date, end: Date
      
      if (viewMode === "day") {
          start = new Date(currentDate); start.setHours(0,0,0,0)
          end = new Date(currentDate); end.setHours(23,59,59,999)
      } else if (viewMode === "week") {
          start = startOfWeek(currentDate, { weekStartsOn: 1 })
          end = endOfWeek(currentDate, { weekStartsOn: 1 })
      } else {
          start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
          end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
      }

      const params = {
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          unidadeId,
      }

      const [apts, profs, svcs] = await Promise.all([
        agendaService.getAppointments(params),
        agendaService.getProfessionals(unidadeId),
        agendaService.getServices(unidadeId),
      ])
      setAppointments(apts)
      setProfessionals(profs)
      setServices(svcs)
    } catch {
      toast.error("Erro ao carregar dados")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }, [unidadeId, currentDate, viewMode, setGlobalLoading])

  useEffect(() => { 
    fetchData() 
  }, [fetchData])

  const weekDays = useMemo(() => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }, [currentDate])

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }, [currentDate])

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a =>
      professionalFilter === "all" || a.professionalId === professionalFilter
    )
  }, [appointments, professionalFilter])

  const handlePrev = () => {
    if (viewMode === "day") setCurrentDate(d => addDays(d, -1))
    else if (viewMode === "week") setCurrentDate(d => subWeeks(d, 1))
    else setCurrentDate(d => subMonths(d, 1))
  }

  const handleNext = () => {
    if (viewMode === "day") setCurrentDate(d => addDays(d, 1))
    else if (viewMode === "week") setCurrentDate(d => addWeeks(d, 1))
    else setCurrentDate(d => addMonths(d, 1))
  }

  // Handle date filter synchronization with calendar view
  useEffect(() => {
    if (dateFilter === "today") {
      setCurrentDate(new Date())
    } else if (dateFilter === "custom" && dateRange?.from) {
      setCurrentDate(dateRange.from)
    }
  }, [dateFilter, dateRange])

  const handleGridClick = (date: Date, hour: number, professionalId?: string) => {
    setCreateInitialData({
      dateObj: date,
      startTime: `${hour.toString().padStart(2, "0")}:00`,
      endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
      professionalId: professionalId || (professionalFilter !== "all" ? professionalFilter : ""),
    })
    setIsCreateOpen(true)
  }

  const handleAppointmentClick = (aptId: string) => {
    setOpenPopoverId(prev => prev === aptId ? null : aptId)
  }

  const handleEditFromPopover = (a: Appointment) => {
    setOpenPopoverId(null)
    setEditingAppointment(a)
    setIsEditOpen(true)
  }

  const handleDeleteFromPopover = (a: Appointment) => {
    setOpenPopoverId(null)
    setDeletingAppointment(a)
    setIsDeleteOpen(true)
  }

  const handleSaveCreate = async (data: AppointmentFormValues) => {
    try {
      const prof = professionals.find(p => p.id === data.professionalId)
      const svc = services.find(s => s.id === data.serviceId)
      await agendaService.createAppointment({
        clientName: data.clientName, clientPhone: data.clientPhone,
        professionalId: data.professionalId, professionalName: prof?.name || "",
        serviceId: data.serviceId, serviceName: svc?.name || "",
        serviceDuration: svc?.duration || 30,
        date: format(data.dateObj, "dd MMM, yyyy", { locale: ptBR }),
        rawDate: data.dateObj,
        startTime: data.startTime, endTime: data.endTime,
        status: data.status, paymentStatus: data.paymentStatus,
        amount: data.amount, notes: data.notes,
        initials: data.clientName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      })
      await fetchData()
      setIsCreateOpen(false)
      toast.success("Agendamento criado!")
    } catch { toast.error("Erro ao criar agendamento") }
  }

  const handleSaveEdit = async (data: AppointmentFormValues) => {
    if (!editingAppointment) return
    try {
      const prof = professionals.find(p => p.id === data.professionalId)
      const svc = services.find(s => s.id === data.serviceId)
      await agendaService.updateAppointment(editingAppointment.id, {
        ...data,
        professionalName: prof?.name || "",
        serviceName: svc?.name || "",
        serviceDuration: svc?.duration || 30,
        date: format(data.dateObj, "dd MMM, yyyy", { locale: ptBR }),
        rawDate: data.dateObj,
        initials: data.clientName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      })
      await fetchData()
      setIsEditOpen(false)
      toast.success("Agendamento atualizado!")
    } catch { toast.error("Erro ao atualizar agendamento") }
  }

  const handleConfirmDelete = async () => {
    if (!deletingAppointment) return
    try {
      await agendaService.deleteAppointment(deletingAppointment.id)
      await fetchData()
      setIsDeleteOpen(false)
      toast.success("Agendamento excluído!")
    } catch { toast.error("Erro ao excluir agendamento") }
  }

  const getAppointmentsForDayAndHour = (day: Date, hour: number) =>
    filteredAppointments.filter(a => {
      if (!isSameDay(new Date(a.rawDate), day)) return false
      const [h] = a.startTime.split(":").map(Number)
      return h === hour
    })

  const getPositionedForDayColumn = (day: Date, proId?: string) => {
    let dayApts = filteredAppointments.filter(a => isSameDay(new Date(a.rawDate), day))
    if (proId) dayApts = dayApts.filter(a => a.professionalId === proId)
    return dayApts.map(a => {
      const [sh, sm] = a.startTime.split(":").map(Number)
      const [eh, em] = a.endTime.split(":").map(Number)
      const top = (sh - 7) * 60 + sm
      const height = Math.max((eh * 60 + em) - (sh * 60 + sm), 20)
      return { ...a, top: `${top}px`, height: `${height}px` }
    })
  }

  const displayedProfessionals = useMemo(() =>
    professionalFilter === "all" ? professionals : professionals.filter(p => p.id === professionalFilter)
  , [professionals, professionalFilter])

  const AppointmentPill = ({ a }: { a: Appointment & { top?: string; height?: string } }) => {
    const barberColor = getProfessionalColor(professionals, a.professionalId)
    const isCancelled = a.status === "CANCELLED"
    
    const pillStyle = {
      zIndex: 5,
      backgroundColor: `${barberColor}15`, // Fundo suave com a cor do barbeiro
      color: barberColor, // Texto com a cor do barbeiro
      borderColor: `${barberColor}40`, // Borda com a cor do barbeiro
      borderLeft: `4px solid ${barberColor}`,
      ...(a.top ? {
        top: a.top,
        height: a.height,
        position: "absolute" as const,
        left: 2,
        right: 2
      } : {})
    }

    return (
      <Popover open={openPopoverId === a.id} onOpenChange={(o) => setOpenPopoverId(o ? a.id : null)}>
        <Tooltip>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAppointmentClick(a.id)
                }}
                className={cn(
                  "w-full rounded-lg border px-1.5 py-0.5 text-left transition-all hover:brightness-110 cursor-pointer overflow-hidden text-[10px] font-bold leading-tight",
                  isCancelled && "line-through opacity-50"
                )}
                style={pillStyle}
              >
                <p className="truncate">{a.clientName}</p>
                {(a.height ? parseInt(a.height) : 0) >= 40 && <p className="truncate opacity-80">{a.serviceName}</p>}
              </button>
            </TooltipTrigger>
          </PopoverTrigger>
          <TooltipContent side="right" className="bg-popover border-border animate-in fade-in zoom-in-95 duration-200 text-white p-0 overflow-hidden rounded-xl shadow-2xl min-w-52 z-[70]">
            <div className="p-3 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-black">{a.initials}</div>
                <div>
                  <p className="font-bold text-sm text-white">{a.clientName}</p>
                  {a.clientPhone && <p className="text-[10px] text-slate-400 flex items-center gap-1"><Phone className="size-2.5" />{a.clientPhone}</p>}
                </div>
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Scissors className="size-3 text-primary" />{a.serviceName} ({a.serviceDuration}min)
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="size-3 text-primary" />{a.startTime} – {a.endTime}
              </div>
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="size-3 text-primary" />{a.professionalName}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <AppointmentStatusBadge status={a.status} />
                <AppointmentStatusBadge status={a.status} payment={a.paymentStatus} />
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
        <PopoverContent side="right" align="start" className="w-64 p-0 bg-card border-border rounded-2xl shadow-2xl overflow-hidden z-[80]">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center font-black text-sm border border-border">{a.initials}</div>
              <div>
                <p className="font-black text-white">{a.clientName}</p>
                {a.clientPhone && <p className="text-[10px] text-slate-400">{a.clientPhone}</p>}
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-400"><span>Serviço</span><span className="text-white font-semibold">{a.serviceName}</span></div>
              <div className="flex justify-between text-slate-400"><span>Barbeiro</span><span className="text-white font-semibold">{a.professionalName}</span></div>
              <div className="flex justify-between text-slate-400"><span>Horário</span><span className="text-white font-semibold">{a.startTime} – {a.endTime}</span></div>
              <div className="flex justify-between text-slate-400"><span>Valor</span><span className="text-emerald-400 font-bold">{a.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span></div>
            </div>
            <div className="flex gap-2 pt-1">
              <AppointmentStatusBadge status={a.status} />
              <AppointmentStatusBadge status={a.status} payment={a.paymentStatus} />
            </div>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button size="sm" onClick={() => handleEditFromPopover(a)} className="flex-1 h-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold">Editar</Button>
              {a.status !== "COMPLETED" && a.status !== "CANCELLED" && (
                <Button size="sm" variant="ghost" onClick={() => handleDeleteFromPopover(a)} className="h-8 rounded-lg text-destructive hover:text-destructive/80 hover:bg-destructive/10 text-xs font-bold px-3">Excluir</Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    )
  }


  return (
    <AdminLayout>
      <TooltipProvider>
        <div className="space-y-4 pb-10">
          {/* Calendar Control Bar */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 bg-card border border-border rounded-2xl p-4 shadow-sm backdrop-blur-sm">
            {/* Navigation */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-background/50 p-1 rounded-xl border border-border/50">
                <Button variant="ghost" size="icon" onClick={handlePrev} className="size-8 rounded-lg text-slate-400 hover:text-white hover:bg-muted">
                  <ChevronLeft className="size-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setCurrentDate(new Date())} className="h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-white">
                  Hoje
                </Button>
                <Button variant="ghost" size="icon" onClick={handleNext} className="size-8 rounded-lg text-slate-400 hover:text-white hover:bg-muted">
                  <ChevronRight className="size-4" />
                </Button>
              </div>

              {/* View mode toggle */}
              <div className="flex bg-background/50 p-1 rounded-xl border border-border/50">
                {(["day", "week", "month"] as const).map(mode => (
                  <button key={mode} onClick={() => setViewMode(mode)}
                    className={cn("h-8 px-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
                      viewMode === mode ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}>
                    {mode === "day" ? "Dia" : mode === "week" ? "Semana" : "Mês"}
                  </button>
                ))}
              </div>

              {/* Date title */}
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-emerald-500" />
                <h2 className="text-lg font-black text-white capitalize">
                  {format(currentDate, viewMode === "day" ? "dd 'de' MMMM 'de' yyyy" : "MMMM yyyy", { locale: ptBR })}
                </h2>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2 flex-wrap">
              <Select value={professionalFilter} onValueChange={setProfessionalFilter}>
                <SelectTrigger className="w-44 h-8 rounded-xl bg-background/50 border-border/50 text-xs font-bold">
                  <SelectValue placeholder="Barbeiro" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card">
                  <SelectItem value="all" className="text-xs font-bold">Todos Barbeiros</SelectItem>
                  {professionals.map(p => <SelectItem key={p.id} value={p.id} className="text-xs font-bold">{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
              <div className="h-6 w-px bg-border" />
              <Button variant="outline" size="sm" onClick={() => navigate("/agenda")} className="h-8 rounded-xl border-border text-slate-400 gap-1.5 text-xs hover:text-white">
                <List className="size-3.5" /> Lista
              </Button>
              <Button size="sm" onClick={() => setIsCreateOpen(true)} className="h-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1.5 text-xs shadow-lg shadow-primary/20">
                <Plus className="size-3.5 stroke-[3px]" /> Novo
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96 bg-card/40 rounded-3xl border border-border/50">
              <RefreshCcw className="size-8 text-emerald-500 animate-spin mb-3" />
              <p className="text-slate-400 font-medium animate-pulse">Sincronizando agenda...</p>
            </div>
          ) : (
            <>
              {/* ───────────────── WEEK VIEW ───────────────── */}
              {viewMode === "week" && (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  {/* Time grid and Sticky Headers */}
                  <div className="overflow-y-auto max-h-[600px] custom-scrollbar relative">
                    {/* Day headers (Sticky) */}
                    <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border bg-card sticky top-0 z-10">
                      <div className="p-3" />
                      {weekDays.map(day => {
                        const isToday = isSameDay(day, new Date())
                        return (
                          <div key={day.toISOString()} className={cn("p-3 text-center border-l border-border", isToday && "bg-primary/5")}>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                              {format(day, "EEE", { locale: ptBR })}
                            </p>
                            <p className={cn("text-lg font-black mt-0.5", isToday ? "text-primary" : "text-foreground/80")}>
                              {format(day, "d")}
                            </p>
                          </div>
                        )
                      })}
                    </div>

                    {/* Hour Background Lines & Day Columns */}
                    <div className="relative" style={{ height: `${HOURS.length * 60}px` }}>
                      {/* Grid Background (Hour lines) */}
                      {HOURS.map((hour, idx) => (
                        <div key={hour} className="absolute w-full flex border-b border-border" style={{ top: `${idx * 60}px`, height: "60px" }}>
                          <div className="w-20 flex items-start justify-end pr-3 pt-1 shrink-0">
                            <span className="text-[10px] text-slate-600 font-bold">{hour.toString().padStart(2, "0")}:00</span>
                          </div>
                        </div>
                      ))}

                      {/* Day Columns */}
                      <div className="grid grid-cols-[80px_repeat(7,1fr)] absolute inset-0">
                        <div /> {/* Gutter for hour labels */}
                        {weekDays.map(day => {
                          const isToday = isSameDay(day, new Date())
                          const colApts = getPositionedForDayColumn(day)
                          return (
                            <div key={day.toISOString()} className={cn("border-l border-border relative h-full", isToday && "bg-emerald-500/1")}>
                              {/* Create triggers (one per hour) */}
                              {HOURS.map((hour, idx) => (
                                <Tooltip key={hour}>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleGridClick(day, hour)}
                                      className="absolute w-full hover:bg-emerald-500/5 transition-colors group z-0"
                                      style={{ top: `${idx * 60}px`, height: "60px" }}
                                    >
                                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30">
                                        <Plus className="size-4 text-emerald-500" />
                                      </span>
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="bg-slate-800 border-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded-lg">
                                    Agendar {hour.toString().padStart(2, "0")}:00 em {format(day, "dd/MM")}
                                  </TooltipContent>
                                </Tooltip>
                              ))}

                              {/* Appointments */}
                              {colApts.map(a => <AppointmentPill key={a.id} a={a} />)}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── DAY VIEW (columns by professional) ───────────────── */}
              {viewMode === "day" && (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-y-auto max-h-[600px] custom-scrollbar relative">
                    {/* Professional Headers (Sticky) */}
                    <div style={{ gridTemplateColumns: `80px repeat(${displayedProfessionals.length}, 1fr)` }} className="grid border-b border-border bg-card sticky top-0 z-10">
                      <div className="p-3" />
                      {displayedProfessionals.map(p => (
                        <div key={p.id} className="p-3 text-center border-l border-border">
                          <div className="size-2 rounded-full mx-auto mb-1" style={{ backgroundColor: p.color }} />
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{p.name.split(" ")[0]}</p>
                        </div>
                      ))}
                    </div>

                    <div className="relative" style={{ height: `${HOURS.length * 60}px` }}>
                      {/* Hour lines */}
                      {HOURS.map((hour, idx) => (
                        <div key={hour} className="absolute w-full flex border-b border-border" style={{ top: `${idx * 60}px`, height: "60px" }}>
                          <div className="w-20 flex items-start justify-end pr-3 pt-1 shrink-0">
                            <span className="text-[10px] text-slate-600 font-bold">{hour.toString().padStart(2, "0")}:00</span>
                          </div>
                        </div>
                      ))}
                      {/* Columns */}
                      <div style={{ gridTemplateColumns: `80px repeat(${displayedProfessionals.length}, 1fr)`, height: "100%" }} className="absolute inset-0 grid">
                        <div />
                        {displayedProfessionals.map(p => {
                          const colApts = getPositionedForDayColumn(currentDate, p.id)
                          return (
                            <div key={p.id} className="border-l border-border relative">
                              {HOURS.map((hour, idx) => (
                                  <Tooltip key={hour}>
                                    <TooltipTrigger asChild>
                                      <button
                                        onClick={() => handleGridClick(currentDate, hour, p.id)}
                                        className="absolute w-full hover:bg-emerald-500/5 transition-colors group"
                                        style={{ top: `${idx * 60}px`, height: "60px" }}
                                      >
                                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30">
                                          <Plus className="size-3 text-emerald-500" />
                                        </span>
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="bg-slate-800 border-slate-700 text-slate-200 text-[10px] font-bold px-2 py-1 rounded-lg">
                                      {hour.toString().padStart(2, "0")}:00 — {p.name.split(" ")[0]}
                                    </TooltipContent>
                                  </Tooltip>
                              ))}
                              {colApts.map(a => <AppointmentPill key={a.id} a={{ ...a, top: a.top, height: a.height }} />)}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ───────────────── MONTH VIEW ───────────────── */}
              {viewMode === "month" && (
                <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
                  {/* Header (Sticky) */}
                  <div className="grid grid-cols-7 border-b border-border bg-card sticky top-0 z-10">
                    {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(d => (
                      <div key={d} className="p-3 text-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{d}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7">
                    {monthDays.map(day => {
                      const dayApts = filteredAppointments.filter(a => isSameDay(new Date(a.rawDate), day))
                      const isToday = isSameDay(day, new Date())
                      const isCurrentMonth = isSameMonth(day, currentDate)
                      return (
                        <button
                          key={day.toISOString()}
                          onClick={() => { setViewMode("day"); setCurrentDate(day) }}
                          className={cn(
                            "min-h-[100px] p-2 border-r border-b border-border text-left transition-colors hover:bg-emerald-500/5 relative",
                            !isCurrentMonth && "opacity-30"
                          )}
                        >
                          <p className={cn(
                            "text-sm font-black w-7 h-7 flex items-center justify-center rounded-full",
                            isToday ? "bg-primary text-primary-foreground" : "text-foreground/80"
                          )}>
                            {format(day, "d")}
                          </p>
                          <div className="mt-1 space-y-0.5">
                            {dayApts.slice(0, 3).map(a => (
                              <div key={a.id} className="text-[10px] font-bold truncate rounded px-1 py-0.5"
                                style={{ backgroundColor: `${getProfessionalColor(professionals, a.professionalId)}22`, color: getProfessionalColor(professionals, a.professionalId) }}>
                                {a.startTime} {a.clientName.split(" ")[0]}
                              </div>
                            ))}
                            {dayApts.length > 3 && (
                              <p className="text-[10px] text-slate-500 font-bold">+{dayApts.length - 3} mais</p>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </TooltipProvider>

      <AppointmentCreateSheet
        isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}
        onSave={handleSaveCreate}
        professionals={professionals} services={services}
        initialData={createInitialData || undefined}
      />
      <AppointmentEditSheet
        isOpen={isEditOpen} onOpenChange={setIsEditOpen}
        appointment={editingAppointment}
        onSave={handleSaveEdit}
        professionals={professionals} services={services}
      />
      <AppointmentDeleteAlert
        isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}
        appointment={deletingAppointment}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  )
}
