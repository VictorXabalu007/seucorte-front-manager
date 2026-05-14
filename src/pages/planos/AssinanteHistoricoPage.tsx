import React, { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { 
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  TrendingUp,
  History,
  User,
  Zap,
  Ban
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { planoService } from "./services/plano.service"
import { useLoading } from "@/components/loading-provider"
import { toast } from "sonner"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getUser } from "@/lib/auth"
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal"
import { Trash2 } from "lucide-react"

const FaturaCard = ({ fatura, handlePayFatura, handleDeleteFatura, isFutureMonth, isDuplicate, assinatura }: any) => {
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

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

  const venc = fatura.dataVencimento ? new Date(fatura.dataVencimento) : null;
  const mesExtenso = venc ? format(venc, "MMMM", { locale: ptBR }) : "";
  const ano = venc ? format(venc, "yyyy") : "";
  const shortId = fatura.id ? `#${fatura.id.slice(-5)}` : "";

  return (
    <div 
      className={cn(
        "group bg-card p-5 rounded-3xl border transition-all duration-300 relative overflow-hidden",
        fatura.status === 'PAGA' ? "border-emerald-500/20 bg-emerald-500/[0.04]" :
        fatura.status === 'VENCIDA' ? "border-destructive/20 bg-destructive/[0.02]" :
        isFutureMonth ? "border-primary/20 bg-primary/[0.02]" : "border-amber-500/20 bg-amber-500/[0.02]"
      )}
    >
      {/* Mês em destaque no fundo */}
      <div className="absolute -bottom-2 -right-2 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <h3 className="text-6xl font-black uppercase italic">{mesExtenso}</h3>
      </div>

      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "size-10 rounded-2xl flex items-center justify-center shadow-inner transition-transform group-hover:scale-110",
            fatura.status === 'PAGA' ? "bg-emerald-500/10 text-emerald-500" :
            fatura.status === 'VENCIDA' ? "bg-destructive/10 text-destructive" :
            isFutureMonth ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"
          )}>
            {fatura.status === 'PAGA' ? <CheckCircle2 className="size-5" /> : 
             fatura.status === 'VENCIDA' ? <AlertCircle className="size-5" /> : <Clock className="size-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Vencimento</p>
              <span className="text-[8px] font-mono text-muted-foreground/30">{shortId}</span>
            </div>
            <p className="text-sm font-bold uppercase">{mesExtenso} {ano}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{safeFormat(fatura.dataVencimento, "dd/MM/yyyy")}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={cn(
            "text-xl font-black tracking-tighter",
            fatura.status === 'PAGA' ? "text-emerald-500" :
            fatura.status === 'VENCIDA' ? "text-destructive" :
            isFutureMonth ? "text-primary" : "text-amber-500"
          )}>
            {formatMoney(Number(fatura.valor))}
          </p>
          <p className="text-[9px] font-black uppercase tracking-widest opacity-60">
            {fatura.status === 'PAGA' ? "Recebido" : "Esperado"}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-border/30 flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Status</p>
          <p className={cn(
            "text-[11px] font-black uppercase tracking-tighter",
            fatura.status === 'PAGA' ? "text-emerald-500" :
            fatura.status === 'VENCIDA' ? "text-destructive" :
            assinatura.endDate ? "text-muted-foreground/50" : "text-amber-500"
          )}>
            {fatura.status === 'PAGA' 
              ? `Pago em ${safeFormat(fatura.dataPagamento, "dd/MM/yy")}` 
              : assinatura.endDate 
                ? "Cobrança Suspensa"
                : fatura.status === 'VENCIDA' ? "Inadimplente" : isFutureMonth ? "Mês Futuro" : "Pendente"}
          </p>
        </div>
        
        {fatura.status !== 'PAGA' && !assinatura.endDate && (
          <div className="flex items-center gap-2 relative z-10">
            {isDuplicate && (
              <Button 
                onClick={() => handleDeleteFatura(fatura)}
                variant="ghost" 
                size="icon" 
                className="size-9 rounded-xl text-destructive hover:bg-destructive/10 transition-colors"
                title="Esta fatura parece ser uma duplicata. Clique para remover."
              >
                <Trash2 className="size-4" />
              </Button>
            )}
            
            <Button 
              onClick={() => handlePayFatura(fatura.id)}
              size="sm" 
              className={cn(
                "rounded-xl h-9 text-[10px] font-black uppercase tracking-widest px-4 shadow-sm",
                fatura.status === 'VENCIDA' ? "bg-destructive text-white hover:bg-destructive/90" : 
                isFutureMonth ? "bg-primary text-primary-foreground hover:bg-primary/90" :
                "bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              Pagar Agora
            </Button>
          </div>
        )}

        {isFutureMonth && (
          <div className="bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
            <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Faturamento futuro</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AssinanteHistoricoPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setIsLoading } = useLoading()
  
  const [assinatura, setAssinatura] = useState<any>(null)
  const [faturas, setFaturas] = useState<any[]>([])
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [faturaToDelete, setFaturaToDelete] = useState<any>(null)
  const [isDeleteFaturaModalOpen, setIsDeleteFaturaModalOpen] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const data = await planoService.getAssinatura(id)
      if (data) {
        setAssinatura(data)
        setFaturas(data.faturas || [])
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar histórico do assinante")
    } finally {
      setIsLoading(false)
    }
  }, [id, setIsLoading])

  useEffect(() => {
    loadData()
  }, [loadData])

  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)
  }

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

  const handlePayFatura = async (faturaId: string) => {
    try {
      setIsLoading(true)
      await planoService.payFatura(faturaId)
      toast.success("Pagamento registrado com sucesso!")
      loadData()
    } catch(err) {
      toast.error("Falha ao registrar pagamento")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateFatura = async () => {
    if (!id) return
    try {
      setIsLoading(true)
      await planoService.generateFatura(id)
      toast.success("Nova fatura gerada com sucesso!")
      loadData()
    } catch(err) {
      toast.error("Falha ao gerar nova fatura")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelSubscription = async () => {
    if (!id) return
    setIsCancelModalOpen(false)

    try {
      setIsLoading(true)
      await planoService.cancelAssinatura(id)
      toast.success("Assinatura cancelada com sucesso!")
      loadData()
    } catch(err) {
      toast.error("Falha ao cancelar assinatura")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteFaturaRequest = (fatura: any) => {
    setFaturaToDelete(fatura)
    setIsDeleteFaturaModalOpen(true)
  }

  const handleConfirmDeleteFatura = async () => {
    if (!faturaToDelete) return
    setIsDeleteFaturaModalOpen(false)

    try {
      setIsLoading(true)
      await planoService.deleteFatura(faturaToDelete.id)
      toast.success("Fatura duplicada removida com sucesso!")
      loadData()
    } catch(err: any) {
      const msg = err.response?.data?.message || err.message || "Falha ao excluir fatura"
      toast.error(msg)
    } finally {
      setIsLoading(false)
      setFaturaToDelete(null)
    }
  }

  const checkIsDuplicate = useCallback((fatura: any) => {
    if (fatura.status === 'PAGA') return false
    const date = fatura.dataVencimento ? new Date(fatura.dataVencimento) : null
    if (!date) return false

    return faturas.some(f => 
      f.id !== fatura.id && 
      f.dataVencimento && 
      new Date(f.dataVencimento).getMonth() === date.getMonth() &&
      new Date(f.dataVencimento).getFullYear() === date.getFullYear()
    )
  }, [faturas])

  if (!assinatura) return null

  const totalPago = faturas.filter(f => f.status === 'PAGA').reduce((acc, f) => acc + Number(f.valor), 0)
  const totalPendente = faturas.filter(f => f.status === 'PENDENTE' || f.status === 'VENCIDA').reduce((acc, f) => acc + Number(f.valor), 0)

  const agora = new Date();
  const fimDesteMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59);

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 pb-20">
        
        {/* Header Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/planos")}
              className="rounded-2xl bg-background border shadow-sm hover:scale-105 transition-all"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary bg-primary/10 px-2 py-0.5 rounded-md">Gestão de Assinante</span>
              </div>
              <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
                {assinatura.cliente?.name}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!assinatura.endDate && getUser()?.role === 'OWNER' && (
              <Button 
                variant="outline"
                onClick={() => setIsCancelModalOpen(true)}
                className="rounded-2xl h-12 px-6 font-black uppercase tracking-wider gap-2 border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all active:scale-95 shadow-sm"
              >
                <Ban className="size-5" /> Cancelar Assinatura
              </Button>
            )}

            <Button 
              onClick={handleGenerateFatura}
              className="rounded-2xl h-12 px-6 font-black uppercase tracking-wider gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95 bg-primary text-primary-foreground"
            >
              <Plus className="size-5" /> Gerar Nova Fatura
            </Button>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Subscriber Info */}
          <div className="md:col-span-2 bg-card/40 border border-border/50 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
              <User className="size-40" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Plano Atual</p>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                      <Zap className="size-5" />
                    </div>
                    <div>
                      <p className="text-xl font-black tracking-tight">{assinatura.plano?.name}</p>
                      <p className="text-xs font-bold text-primary">{formatMoney(Number(assinatura.plano?.price))} /mês</p>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Status da Assinatura</p>
                  {assinatura.endDate ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-widest border border-border/50">
                      <Ban className="size-3.5" /> Cancelada
                    </span>
                  ) : assinatura.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-widest">
                      <CheckCircle2 className="size-3.5" /> Ativa
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-xs font-black uppercase tracking-widest">
                      <Clock className="size-3.5" /> Aguardando Ativação
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Contato</p>
                  <p className="text-sm font-medium text-foreground">{assinatura.cliente?.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">{assinatura.cliente?.phone || "Sem telefone cadastrado"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Membro desde</p>
                  <p className="text-sm font-bold text-foreground">
                    {safeFormat(assinatura.createdAt, "dd 'de' MMMM 'de' yyyy")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group">
             <div className="absolute -bottom-6 -right-6 p-4 opacity-[0.05] group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                <TrendingUp className="size-32" />
             </div>
             
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary/60 mb-2">Total Investido</p>
                <h2 className="text-4xl font-black tracking-tighter text-primary">{formatMoney(totalPago)}</h2>
             </div>
             
             <div className="mt-8 pt-8 border-t border-primary/10">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 mb-2">Pendências Atuais</p>
                <p className={cn("text-xl font-black tracking-tight", totalPendente > 0 ? "text-amber-500" : "text-emerald-500")}>
                  {formatMoney(totalPendente)}
                </p>
             </div>
          </div>
        </div>

        {/* Invoice Sections */}
        <div className="space-y-12">
          
          {/* 1. Pendências e Vencidas (Inclui o mês atual) */}
          {faturas.some(f => f.status !== 'PAGA' && (f.status === 'VENCIDA' || !f.dataVencimento || new Date(f.dataVencimento) <= fimDesteMes)) && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm">
                   <AlertCircle className="size-4" />
                </div>
                <h2 className="text-xl font-black tracking-tight uppercase tracking-widest text-amber-500/80 text-sm">Contas em Aberto</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {faturas
                  .filter(f => f.status !== 'PAGA' && (f.status === 'VENCIDA' || !f.dataVencimento || new Date(f.dataVencimento) <= fimDesteMes))
                  .map((fatura) => (
                    <FaturaCard 
                      key={fatura.id} 
                      fatura={fatura} 
                      handlePayFatura={handlePayFatura} 
                      handleDeleteFatura={handleDeleteFaturaRequest}
                      isFutureMonth={false} 
                      isDuplicate={checkIsDuplicate(fatura)}
                      assinatura={assinatura} 
                    />
                  ))
                }
              </div>
            </div>
          )}

          {/* 2. Próximos Faturamentos (Meses seguintes) */}
          {faturas.some(f => f.status === 'PENDENTE' && f.dataVencimento && new Date(f.dataVencimento) > fimDesteMes) && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                   <Zap className="size-4" />
                </div>
                <h2 className="text-xl font-black tracking-tight uppercase tracking-widest text-primary/80 text-sm">Próximos Faturamentos</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {faturas
                  .filter(f => f.status === 'PENDENTE' && f.dataVencimento && new Date(f.dataVencimento) > fimDesteMes)
                  .map((fatura) => (
                    <FaturaCard 
                      key={fatura.id} 
                      fatura={fatura} 
                      handlePayFatura={handlePayFatura} 
                      handleDeleteFatura={handleDeleteFaturaRequest}
                      isFutureMonth={true} 
                      isDuplicate={checkIsDuplicate(fatura)}
                      assinatura={assinatura} 
                    />
                  ))
                }
              </div>
            </div>
          )}

          {/* 3. Histórico de Pagos */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shadow-sm">
                 <History className="size-4" />
              </div>
              <h2 className="text-xl font-black tracking-tight uppercase tracking-widest text-muted-foreground/60 text-sm">Histórico de Pagamentos</h2>
            </div>

            {faturas.filter(f => f.status === 'PAGA').length === 0 ? (
               <div className="py-10 text-center bg-card/20 rounded-3xl border border-dashed border-border/50">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">Nenhum pagamento registrado ainda.</p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {faturas
                  .filter(f => f.status === 'PAGA')
                  .map((fatura) => (
                    <FaturaCard 
                      key={fatura.id} 
                      fatura={fatura} 
                      handlePayFatura={handlePayFatura} 
                      handleDeleteFatura={handleDeleteFaturaRequest}
                      isFutureMonth={false} 
                      isDuplicate={checkIsDuplicate(fatura)}
                      assinatura={assinatura} 
                    />
                  ))
                }
              </div>
            )}
          </div>
        </div>


        {/* Modal de Confirmação de Exclusão de Fatura */}
        <DeleteConfirmationModal 
          isOpen={isDeleteFaturaModalOpen}
          onOpenChange={setIsDeleteFaturaModalOpen}
          onConfirm={handleConfirmDeleteFatura}
          title="Remover Fatura Duplicada"
          description="Esta fatura parece ser uma cobrança repetida para o mesmo mês. Deseja removê-la para limpar o histórico?"
          itemName={faturaToDelete ? `Fatura de ${format(new Date(faturaToDelete.dataVencimento), "MMMM/yyyy", { locale: ptBR })}` : ""}
          confirmLabel="Confirmar Remoção"
        />

        {/* Modal de Confirmação de Cancelamento */}
        <DeleteConfirmationModal 
          isOpen={isCancelModalOpen}
          onOpenChange={setIsCancelModalOpen}
          onConfirm={handleCancelSubscription}
          title="Cancelar Assinatura"
          description="Tem certeza que deseja cancelar esta assinatura? Esta ação desativará o acesso do cliente aos serviços do plano e cancelará faturas pendentes futuras."
          itemName={assinatura.cliente?.name}
          confirmLabel="Confirmar Cancelamento"
        />

      </div>
    </AdminLayout>
  )
}
