import { useState, useMemo, useEffect } from "react"
import { Plus, Loader2, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useLoading } from "@/components/loading-provider"
import type { DateRange } from "react-day-picker"
import { useNavigate } from "react-router-dom"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"

import { agendaService } from "./services/agenda.service"
import type { Appointment, Professional, Service } from "./types"
import type { AppointmentFormValues } from "./schema"

import { AppointmentDateFilter } from "./components/AppointmentDateFilter"
import { AppointmentFilters } from "./components/AppointmentFilters"
import { AppointmentTable } from "./components/AppointmentTable"
import { AppointmentCreateSheet } from "./components/AppointmentCreateSheet"
import { AppointmentEditSheet } from "./components/AppointmentEditSheet"
import { AppointmentDeleteAlert } from "./components/AppointmentDeleteAlert"

const ITEMS_PER_PAGE = 8

export default function AgendaPage() {
  const navigate = useNavigate()
  const { setIsLoading: setGlobalLoading } = useLoading()

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [professionalFilter, setProfessionalFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [currentPage, setCurrentPage] = useState(1)

  // Sheet/dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      const [apts, profs, svcs] = await Promise.all([
        agendaService.getAppointments(),
        agendaService.getProfessionals(),
        agendaService.getServices(),
      ])
      setAppointments(apts)
      setProfessionals(profs)
      setServices(svcs)
    } catch {
      toast.error("Erro ao carregar dados da agenda")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleEdit = (a: Appointment) => {
    setEditingAppointment(a)
    setIsEditOpen(true)
  }

  const handleSaveEdit = async (data: AppointmentFormValues) => {
    if (!editingAppointment) return
    try {
      const prof = professionals.find(p => p.id === data.professionalId)
      const svc = services.find(s => s.id === data.serviceId)
      await agendaService.updateAppointment(editingAppointment.id, {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        professionalId: data.professionalId,
        professionalName: prof?.name || "",
        serviceId: data.serviceId,
        serviceName: svc?.name || "",
        serviceDuration: svc?.duration || 30,
        date: format(data.dateObj, "dd MMM, yyyy", { locale: ptBR }),
        rawDate: data.dateObj,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        paymentStatus: data.paymentStatus,
        amount: data.amount,
        notes: data.notes,
        initials: data.clientName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      })
      await fetchData()
      setIsEditOpen(false)
      setEditingAppointment(null)
      toast.success("Agendamento atualizado com sucesso!")
    } catch {
      toast.error("Erro ao atualizar agendamento")
    }
  }

  const handleSaveCreate = async (data: AppointmentFormValues) => {
    try {
      const prof = professionals.find(p => p.id === data.professionalId)
      const svc = services.find(s => s.id === data.serviceId)
      await agendaService.createAppointment({
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        professionalId: data.professionalId,
        professionalName: prof?.name || "",
        serviceId: data.serviceId,
        serviceName: svc?.name || "",
        serviceDuration: svc?.duration || 30,
        date: format(data.dateObj, "dd MMM, yyyy", { locale: ptBR }),
        rawDate: data.dateObj,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        paymentStatus: data.paymentStatus,
        amount: data.amount,
        notes: data.notes,
        initials: data.clientName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      })
      await fetchData()
      setIsCreateOpen(false)
      toast.success("Agendamento criado com sucesso!")
    } catch {
      toast.error("Erro ao criar agendamento")
    }
  }

  const handleDeleteClick = (a: Appointment) => {
    setDeletingAppointment(a)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingAppointment) return
    try {
      await agendaService.deleteAppointment(deletingAppointment.id)
      await fetchData()
      setIsDeleteOpen(false)
      setDeletingAppointment(null)
      toast.success("Agendamento excluído com sucesso!")
    } catch {
      toast.error("Erro ao excluir agendamento")
    }
  }

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchesSearch = a.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesProfessional = professionalFilter === "all" || a.professionalId === professionalFilter
      const matchesService = serviceFilter === "all" || a.serviceId === serviceFilter
      const matchesStatus = statusFilter === "all" || a.status === statusFilter

      const aptDate = new Date(a.rawDate)
      aptDate.setHours(0, 0, 0, 0)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      const isToday = aptDate.getTime() === now.getTime()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      const isThisWeek = aptDate >= startOfWeek && aptDate <= endOfWeek
      const isThisMonth = aptDate.getMonth() === now.getMonth() && aptDate.getFullYear() === now.getFullYear()

      let matchesDate = true
      if (dateFilter === "today") matchesDate = isToday
      else if (dateFilter === "week") matchesDate = isThisWeek
      else if (dateFilter === "month") matchesDate = isThisMonth
      else if (dateFilter === "custom" && dateRange?.from) {
        const from = new Date(dateRange.from); from.setHours(0, 0, 0, 0)
        if (dateRange.to) {
          const to = new Date(dateRange.to); to.setHours(23, 59, 59, 999)
          matchesDate = aptDate >= from && aptDate <= to
        } else {
          matchesDate = aptDate.getTime() === from.getTime()
        }
      }

      return matchesSearch && matchesProfessional && matchesService && matchesStatus && matchesDate
    })
  }, [appointments, searchTerm, professionalFilter, serviceFilter, statusFilter, dateFilter, dateRange])

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE)
  const paginatedAppointments = filteredAppointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE
  )

  const clearFilters = () => {
    setSearchTerm(""); setProfessionalFilter("all"); setServiceFilter("all")
    setStatusFilter("all"); setDateFilter("all"); setDateRange(undefined); setCurrentPage(1)
  }

  return (
    <AdminLayout>
      <div className="space-y-6 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Agenda
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Gerencie seus agendamentos e horários em tempo real.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <AppointmentDateFilter
              dateFilter={dateFilter} setDateFilter={(v) => { setDateFilter(v); setCurrentPage(1) }}
              dateRange={dateRange} setDateRange={setDateRange}
            />
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/agenda-calendario")}
                className="hidden sm:flex flex-1 sm:flex-none h-11 sm:h-9 rounded-xl border-border text-muted-foreground gap-2 hover:border-primary/50 hover:text-primary transition-all"
              >
                <CalendarDays className="size-4" />
                <span className="hidden xs:inline sm:inline">Calendário</span>
              </Button>
              <Button
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                className="flex-[2] sm:flex-none h-11 sm:h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 font-bold gap-2 shadow-lg shadow-primary/20 transition-all border-0 order-first sm:order-last"
              >
                <Plus className="size-4 stroke-[3px]" />
                <span className="hidden xs:inline sm:inline">Novo</span>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI chips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Hoje", count: appointments.filter(a => { const d = new Date(a.rawDate); const n = new Date(); return d.toDateString() === n.toDateString() }).length, color: "text-blue-500" },
            { label: "Esta Semana", count: appointments.filter(a => { const d = new Date(a.rawDate); d.setHours(0,0,0,0); const n = new Date(); n.setHours(0,0,0,0); const sw = new Date(n); sw.setDate(n.getDate()-n.getDay()); const ew = new Date(sw); ew.setDate(sw.getDate()+6); return d >= sw && d <= ew }).length, color: "text-primary" },
            { label: "Pendentes", count: appointments.filter(a => a.paymentStatus === "PENDING" && a.status !== "CANCELLED").length, color: "text-amber-500" },
            { label: "Concluídos", count: appointments.filter(a => a.status === "COMPLETED").length, color: "text-emerald-500" },
          ].map(kpi => (
            <div key={kpi.label} className="bg-card/40 border border-border/50 rounded-2xl p-4 backdrop-blur-sm">
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">{kpi.label}</p>
              <p className={`text-2xl font-black mt-1 ${kpi.color}`}>{kpi.count}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <AppointmentFilters
          searchTerm={searchTerm} setSearchTerm={(v) => { setSearchTerm(v); setCurrentPage(1) }}
          professionalFilter={professionalFilter} setProfessionalFilter={(v) => { setProfessionalFilter(v); setCurrentPage(1) }}
          serviceFilter={serviceFilter} setServiceFilter={(v) => { setServiceFilter(v); setCurrentPage(1) }}
          statusFilter={statusFilter} setStatusFilter={(v) => { setStatusFilter(v); setCurrentPage(1) }}
          dateFilter={dateFilter}
          professionals={professionals} services={services}
          onClear={clearFilters}
        />

        {/* Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 bg-card/40 rounded-3xl border border-border/50">
            <Loader2 className="size-8 text-primary animate-spin mb-3" />
            <p className="text-muted-foreground font-medium animate-pulse">Carregando agenda...</p>
          </div>
        ) : (
          <AppointmentTable
            appointments={paginatedAppointments}
            totalAppointments={filteredAppointments.length}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            setCurrentPage={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        )}
      </div>

      {/* Sheets / dialogs */}
      <AppointmentCreateSheet
        isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}
        onSave={handleSaveCreate}
        professionals={professionals} services={services}
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
