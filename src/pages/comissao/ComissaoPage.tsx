import { useState, useMemo, useEffect, useCallback } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useLoading } from "@/components/loading-provider"
import { CommissionKPIs } from "./components/CommissionKPIs"
import { BarberPerformance } from "./components/BarberPerformance"
import { CommissionFilters } from "./components/CommissionFilters"
import { CommissionTable } from "./components/CommissionTable"
import { BarberCommissionDetailSheet } from "./components/BarberCommissionDetailSheet"
import { PlanRevenueShare } from "./components/PlanRevenueShare"
import { toast } from "sonner"
import { Filter, Loader2 } from "lucide-react"
import type { CommissionTransaction, BarberCommissionStats, CommissionKpis } from "./types"
import { comissoesService } from "@/services/comissoes.service"

import { ChevronLeft, ChevronRight, Share, DollarSign } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

import { getActiveUnidadeId } from "@/lib/auth"

export default function ComissaoPage() {
  const { setIsLoading } = useLoading()

  const [date, setDate] = useState<Date>(new Date())

  // Estados de dados
  const [kpis, setKpis] = useState<CommissionKpis>({
    totalRevenue: 0,
    totalCommissions: 0,
    houseNet: 0,
    pendingPayments: 0,
  })
  const [barberStats, setBarberStats] = useState<BarberCommissionStats[]>([])
  const [repasseData, setRepasseData] = useState<any>(null)
  const [transactions, setTransactions] = useState<CommissionTransaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  // Estados de UI
  const [loading, setLoading] = useState(true)
  const [loadingTx, setLoadingTx] = useState(false)

  const [unidadeId, setUnidadeId] = useState<string | null>(getActiveUnidadeId())

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [barberFilter, setBarberFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  // Detail Sheet
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null)

  const month = date.getMonth() + 1
  const year = date.getFullYear()

  // ── Carrega KPIs e barberStats ──
  const fetchStats = useCallback(async () => {
    if (!unidadeId) {
      console.warn("Nenhuma unidade selecionada para carregar estatísticas.");
      setLoading(false)
      setIsLoading(false)
      return
    }

    try {
      setLoading(true)
      setIsLoading(true)
      const [statsData, repasseResult] = await Promise.all([
        comissoesService.getStats({ unidadeId, month, year }),
        comissoesService.getRepasseStats({ unidadeId, month, year }).catch(() => null),
      ])
      setKpis(statsData.kpis)
      setBarberStats(statsData.barberStats)
      setRepasseData(repasseResult)
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error)
    } finally {
      setLoading(false)
      setIsLoading(false)
    }
  }, [month, year, setIsLoading, unidadeId])

  // ── Carrega transações com filtros ──
  const fetchTransactions = useCallback(async (page = 1) => {
    if (!unidadeId) {
      setLoadingTx(false)
      return
    }
    try {
      setLoadingTx(true)
      const res = await comissoesService.getTransactions({
        unidadeId,
        month,
        year,
        professionalId: barberFilter !== "all" ? barberFilter : undefined,
        isPago: statusFilter === "PAID" ? "true" : statusFilter === "PENDING" ? "false" : undefined,
        tipo: typeFilter === "PLANO" ? "PLANO" : typeFilter === "AVULSO" ? "AVULSO" : undefined,
        search: searchTerm || undefined,
        page,
        limit: 20,
      })
      setTransactions(res.data)
      setTotalTransactions(res.total)
      setCurrentPage(res.page)
    } catch (error) {
      console.error("Erro ao carregar transações:", error)
    } finally {
      setLoadingTx(false)
    }
  }, [month, year, barberFilter, statusFilter, typeFilter, searchTerm, unidadeId])

  useEffect(() => { fetchStats() }, [fetchStats])
  useEffect(() => { fetchTransactions(1) }, [fetchTransactions])

  // ── Ações ──
  const handleMarkAsPaid = async (id: string) => {
    try {
      await comissoesService.pagarComissao(id)
      toast.success("Comissão liquidada com sucesso!")
      fetchStats()
      fetchTransactions(currentPage)
    } catch { /* tratado globalmente */ }
  }

  const handleLiquidateBarber = async (professionalId: string) => {
    const barber = barberStats.find(b => b.professionalId === professionalId)
    if (!barber || barber.pendingCommission <= 0) {
      toast.info("Não há comissões pendentes para este barbeiro.")
      return
    }
    try {
      const res = await comissoesService.liquidarBarbeiro(professionalId, { unidadeId: unidadeId!, month, year })
      toast.success(`${res.liquidadas} comissão(ões) de ${barber.barberName} liquidada(s)!`)
      fetchStats()
      fetchTransactions(currentPage)
    } catch { /* tratado globalmente */ }
  }

  const handleLiquidateAll = async () => {
    const pending = barberStats.filter(b => b.pendingCommission > 0)
    if (!pending.length) {
      toast.info("Não há comissões pendentes.")
      return
    }
    try {
      await Promise.all(pending.map(b =>
        comissoesService.liquidarBarbeiro(b.professionalId, { unidadeId: unidadeId!, month, year })
      ))
      toast.success("Todas as comissões foram liquidadas!")
      fetchStats()
      fetchTransactions(1)
    } catch { /* tratado globalmente */ }
  }

  const handleOpenDetails = (barberId: string) => {
    setSelectedBarberId(barberId)
    setIsDetailOpen(true)
  }

  const selectedBarberStats = useMemo(
    () => barberStats.find(b => b.professionalId === selectedBarberId || b.barberId === selectedBarberId) || null,
    [barberStats, selectedBarberId]
  )

  // Transações do barbeiro selecionado para o Sheet
  const selectedBarberTransactions = useMemo(
    () => transactions.filter(tx => tx.professionalId === selectedBarberId || tx.barberId === selectedBarberId),
    [transactions, selectedBarberId]
  )

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-10 pb-20">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8 bg-muted/30 p-6 rounded-2xl border border-border/50">
          <div className="space-y-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">Gestão de Comissões</h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm">Acompanhamento financeiro em tempo real da equipe.</p>
          </div>

          {/* Seletor de Mês */}
          <div className="flex items-center bg-card border border-border/50 rounded-xl p-1 shadow-xl ring-4 ring-primary/5">
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              onClick={() => { const d = new Date(date); d.setMonth(d.getMonth() - 1); setDate(d) }}
            >
              <ChevronLeft className="size-5" />
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <button className="px-6 flex flex-col items-center min-w-[160px] hover:bg-muted/50 rounded-lg transition-colors py-1.5">
                  <span className="text-sm font-black uppercase tracking-widest text-primary">
                    {format(date, "MMMM yyyy", { locale: ptBR })}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mês Aberto</span>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  autoFocus
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>

            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
              onClick={() => { const d = new Date(date); d.setMonth(d.getMonth() + 1); setDate(d) }}
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button className="px-6 py-3 rounded-xl border border-border shadow-sm text-foreground font-semibold flex items-center justify-center gap-2 hover:bg-muted transition-colors w-full sm:w-auto">
              <Share className="size-4" />
              Exportar
            </button>
            <button
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-black flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20 transition-all w-full sm:w-auto uppercase tracking-wider text-sm disabled:opacity-50"
              onClick={handleLiquidateAll}
              disabled={loading}
            >
              <DollarSign className="size-4" />
              Pagar Tudo
            </button>
          </div>
        </div>

        {/* Loading Global */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <CommissionKPIs
              totalRevenue={kpis.totalRevenue}
              totalCommissions={kpis.totalCommissions}
              houseNet={kpis.houseNet}
              pendingPayments={kpis.pendingPayments}
            />

            <BarberPerformance
              stats={barberStats}
              onViewDetails={handleOpenDetails}
              onLiquidate={handleLiquidateBarber}
            />

            {repasseData && (
              <PlanRevenueShare
                unidadeId={unidadeId!}
                month={month}
                year={year}
                data={repasseData}
                onRefresh={fetchStats}
              />
            )}
          </>
        )}

        {/* Tabela de Transações */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Filter className="size-4 text-primary" />
            </div>
            <h2 className="text-xl font-black tracking-tight">Todas as Movimentações</h2>
          </div>

          <CommissionFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            barberFilter={barberFilter}
            setBarberFilter={setBarberFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          {loadingTx ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <CommissionTable
              transactions={transactions}
              onMarkAsPaid={handleMarkAsPaid}
            />
          )}
        </div>

        <BarberCommissionDetailSheet
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
          barber={selectedBarberStats}
          transactions={selectedBarberTransactions}
          onMarkAsPaid={handleMarkAsPaid}
        />
      </div>
    </AdminLayout>
  )
}
