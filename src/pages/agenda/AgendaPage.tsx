import { useState, useEffect, useCallback } from "react"
import { Plus, Loader2, CalendarDays } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useLoading } from "@/components/loading-provider"
import type { DateRange } from "react-day-picker"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "@/hooks/use-debounce"
import { getActiveUnidadeId } from "@/lib/auth"

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
import { CheckoutSheet } from "./components/CheckoutSheet"

const ITEMS_PER_PAGE = 8

export default function AgendaPage() {
  const navigate = useNavigate()
  const { setIsLoading: setGlobalLoading } = useLoading()
  const unidadeId = getActiveUnidadeId()

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
  const [totalAppointments, setTotalAppointments] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Debounce search
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  // Sheet/dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null)

  // Checkout PDV state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [checkoutAppointment, setCheckoutAppointment] = useState<Appointment | null>(null)

  const fetchData = useCallback(async () => {
    if (!unidadeId) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    try {
      const params: any = {
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        unidadeId,
      }

      if (debouncedSearchTerm) params.search = debouncedSearchTerm
      if (professionalFilter !== "all") params.professionalId = professionalFilter
      if (serviceFilter !== "all") params.serviceId = serviceFilter
      if (statusFilter !== "all") params.status = statusFilter
      
      if (dateFilter === "today") {
          const now = new Date()
          params.startDate = new Date(now.setHours(0,0,0,0)).toISOString()
          params.endDate = new Date(now.setHours(23,59,59,999)).toISOString()
      } else if (dateFilter === "week") {
          const now = new Date()
          const sw = new Date(now.setDate(now.getDate() - now.getDay()))
          const ew = new Date(sw)
          ew.setDate(sw.getDate() + 6)
          params.startDate = new Date(sw.setHours(0,0,0,0)).toISOString()
          params.endDate = new Date(ew.setHours(23,59,59,999)).toISOString()
      } else if (dateFilter === "month") {
          const now = new Date()
          params.startDate = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
          params.endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()
      } else if (dateFilter === "custom" && dateRange?.from) {
          params.startDate = new Date(dateRange.from.setHours(0,0,0,0)).toISOString()
          if (dateRange.to) {
              params.endDate = new Date(dateRange.to.setHours(23,59,59,999)).toISOString()
          }
      }

      const res = await agendaService.getAppointmentsPaginated(params)
      
      setAppointments(res.data)
      setTotalAppointments(res.total)
      setTotalPages(res.pages)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar agendamentos")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }, [unidadeId, currentPage, debouncedSearchTerm, professionalFilter, serviceFilter, statusFilter, dateFilter, dateRange, setGlobalLoading])

  const fetchInitialData = useCallback(async () => {
    if (!unidadeId) return
    try {
        const [profs, svcs] = await Promise.all([
            agendaService.getProfessionals(unidadeId),
            agendaService.getServices(unidadeId),
        ])
        setProfessionals(profs)
        setServices(svcs)
    } catch (error) {
        console.error(error)
        toast.error("Erro ao carregar dados auxiliares")
    }
  }, [unidadeId])

  useEffect(() => { 
    fetchInitialData()
  }, [fetchInitialData])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearchTerm, professionalFilter, serviceFilter, statusFilter, dateFilter, dateRange])

  const handleEdit = (a: Appointment) => {
    setEditingAppointment(a)
    setIsEditOpen(true)
  }

  const handleSaveEdit = async (data: AppointmentFormValues) => {
    if (!editingAppointment) return
    setGlobalLoading(true)
    try {
      const dateStr = format(data.dateObj, "yyyy-MM-dd")
      const startTime = new Date(`${dateStr}T${data.startTime}:00`).toISOString()
      const endTime = new Date(`${dateStr}T${data.endTime}:00`).toISOString()

      await agendaService.updateAppointment(editingAppointment.id, {
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        professionalId: data.professionalId,
        serviceId: data.serviceId,
        serviceDuration: services.find(s => s.id === data.serviceId)?.duration || 30,
        startTime,
        endTime,
        status: data.status,
        paymentStatus: data.paymentStatus,
        amount: Number(data.amount),
        notes: data.notes,
        clienteId: data.clientId || undefined,
      } as any)
      await fetchData()
      setIsEditOpen(false)
      setEditingAppointment(null)
      toast.success("Agendamento atualizado com sucesso!")
    } catch {
      toast.error("Erro ao atualizar agendamento")
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleSaveCreate = async (data: AppointmentFormValues) => {
    if (!unidadeId) return
    setGlobalLoading(true)
    try {
      const dateStr = format(data.dateObj, "yyyy-MM-dd")
      const startTime = new Date(`${dateStr}T${data.startTime}:00`).toISOString()
      const endTime = new Date(`${dateStr}T${data.endTime}:00`).toISOString()

      await agendaService.createAppointment({
        clientName: data.clientName,
        clientPhone: data.clientPhone,
        professionalId: data.professionalId,
        serviceId: data.serviceId,
        serviceDuration: services.find(s => s.id === data.serviceId)?.duration || 30,
        startTime,
        endTime,
        status: data.status,
        paymentStatus: data.paymentStatus,
        amount: Number(data.amount),
        notes: data.notes,
        clienteId: data.clientId || undefined,
        unidadeId,
      } as any)
      await fetchData()
      setIsCreateOpen(false)
      toast.success("Agendamento criado com sucesso!")
    } catch {
      toast.error("Erro ao criar agendamento")
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleDeleteClick = (a: Appointment) => {
    setDeletingAppointment(a)
    setIsDeleteOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingAppointment) return
    setGlobalLoading(true)
    try {
      await agendaService.deleteAppointment(deletingAppointment.id)
      await fetchData()
      setIsDeleteOpen(false)
      setDeletingAppointment(null)
      toast.success("Agendamento excluído com sucesso!")
    } catch {
      toast.error("Erro ao excluir agendamento")
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleCheckoutClick = (a: Appointment) => {
    setCheckoutAppointment(a)
    setIsCheckoutOpen(true)
  }

  const handleCheckoutConfirm = async (data: any) => {
    if (!checkoutAppointment) return
    setGlobalLoading(true)
    try {
      await agendaService.updateAppointment(checkoutAppointment.id, data)
      await fetchData()
      setIsCheckoutOpen(false)
      setCheckoutAppointment(null)
      toast.success("Atendimento concluído e pago com sucesso!")
    } catch {
      toast.error("Erro ao processar o checkout do atendimento")
    } finally {
      setGlobalLoading(false)
    }
  }

  const handleUpdateAppointmentServices = async (id: string, servicos: any[]) => {
    try {
      const updatedAppointment = await agendaService.updateAppointment(id, { servicos }) as Appointment
      
      // Atualizamos os dados locais
      setAppointments(prev => prev.map(a => a.id === id ? updatedAppointment : a))
      
      // Também atualizamos o `checkoutAppointment` para que o sheet reflita os novos dados
      setCheckoutAppointment(updatedAppointment)
      
      // Opcional: recarregar tudo para garantir contadores e paginação corretos
      fetchData()
    } catch (error) {
      console.error(error)
      throw error
    }
  }

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
            appointments={appointments}
            totalAppointments={totalAppointments}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            setCurrentPage={setCurrentPage}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onCheckout={handleCheckoutClick}
          />
        )}
      </div>

      {/* Sheets / dialogs */}
      <AppointmentCreateSheet
        isOpen={isCreateOpen} onOpenChange={setIsCreateOpen}
        onSave={handleSaveCreate}
        professionals={professionals} services={services}
        unidadeId={unidadeId}
      />
      <AppointmentEditSheet
        isOpen={isEditOpen} onOpenChange={setIsEditOpen}
        appointment={editingAppointment}
        onSave={handleSaveEdit}
        professionals={professionals} services={services}
        unidadeId={unidadeId}
      />
      <AppointmentDeleteAlert
        isOpen={isDeleteOpen} onOpenChange={setIsDeleteOpen}
        appointment={deletingAppointment}
        onConfirm={handleConfirmDelete}
      />
      <CheckoutSheet
        isOpen={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}
        appointment={checkoutAppointment}
        services={services}
        onCheckout={handleCheckoutConfirm}
        onUpdateServices={handleUpdateAppointmentServices}
      />
    </AdminLayout>
  )
}
