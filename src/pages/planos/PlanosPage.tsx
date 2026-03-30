import React, { useState, useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { 
  Plus, 
  CreditCard,
  Users,
  TrendingUp,
  Search,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  History,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  MinusCircle,
  Edit2,
  Trash2
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { planoService } from "./services/plano.service"
import { servicesService } from "../servicos/services/services.service"
import { clienteService } from "../clientes/services/cliente.service"
import type { Plano } from "./types/plano"
import type { Service } from "../servicos/types"
import type { Cliente } from "../clientes/types/cliente"
import { useLoading } from "@/components/loading-provider"
import { getActiveUnidadeId } from "@/lib/auth"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const safeFormat = (date: any, formatStr: string) => {
  try {
    if (!date) return "N/A"
    const d = new Date(date)
    if (isNaN(d.getTime())) return "N/A"
    return format(d, formatStr, { locale: ptBR })
  } catch (e) {
    return "N/A"
  }
}

export default function PlanosPage() {
  const { setIsLoading } = useLoading()
  const unidadeId = getActiveUnidadeId()
  const navigate = useNavigate()

  const [stats, setStats] = useState<any>(null)
  const [assinantes, setAssinantes] = useState<any[]>([])
  const [totalAssinantes, setTotalAssinantes] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("Todos")

  const [servicosDisponiveis, setServicosDisponiveis] = useState<Service[]>([])
  const [clientesDisponiveis, setClientesDisponiveis] = useState<Cliente[]>([])
  
  const loadDashboard = useCallback(async () => {
    if (!unidadeId) return
    try {
      const data = await planoService.getDashboardStats(unidadeId)
      setStats(data)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar os dados do dashboard")
    }
  }, [unidadeId])

  const loadAssinantes = useCallback(async () => {
    if (!unidadeId) return
    setIsLoading(true)
    try {
      const params: any = {
        unidadeId,
        page,
        limit: 10,
        status: statusFilter === "Todos" ? undefined : statusFilter
      }
      const data = await planoService.getAssinantes(params)
      setAssinantes(data.data)
      setTotalPages(data.pages)
      setTotalAssinantes(data.total)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar assinantes")
    } finally {
      setIsLoading(false)
    }
  }, [unidadeId, page, statusFilter, setIsLoading])

  const loadResources = useCallback(async () => {
    if (!unidadeId) return
    try {
      const [servicosData, clientesData] = await Promise.all([
        servicesService.getServices(unidadeId),
        clienteService.getClientes({ unidadeId })
      ])
      setServicosDisponiveis(servicosData || [])
      setClientesDisponiveis(clientesData.data || [])
    } catch (error) {
       console.error(error)
    }
  }, [unidadeId])

  useEffect(() => {
    loadDashboard()
    loadResources()
  }, [loadDashboard, loadResources])

  useEffect(() => {
    loadAssinantes()
  }, [loadAssinantes])

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

  const handleDeletePlano = async (id: string) => {
    if (!confirm("Tem certeza que deseja inativar/remover este plano? O plano não será mais oferecido e contratos ativos podem ser afetados.")) return;
    try {
      setIsLoading(true)
      await planoService.deletePlan(id)
      toast.success("Plano atualizado com sucesso!")
      loadDashboard()
    } catch(err) {
      toast.error("Falha ao remover plano.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayFatura = async (faturaId: string) => {
    try {
      setIsLoading(true)
      await planoService.payFatura(faturaId)
      toast.success("Fatura marcada como PAGA com sucesso!")
      loadAssinantes()
      loadDashboard()
    } catch(err) {
      toast.error("Falha ao registrar pagamento")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateFatura = async (assinaturaId: string) => {
    try {
      setIsLoading(true)
      await planoService.generateFatura(assinaturaId)
      toast.success("Nova fatura gerada com sucesso!")
      loadAssinantes()
    } catch(err) {
      toast.error("Falha ao gerar nova fatura")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-10 pb-12 w-full max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">Gestão de Assinaturas</h1>
            <p className="text-muted-foreground text-sm font-medium mt-1">Acompanhe seu faturamento recorrente e a perfomance dos planos</p>
          </div>
        </div>

        {/* Section 1: Financial KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-card/40 border border-border/60 p-6 rounded-2xl relative overflow-hidden backdrop-blur-sm group hover:border-primary/30 transition-all">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <CreditCard className="size-16 text-primary" />
            </div>
            <p className="text-muted-foreground text-sm font-medium mb-1">Faturamento Bruto (Mês)</p>
            <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {formatMoney(stats?.faturamentoBruto || 0)}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold">
              <TrendingUp className="size-4" />
              <span>Recebido em faturas</span>
            </div>
          </div>

          <div className="bg-card/40 border border-border/60 p-6 rounded-2xl backdrop-blur-sm hover:border-primary/30 transition-all">
            <p className="text-muted-foreground text-sm font-medium mb-1">Assinantes Ativos</p>
            <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
              {stats?.activeSubscribers || 0}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-primary text-xs font-bold">
              <Users className="size-4" />
              <span>Nos planos ativos</span>
            </div>
          </div>

          <div className="bg-card/40 border-l-4 border-l-destructive border border-border/60 p-6 rounded-2xl backdrop-blur-sm group hover:border-destructive/40 transition-all">
            <p className="text-muted-foreground text-sm font-medium mb-1">Inadimplência</p>
            <h3 className="text-3xl sm:text-4xl font-black text-destructive tracking-tight">
              {stats?.vencidas || 0} <span className="text-lg opacity-60 font-medium">faturas</span>
            </h3>
            <div className="mt-4 flex items-center gap-2 text-destructive text-xs font-bold">
              <AlertCircle className="size-4" />
              <span>{(stats?.defaultRate || 0).toFixed(1)}% do total ativo</span>
            </div>
          </div>

          <div className="bg-card/40 border border-border/60 p-6 rounded-2xl backdrop-blur-sm group hover:border-foreground/20 transition-all">
            <p className="text-muted-foreground text-sm font-medium mb-1">Cancelamentos (Mês)</p>
            <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
               {stats?.canceladosMes || 0} <span className="text-lg opacity-60 font-medium text-muted-foreground">assinantes</span>
            </h3>
            <div className="mt-4 flex items-center gap-2 text-muted-foreground text-xs font-bold">
              <MinusCircle className="size-4" />
              <span>{(stats?.churnRate || 0).toFixed(1)}% taxa de churn</span>
            </div>
          </div>
        </section>

        {/* Section 2: Plan Performance */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
            <div>
              <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight">Performance por Plano</h2>
              <p className="text-muted-foreground text-xs md:text-sm">Distribuição de receita e membros por modalidade</p>
            </div>
            <Button 
              onClick={() => navigate("/planos/novo")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md"
            >
              <Plus className="size-5 stroke-[3px]" />
              Novo Plano
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats?.planosPerformance?.map((plan: any) => {
              const expected = plan.revenue || 0
              const paid = plan.paidRevenue || 0
              const percentage = expected > 0 ? Math.min(Math.round((paid / expected) * 100), 100) : 0
              
              return (
                <div key={plan.id} className="bg-card/40 p-6 rounded-2xl border border-border/60 hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-2">
                      <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Ativo</span>
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        <Users className="size-3" />
                        {plan.memberCount || 0} Membros
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => navigate(`/planos/${plan.id}/editar`)}>
                         <Edit2 className="size-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => handleDeletePlano(plan.id)}>
                         <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-1 truncate">{plan.name}</h4>
                  <p className="text-3xl font-black text-primary mb-6">
                    {formatMoney(plan.price)}
                    <span className="text-sm font-medium text-muted-foreground">/mês</span>
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Recebido no Mês vs Esperado</span>
                      <span className="font-bold text-primary">{percentage}%</span>
                    </div>
                    <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                    </div>
                    <div className="flex justify-between text-xs pt-1">
                      <span className="font-bold text-foreground">{formatMoney(paid)} <span className="text-muted-foreground font-medium">pagos</span></span>
                      <span className="text-muted-foreground font-medium">de {formatMoney(expected)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {(!stats?.planosPerformance || stats.planosPerformance.length === 0) && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center space-y-4 bg-card/20 rounded-2xl border-2 border-dashed border-border/50">
                <p className="text-muted-foreground font-medium text-sm">Nenhum plano ativo encontrado.</p>
              </div>
            )}
          </div>
        </section>

        {/* Section 3: Subscriber Management */}
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-lg md:text-xl font-black text-foreground tracking-tight">Gestão de Assinantes</h2>
            <div className="flex flex-wrap gap-2">
              {["Todos", "Pendentes", "Ativos", "Atrasados", "Cancelados"].map(fil => {
                const mapAPIStatus: Record<string, string> = {
                  "Todos": "Todos",
                  "Pendentes": "Pendente",
                  "Ativos": "Ativo",
                  "Atrasados": "Atrasado",
                  "Cancelados": "Cancelado"
                };
                const isActive = statusFilter === mapAPIStatus[fil];
                return (
                  <Button 
                    key={fil}
                    variant={isActive ? "default" : "secondary"}
                    size="sm"
                    onClick={() => {
                        setStatusFilter(mapAPIStatus[fil])
                        setPage(1)
                    }}
                    className={cn(
                      "rounded-full text-xs font-bold px-5",
                      isActive ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted-foreground/10"
                    )}
                  >
                    {fil}
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/30 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:bg-muted/30">
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Cliente</th>
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Plano</th>
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Status da Assinatura</th>
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto">Última Fatura</th>
                    <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider h-auto text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-border/50">
                      {assinantes.map((ass) => {
                        const faturas = ass.faturas || []
                        const ultimaFatura = faturas[0] // Assume it's ordered by desc

                        return (
                          <tr key={ass.id} className="hover:bg-muted/30 transition-colors group border-border/50">
                            <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-muted overflow-hidden border border-border flex shrink-0 items-center justify-center text-muted-foreground text-xs font-bold uppercase">
                                {ass.cliente?.avatarUrl ? (
                                  <img src={ass.cliente.avatarUrl} className="h-full w-full object-cover" alt="" />
                                ) : (
                                  ass.cliente?.name?.substring(0,2)
                                )}
                              </div>
                              <div className="flex flex-col justify-center">
                                <p className="font-bold text-sm text-foreground truncate leading-tight m-0">{ass.cliente?.name}</p>
                                <p className="text-[11px] text-muted-foreground truncate leading-tight m-0">{ass.cliente?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="text-sm font-medium text-foreground">{ass.plano?.name}</span>
                          </td>
                          <td className="p-4">
                            {ass.endDate ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-muted text-muted-foreground border border-border/50">
                                Cancelado
                              </span>
                            ) : ass.isActive ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-500">
                                Ativo
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500">
                                Aguardando Pag.
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {ass.endDate ? (
                                <div className="flex flex-col">
                                    <span className="text-xs font-black uppercase tracking-tighter text-muted-foreground/40">
                                        Encerrado
                                    </span>
                                    <span className="text-[10px] font-bold text-muted-foreground/30">
                                        Sem cobranças
                                    </span>
                                </div>
                            ) : ultimaFatura ? (
                                <div className="flex flex-col">
                                    <span className={cn(
                                        "text-xs font-bold",
                                        ultimaFatura.status === 'PAGA' ? "text-emerald-500" :
                                        ultimaFatura.status === 'VENCIDA' ? "text-destructive" : "text-amber-500"
                                    )}>
                                        {ultimaFatura.status === 'PAGA' ? 'Paga' : 
                                         ultimaFatura.status === 'VENCIDA' ? 'Vencida' : 'Pendente'}
                                    </span>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Venc. {safeFormat(ultimaFatura.dataVencimento, "dd/MM/yyyy")}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-xs text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/planos/assinante/${ass.id}/historico`)}
                                className="transition-all font-bold text-xs text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl gap-2"
                              >
                                <History className="size-4" />
                                Histórico
                              </Button>
                            </div>
                          </td>
                        </tr>
                        )
                      })}

                  {assinantes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-muted-foreground text-sm font-medium">
                        Nenhum assinante encontrado com os filtros atuais.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Paginação do Card */}
            {totalAssinantes > 0 && (
              <div className="bg-muted/10 border-t border-border/50 px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  className="px-4 py-2 rounded-xl border border-border/60 bg-background text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                >
                  Anterior
                </button>
                <div className="flex items-center gap-2">
                   <div className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                      Página {page}
                   </div>
                   <span className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">
                      · {totalAssinantes} assinantes no total
                   </span>
                </div>
                <button
                  className="px-4 py-2 rounded-xl border border-border/60 bg-background text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </AdminLayout>
  )
}
