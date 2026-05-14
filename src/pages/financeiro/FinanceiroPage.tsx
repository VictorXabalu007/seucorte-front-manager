import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useLoading } from "@/components/loading-provider"
import { Plus, Download, TrendingUp, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

import { startOfMonth, endOfMonth } from "date-fns"
import type { DateRange } from "react-day-picker"
import { FinancialKPIs } from "./components/FinancialKPIs"
import { CashFlowTable } from "./components/CashFlowTable"
import { TransactionSheet } from "./components/TransactionSheet"
import { FinancialCharts } from "./components/FinancialCharts"
import { FinancialDateFilter } from "./components/FinancialDateFilter"
import { financeiroService } from "@/services/financeiro.service"
import { getActiveUnidadeId } from "@/lib/auth"
import type { FinancialSummary, FinancialTransaction } from "./types"
import { toast } from "sonner"

export default function FinanceiroPage() {
  const { setIsLoading } = useLoading()
  const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(false)
  
  // Date Filter State
  const [dateFilter, setDateFilter] = useState<"month" | "week" | "custom">("month")
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  })

  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [summary, setSummary] = useState<FinancialSummary>({
    totalIn: 0,
    totalOut: 0,
    netBalance: 0,
    profitMargin: 0,
    totalTransactions: 0
  })

  const loadData = async () => {
    setIsLoading(true)
    try {
      const unidadeId = getActiveUnidadeId()
      if (!unidadeId) return

      let fromStr, toStr
      if (dateRange?.from) fromStr = dateRange.from.toISOString()
      if (dateRange?.to) toStr = dateRange.to.toISOString()

      const [summaryData, txData] = await Promise.all([
        financeiroService.getSummary(unidadeId, fromStr, toStr),
        financeiroService.getTransactions({ unidadeId, dateFrom: fromStr, dateTo: toStr, limit: 100 })
      ])

      setSummary(summaryData)
      setTransactions(txData.data)
    } catch (error) {
      console.error("Failed to load financial data:", error)
      toast.error("Erro ao carregar dados financeiros")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [dateRange])

  const handleExport = () => {
    const unidadeId = getActiveUnidadeId()
    if (!unidadeId) return
    
    let fromStr, toStr
    if (dateRange?.from) fromStr = dateRange.from.toISOString()
    if (dateRange?.to) toStr = dateRange.to.toISOString()
    
    const url = financeiroService.exportCsvUrl(unidadeId, fromStr, toStr)
    window.open(url, '_blank')
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-10 pb-20">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sm:gap-6">
            <div className="w-full sm:w-auto">
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-foreground bg-gradient-to-tr from-foreground to-foreground/50 bg-clip-text text-transparent">
                    Financeiro
                </h1>
                <p className="text-muted-foreground font-medium text-xs sm:text-sm mt-1">
                    Gestão integral de lucro, despesas e saúde financeira.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                <FinancialDateFilter 
                    dateFilter={dateFilter}
                    setDateFilter={setDateFilter}
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button 
                      variant="outline" 
                      onClick={handleExport}
                      className="flex-1 sm:flex-none rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-4 border-border/50 bg-card/40"
                  >
                      <Download className="size-4 mr-2" />
                      Exportar
                  </Button>
                  <Button 
                      className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-black text-[10px] uppercase tracking-widest h-11 px-6 shadow-xl shadow-primary/20 group border-0"
                      onClick={() => setIsTransactionSheetOpen(true)}
                  >
                      <Plus className="size-4 mr-2 group-hover:rotate-90 transition-transform" />
                      Nova
                  </Button>
                </div>
            </div>
        </div>

        <FinancialKPIs summary={summary} />

        <FinancialCharts dateRange={dateRange} />

        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="size-4 text-primary" />
                    </div>
                    <h2 className="text-xl font-black tracking-tight">Análise de Fluxo</h2>
                </div>
            </div>

            <CashFlowTable transactions={transactions} />
        </div>

        <TransactionSheet 
            isOpen={isTransactionSheetOpen} 
            onOpenChange={setIsTransactionSheetOpen} 
            onSave={loadData}
        />
      </div>
    </AdminLayout>
  )
}
