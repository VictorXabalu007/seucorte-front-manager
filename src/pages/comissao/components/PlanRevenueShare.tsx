import { useState } from "react"
import { CreditCard, Calculator, DollarSign, Ticket, CheckCircle2, Loader2, Settings as SettingsIcon, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Link } from "react-router-dom"
import { comissoesService } from "@/services/comissoes.service"
import { Switch } from "@/components/ui/switch"

interface RepasseBarbeiro {
  professionalId: string
  nome: string
  avatar: string | null
  fichas: number
  percentual: number
  valor: number
  isPago: boolean
  revenueShareEnabled?: boolean
}

interface RepasseData {
  isCalculated: boolean
  receitaTotal: number
  margemDono: number
  valorDistribuido: number
  fichaTotalMes: number
  planRevenueShareEnabled: boolean
  planOwnerMargin: number
  barbeiros: RepasseBarbeiro[]
}

interface PlanRevenueShareProps {
  unidadeId: string
  month: number
  year: number
  data: RepasseData | null
  onRefresh: () => void
}

const fmt = (v: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

export function PlanRevenueShare({ unidadeId, month, year, data, onRefresh }: PlanRevenueShareProps) {
  const [loading, setLoading] = useState(false)

  if (!data) return null

  const allPaid = data.barbeiros.length > 0 && data.barbeiros.every(b => b.isPago)

  const handleCalcular = async () => {
    setLoading(true)
    try {
      await comissoesService.calcularRepasse({ unidadeId, month, year })
      toast.success("Repasse calculado com sucesso!")
      onRefresh()
    } catch {
      toast.error("Erro ao calcular repasse.")
    } finally {
      setLoading(false)
    }
  }

  const handleLiquidar = async () => {
    setLoading(true)
    try {
      const res = await comissoesService.liquidarRepasse({ unidadeId, month, year })
      toast.success(`${res.liquidadas} repasse(s) liquidado(s)!`)
      onRefresh()
    } catch {
      toast.error("Erro ao liquidar repasse.")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleRateio = async (professionalId: string, enabled: boolean) => {
    try {
      await comissoesService.toggleBarberRevenueShare(professionalId, enabled)
      toast.success(`Rateio ${enabled ? 'ativado' : 'desativado'} para o barbeiro!`)
      onRefresh()
    } catch {
      toast.error("Erro ao alterar status do rateio.")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Ticket className="size-4 text-amber-500" />
          </div>
          <h2 className="text-xl font-black tracking-tight">Repasse de Planos</h2>
          {data.isCalculated && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              Calculado
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
           <Link to="/configuracoes">
             <Button variant="outline" size="sm" className="h-9 rounded-xl gap-2 font-bold text-xs border-border/50">
               <SettingsIcon className="size-3.5" />
               Configurar Rateio
             </Button>
           </Link>
        </div>
      </div>

      {!data.planRevenueShareEnabled ? (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8 text-center space-y-4 shadow-inner">
          <div className="size-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-600 mx-auto mb-4">
            <SettingsIcon className="size-8" />
          </div>
          <h3 className="text-xl font-black tracking-tight text-amber-900 dark:text-amber-100">Rateio de Planos Desativado</h3>
          <p className="text-amber-700/70 dark:text-amber-400/70 max-w-md mx-auto text-sm leading-relaxed font-medium">
            O sistema de rateio proporcional está desligado nas configurações da barbearia. Ative-o para distribuir a receita das assinaturas.
          </p>
          <Link to="/configuracoes" className="inline-block pt-2">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-black uppercase tracking-wider px-8 h-12 rounded-2xl shadow-lg shadow-amber-500/20 transition-all border-0">
              Ir para Configurações
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-border/50">
             <div className="flex items-center gap-3">
                 <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground shadow-sm">
                   <Percent className="size-5" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Margem da Barbearia (%)</p>
                    <p className="text-lg font-black text-foreground">{data.planOwnerMargin}%</p>
                 </div>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-2 flex items-center gap-3">
                 <div className="size-2 rounded-full bg-amber-500 animate-pulse"></div>
                 <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider leading-tight">
                   O percentual é calculado sobre a receita total de<br/>assinaturas antes da distribuição.
                 </p>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-1">
            <div className="bg-background/50 rounded-xl p-4 border border-border/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Receita Bruta (Assinaturas)</p>
              <p className="text-2xl font-black text-foreground mt-1">{fmt(data.receitaTotal)}</p>
            </div>
            <div className="bg-background/50 rounded-xl p-4 border border-border/50">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Margem Retida</p>
              <p className="text-2xl font-black text-amber-500 mt-1">- {fmt(data.margemDono)}</p>
            </div>
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Saldo a Distribuir</p>
              <p className="text-2xl font-black text-primary mt-1">{fmt(data.valorDistribuido)}</p>
              <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tight">{data.fichaTotalMes} fichas totais no período</p>
            </div>
          </div>

          {/* Tabela de Barbeiros */}
          {data.barbeiros.length > 0 && (
            <div className="overflow-x-auto pt-2">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Barbeiro</th>
                    <th className="text-center py-3 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Participação</th>
                    <th className="text-center py-3 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fichas</th>
                    <th className="text-center py-3 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">% Proporcional</th>
                    <th className="text-right py-3 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Valor Repasse</th>
                    <th className="text-center py-3 px-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.barbeiros.map((b) => (
                    <tr key={b.professionalId} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-2">
                        <div className={`flex items-center gap-2 ${b.revenueShareEnabled === false ? 'opacity-50 grayscale' : ''}`}>
                          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {b.nome.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-foreground leading-tight">{b.nome}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-2">
                        <Switch 
                          checked={b.revenueShareEnabled !== false}
                          onCheckedChange={(checked) => handleToggleRateio(b.professionalId, checked)}
                          disabled={data.isCalculated}
                        />
                      </td>
                      <td className="text-center py-3 px-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg ${b.revenueShareEnabled === false ? 'bg-muted text-muted-foreground' : 'bg-amber-500/10 text-amber-500'} text-xs font-bold`}>
                          <Ticket className="size-3" />
                          {b.fichas}
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-bold text-muted-foreground">{b.percentual.toFixed(1)}%</td>
                      <td className={`text-right py-3 px-2 font-black text-foreground ${b.revenueShareEnabled === false ? 'opacity-50' : ''}`}>
                        {fmt(b.valor)}
                      </td>
                      <td className="text-center py-3 px-2">
                        {b.revenueShareEnabled === false ? (
                          <span className="text-muted-foreground text-[10px] font-bold uppercase">-</span>
                        ) : b.isPago ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">
                            <CheckCircle2 className="size-3" /> Pago
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase">
                            Pendente
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {data.barbeiros.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm flex flex-col items-center gap-2">
              <Ticket className="size-8 opacity-20" />
              <p className="font-bold">Nenhuma ficha foi utilizada neste mês.</p>
              <p className="text-[10px] uppercase">Finalize atendimentos de planos para gerar fichas.</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border/50">
            {(!data.isCalculated || true) && data.barbeiros.length > 0 && (
              <Button
                onClick={handleCalcular}
                disabled={loading}
                className="bg-primary text-primary-foreground font-black uppercase tracking-wider text-xs shadow-lg shadow-primary/20 h-11"
              >
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <Calculator className="size-4 mr-2" />}
                {data.isCalculated ? "Recalcular Rateio" : "Calcular Repasse Mensal"}
              </Button>
            )}
            {data.isCalculated && !allPaid && (
              <Button
                onClick={handleLiquidar}
                disabled={loading}
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-wider text-xs shadow-lg shadow-emerald-500/20 h-11"
              >
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <DollarSign className="size-4 mr-2" />}
                Liquidar Repasses do Mês
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
