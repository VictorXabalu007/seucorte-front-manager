import { useState, useEffect, useMemo } from "react"
import { Check, X, Plus, Trash2, DollarSign, CreditCard, ShoppingCart, Ticket, Info, Loader2, RefreshCw } from "lucide-react"

import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { MoneyInput } from "@/components/ui/money-input"
import type { Appointment, Service } from "../types"
import { cn } from "@/lib/utils"
import { ServicePickerModal } from "./ServicePickerModal"
import { toast } from "sonner"

interface CartItem {
  id: string
  serviceId: string
  name: string
  price: number
  isPlano: boolean
}

interface CheckoutSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  services: Service[]
  onCheckout: (data: {
    status: 'COMPLETED'
    paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED'
    amount: number
    servicos: { serviceId: string; price: number; isPlano: boolean }[]
    assinaturaId?: string | null
  }) => Promise<void>
  onUpdateServices: (id: string, servicos: any[]) => Promise<void>
}

export function CheckoutSheet({
  isOpen, onOpenChange, appointment, services, onCheckout, onUpdateServices,
}: CheckoutSheetProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentStatus, setPaymentStatus] = useState<'PAID' | 'PENDING' | 'REFUNDED'>("PAID")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  // Get active subscription
  const activeAssinatura = useMemo(() => {
    return appointment?.cliente?.assinaturas?.find(a => a.isActive)
  }, [appointment])

  const checkPlanCoverage = (serviceId: string) => {
    if (!activeAssinatura) return null
    const isCovered = activeAssinatura.plano.servicos.some((s: any) => s.id === serviceId)
    if (!isCovered) return null
    
    return { planName: activeAssinatura.plano.name }
  }

  // Initialize cart with the primary service(s) already in the appointment
  useEffect(() => {
    if (isOpen && appointment) {
      // Só inicializamos o carrinho se ele estiver vazio ou se o agendamento mudou
      const isNewAppointment = cart.length === 0 || cart.some(item => !appointment.servicos?.find((s: any) => s.id === item.id) && item.id !== "primary" && !item.id.startsWith("extra-"))
      
      if (cart.length === 0) {
        if (appointment.servicos && appointment.servicos.length > 0) {
          setCart(
            appointment.servicos.map((s: any, idx: number) => {
              const planInfo = checkPlanCoverage(s.serviceId)
              const isCovered = !!planInfo || s.isPlano
              return {
                id: s.id || `temp-${idx}`,
                serviceId: s.serviceId,
                name: s.service?.name || "Serviço",
                price: isCovered ? 0 : Number(s.price),
                isPlano: isCovered,
              }
            })
          )
        } else {
          const found = services.find(s => s.id === appointment.serviceId)
          if (found) {
            const planInfo = checkPlanCoverage(found.id)
            setCart([{
              id: "primary",
              serviceId: found.id,
              name: found.name,
              price: planInfo ? 0 : Number(appointment.amount || found.price),
              isPlano: !!planInfo,
            }])
          } else {
            setCart([])
          }
        }
        setPaymentStatus(appointment.paymentStatus === "PENDING" ? "PAID" : appointment.paymentStatus)
      }
    } else {
      setCart([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, appointment?.id]) // Rodar apenas quando abrir ou mudar o ID do agendamento

  const totalAmount = useMemo(() => cart.reduce((acc, item) => acc + item.price, 0), [cart])

  const handleConfirmSelection = async (selectedServices: Service[]) => {
    if (!appointment) return
    setIsUpdating(true)
    try {
      // Preparamos a nova lista de serviços mantendo os que já estão no carrinho se possível
      // ou apenas gerando a nova lista conforme selecionado no modal
      const newServicos = selectedServices.map(svc => {
        const planInfo = checkPlanCoverage(svc.id)
        return {
          serviceId: svc.id,
          price: planInfo ? 0 : Number(svc.price),
          isPlano: !!planInfo,
        }
      })

      await onUpdateServices(appointment.id, newServicos)
      
      // Atualizamos o carrinho localmente para refletir IMEDIATAMENTE na UI
      setCart(selectedServices.map(svc => {
        const planInfo = checkPlanCoverage(svc.id)
        const isCovered = !!planInfo
        return {
          id: `extra-${Date.now()}-${svc.id}`,
          serviceId: svc.id,
          name: svc.name,
          price: isCovered ? 0 : Number(svc.price),
          isPlano: isCovered,
        }
      }))

      toast.success("Serviços atualizados!")
    } catch {
      toast.error("Erro ao sincronizar serviços")
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveService = async (idToRemove: string) => {
    if (!appointment) return
    
    const itemToRemove = cart.find(item => item.id === idToRemove)
    // Se for o serviço virtual ou se tivermos apenas 1 serviço REAL, não deixamos vazio se não houver auto-save
    // Mas o usuário quer apagar e pronto. 
    
    setIsUpdating(true)
    try {
      const remainingItems = cart.filter(item => item.id !== idToRemove)
      const servicosPayload = remainingItems
        .filter(item => item.serviceId) // Filtramos o 'virtual' se existir
        .map(item => ({
          serviceId: item.serviceId,
          price: item.price,
          isPlano: item.isPlano,
        }))

      await onUpdateServices(appointment.id, servicosPayload)
      setCart(prev => prev.filter(item => item.id !== idToRemove))
    } catch {
      toast.error("Erro ao remover serviço")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePriceChange = (id: string, newPrice: number) => {
    setCart(prev => prev.map(item => item.id === id ? { ...item, price: newPrice } : item))
  }

  const handleConfirm = async () => {
    if (cart.length === 0) return
    setIsSubmitting(true)
    try {
      await onCheckout({
        status: "COMPLETED",
        paymentStatus,
        amount: totalAmount,
        servicos: cart.map(c => ({
          serviceId: c.serviceId,
          price: c.price,
          isPlano: c.isPlano,
        })),
        assinaturaId: cart.some(c => c.isPlano) ? activeAssinatura?.id : null,
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-md overflow-y-auto rounded-l-2xl flex flex-col">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-xl font-bold flex items-center gap-2 text-primary">
            <ShoppingCart className="size-5" />
            Finalizar (PDV)
          </SheetTitle>
          <div className="bg-background/50 rounded-xl p-3 border border-border">
            <p className="text-sm font-bold text-foreground">{appointment?.clientName}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Barbeiro: {appointment?.professionalName}</p>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-2 pr-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-left">Itens do Atendimento</p>
              {isUpdating && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary animate-pulse">
                  <RefreshCw className="size-2.5 animate-spin" />
                  <span className="text-[9px] font-bold uppercase">Sincronizando</span>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsPickerOpen(true)}
              className="h-7 text-xs font-bold text-primary hover:bg-primary/10 border-none px-2 rounded-lg"
            >
              <Plus className="size-3 mr-1" /> Adicionar Serviços
            </Button>
          </div>

          <div className="space-y-2">
            {cart.map((item, idx) => (
              <div key={item.id} className={cn(
                "bg-background/40 border rounded-xl p-3 flex flex-col gap-2 relative group",
                !item.serviceId ? "border-amber-500/50 bg-amber-500/5 animate-pulse" : "border-border"
              )}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "flex items-center justify-center size-5 rounded-full text-[10px] font-bold",
                      !item.serviceId ? "bg-amber-500/20 text-amber-500" : "bg-primary/20 text-primary"
                    )}>
                      {idx + 1}
                    </span>
                    <span className={cn(
                      "font-bold text-sm",
                      !item.serviceId ? "text-amber-600 italic" : "text-foreground"
                    )}>
                      {item.name} {!item.serviceId && "(Vincule um serviço)"}
                    </span>
                  </div>
                  {(cart.length > 1 || !item.serviceId) && (
                    <Button
                      variant="ghost" size="icon"
                      className="size-6 text-muted-foreground opacity-50 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 -mr-1"
                      onClick={() => handleRemoveService(item.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2 pl-7">
                  <Label className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Preço</Label>
                  <MoneyInput
                    value={item.price}
                    onChange={(val) => handlePriceChange(item.id, val)}
                    className="h-8 text-sm focus-visible:ring-0 bg-card/50"
                    disabled={item.isPlano}
                  />
                </div>
                {item.isPlano && (
                  <div className="absolute top-3 right-10 flex items-center gap-1.5 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-primary">
                    <Ticket className="size-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Do Plano</span>
                  </div>
                )}
                {!item.serviceId && (
                   <div className="flex items-start gap-2 mt-1 pl-7 text-[10px] text-amber-600 font-bold leading-tight">
                      <Info className="size-3 shrink-0" />
                      <span>Este serviço não possui ID. Remova-o e adicione um serviço real acima para finalizar o pagamento.</span>
                   </div>
                )}
              </div>
            ))}
          </div>

          {activeAssinatura && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <CreditCard className="size-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground leading-none">{activeAssinatura.plano.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">Assinatura Ativa e coberta pelo plano.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-auto pt-6 border-t border-border space-y-4 pb-2">
          {/* Valor Total */}
          <div className="flex flex-col gap-1 items-end">
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Total a Pagar</p>
            <p className="text-3xl font-black text-emerald-500 tracking-tight">
              {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(totalAmount)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SheetClose asChild>
              <Button type="button" variant="outline" className="w-full border-border font-bold">Cancelar</Button>
            </SheetClose>
            <Button
              onClick={handleConfirm}
              disabled={isSubmitting || cart.length === 0 || cart.some(i => !i.serviceId)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black"
            >
              {isSubmitting ? "Finalizando..." : "Concluir (Pago)"}
            </Button>
          </div>
        </div>
      </SheetContent>

      <ServicePickerModal
        isOpen={isPickerOpen}
        onOpenChange={setIsPickerOpen}
        services={services}
        alreadySelectedIds={cart.map(i => i.serviceId).filter(Boolean)}
        onConfirm={handleConfirmSelection}
      />
    </Sheet>
  )
}
