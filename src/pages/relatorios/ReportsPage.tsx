import { useState, useEffect, useMemo } from "react"
import { BarChart3, TrendingUp, Users, Scissors, Percent, Loader2, Calendar, Target, MousePointer2 } from "lucide-react"
import { toast } from "sonner"
import { useLoading } from "@/components/loading-provider"

import { AdminLayout } from "@/components/layout/AdminLayout"
import { reportsService } from "./services/reports.service"
import type { 
  FinancialReport, 
  ClientReport, 
  ServiceReport, 
  ReportCategory, 
  ReportPeriod 
} from "./types"

import { ReportHeader } from "./components/ReportHeader"
import { ReportCard, ReportAreaChart } from "./components/ReportCard"
import type { ChartConfig } from "@/components/ui/chart"

export default function ReportsPage() {
  const { setIsLoading: setGlobalLoading } = useLoading()
  
  const [category, setCategory] = useState<ReportCategory>("finance")
  const [period, setPeriod] = useState<ReportPeriod>("30d")
  const [isLoading, setIsLoading] = useState(true)

  const [financeData, setFinanceData] = useState<FinancialReport | null>(null)
  const [clientData, setClientData] = useState<ClientReport | null>(null)
  const [serviceData, setServiceData] = useState<ServiceReport | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setGlobalLoading(true)
    try {
      if (category === "finance") {
        const data = await reportsService.getFinancialReport(period)
        setFinanceData(data)
      } else if (category === "clients") {
        const data = await reportsService.getClientReport(period)
        setClientData(data)
      } else if (category === "services") {
        const data = await reportsService.getServiceReport(period)
        setServiceData(data)
      }
    } catch {
      toast.error("Erro ao carregar dados do relatório")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [category, period])

  const chartConfig: ChartConfig = {
    value: {
      label: "Faturamento",
      color: "hsl(var(--primary))",
    },
    bookings: {
      label: "Agendamentos",
      color: "hsl(var(--chart-2))",
    },
    newClients: {
      label: "Novos Clientes",
      color: "hsl(var(--chart-3))",
    }
  }

  const renderFinancialReport = () => {
    if (!financeData) return null
    return (
      <div className="grid grid-cols-1 gap-6">
        <ReportCard 
          title="Evolução Financeira" 
          description="Receitas e lucros ao longo do período selecionado."
          summaries={financeData.summary}
        >
          <ReportAreaChart data={financeData.revenueOverTime} config={chartConfig} />
        </ReportCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="bg-card/40 border border-border/50 rounded-[2rem] p-6 backdrop-blur-sm">
              <h3 className="font-black text-lg mb-4">Receita por Serviço</h3>
              <div className="space-y-4">
                 {financeData.revenueByService.map((s) => (
                   <div key={s.name} className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                        <span>{s.name}</span>
                        <span>{s.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(s.value / 4500) * 100}%` }} // Simplified calculation
                        />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="bg-card/40 border border-border/50 rounded-[2rem] p-6 backdrop-blur-sm flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-primary/10 rounded-full mb-4">
                 <TrendingUp className="size-8 text-primary" />
              </div>
              <h3 className="text-xl font-black mb-1">Previsão Próximo Mês</h3>
              <p className="text-muted-foreground text-xs font-medium max-w-[200px]">
                Com base no seu crescimento de 12.5%, esperamos um faturamento de R$ 14.400.
              </p>
           </div>
        </div>
      </div>
    )
  }

  const renderClientReport = () => {
    if (!clientData) return null
    return (
      <div className="grid grid-cols-1 gap-6">
        <ReportCard 
          title="Aquisição de Clientes" 
          description="Novos clientes cadastrados recentemente."
          summaries={clientData.summary}
        >
          <ReportAreaChart data={clientData.newClientsOverTime} config={chartConfig} />
        </ReportCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card/40 border border-border/50 rounded-[2rem] p-6 backdrop-blur-sm">
             <h3 className="font-black text-lg mb-4">Top Clientes</h3>
             <div className="space-y-3">
               {clientData.topClients.map((c) => (
                 <div key={c.name} className="flex items-center justify-between p-3 bg-background/40 rounded-2xl border border-border/20">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-primary/10 rounded-lg">
                          <Users className="size-4 text-primary" />
                       </div>
                       <div>
                          <p className="font-bold text-sm tracking-tight">{c.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{c.appointments} agendamentos</p>
                       </div>
                    </div>
                    <span className="font-black text-sm tracking-tighter">
                      {c.totalSpent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                 </div>
               ))}
             </div>
          </div>

          <div className="bg-card/40 border border-border/50 rounded-[2rem] p-6 backdrop-blur-sm">
             <h3 className="font-black text-lg mb-4">Demografia (Idade)</h3>
             <div className="flex flex-col gap-4 mt-4">
                {clientData.demographics.map((d) => (
                  <div key={d.label} className="flex items-center gap-4">
                    <span className="w-12 text-[10px] font-black uppercase text-muted-foreground">{d.label}</span>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-primary" style={{ width: `${d.value}%` }} />
                    </div>
                    <span className="text-[10px] font-black tabular-nums">{d.value}%</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    )
  }

  const renderServiceReport = () => {
    if (!serviceData) return null
    return (
      <div className="grid grid-cols-1 gap-6">
        <ReportCard 
          title="Desempenho de Serviços" 
          description="Frequência e faturamento por tipo de serviço."
          summaries={serviceData.summary}
        >
          <div className="bg-primary/5 rounded-3xl h-full flex flex-col items-center justify-center border border-primary/10 border-dashed">
             <Scissors className="size-16 text-primary/20 mb-4 animate-bounce" />
             <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">Análise de Serviços em tempo real</p>
          </div>
        </ReportCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {serviceData.mostRequestedServices.map((s) => (
             <div key={s.name} className="p-6 bg-card/40 border border-border/50 rounded-[2rem] backdrop-blur-sm">
                <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-primary/10 rounded-xl">
                      <Target className="size-5 text-primary" />
                   </div>
                   <span className="font-black tracking-tighter text-2xl text-primary">#{serviceData.mostRequestedServices.indexOf(s) + 1}</span>
                </div>
                <h4 className="font-black text-lg tracking-tight line-clamp-1">{s.name}</h4>
                <div className="flex justify-between mt-4">
                   <div className="space-y-1">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Quantidade</p>
                      <p className="font-black tracking-tighter">{s.count} vezes</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">Faturamento</p>
                      <p className="font-black tracking-tighter text-emerald-500">
                        {s.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    )
  }

  const renderOccupancyReport = () => {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card/20 rounded-[2.5rem] border border-dashed border-border/50 px-4 text-center">
         <div className="p-5 bg-orange-500/10 rounded-full mb-6">
           <Percent className="size-10 text-orange-500/40" />
         </div>
         <h3 className="text-xl font-black tracking-tight mb-2">Análise de Ocupação</h3>
         <p className="text-muted-foreground max-w-xs mb-8 font-medium text-sm">
           Estamos processando seus dados de agenda para gerar o mapa de calor de ocupação.
         </p>
         <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            Em processamento...
         </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        <ReportHeader 
          category={category}
          setCategory={setCategory}
          period={period}
          setPeriod={setPeriod}
          onExport={() => toast.success("Exportando relatório como PDF...")}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 bg-card/40 rounded-[2.5rem] border border-border/50 backdrop-blur-sm">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <Loader2 className="size-10 text-primary animate-spin" />
            </div>
            <p className="text-muted-foreground font-bold animate-pulse tracking-tight">Analisando dados...</p>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {category === "finance" && renderFinancialReport()}
            {category === "clients" && renderClientReport()}
            {category === "services" && renderServiceReport()}
            {category === "occupancy" && renderOccupancyReport()}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
