import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Plus, 
  CreditCard,
  CheckCircle2,
  Users,
  TrendingUp,
  User,
  Star,
  Search,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal"
import { PlanoSheet } from "./components/PlanoSheet"
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { planoService } from "./services/plano.service"
import { clienteService } from "../clientes/services/cliente.service"
import type { Plano } from "./types/plano"
import type { Cliente } from "../clientes/types/cliente"
import { useLoading } from "@/components/loading-provider"
import { getActiveUnidadeId } from "@/lib/auth"
import { toast } from "sonner"

export default function PlanosPage() {
  const { setIsLoading } = useLoading()
  const unidadeId = getActiveUnidadeId()
  const [planos, setPlanos] = useState<Plano[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isInternalLoading, setIsInternalLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)
  const [memberSearch, setMemberSearch] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [planoToDelete, setPlanoToDelete] = useState<Plano | null>(null)
  const [isPlanoSheetOpen, setIsPlanoSheetOpen] = useState(false)
  const [planoToEdit, setPlanoToEdit] = useState<Plano | null>(null)

  useEffect(() => {
    const loadData = async () => {
      if (!unidadeId) return

      setIsLoading(true)
      setIsInternalLoading(true)
      try {
        const [planosData, clientesData] = await Promise.all([
          planoService.getPlans(unidadeId),
          clienteService.getClientes({ unidadeId })
        ])
        setPlanos(planosData)
        setClientes(clientesData.data || [])
      } catch (error) {
        console.error("Failed to load planos data:", error)
        toast.error("Erro ao carregar dados dos planos")
      } finally {
        setIsLoading(false)
        setIsInternalLoading(false)
      }
    }

    loadData()
  }, [unidadeId])

  const getClientesInPlan = (planId: string) => {
    return clientes.filter((c: Cliente) => 
      c.assinaturas?.some(a => a.plano.id === planId && a.isActive)
    )
  }

  const selectedPlan = planos.find((p: Plano) => p.id === selectedPlanId)
  const filteredMembers = getClientesInPlan(selectedPlanId || "").filter((c: Cliente) => 
    c.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(memberSearch.toLowerCase())
  )

  const handleDeleteClick = (plano: Plano) => {
    setPlanoToDelete(plano)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!planoToDelete) return
    
    try {
      await planoService.deletePlan(planoToDelete.id)
      setPlanos(prev => prev.filter(p => p.id !== planoToDelete.id))
      toast.success("Plano excluído com sucesso")
    } catch (error) {
      console.error("Failed to delete plano:", error)
      toast.error("Erro ao excluir plano")
    } finally {
      setIsDeleteModalOpen(false)
      setPlanoToDelete(null)
    }
  }

  const handleEditClick = (plano: Plano) => {
    setPlanoToEdit(plano)
    setIsPlanoSheetOpen(true)
  }

  const handleNewClick = () => {
    setPlanoToEdit(null)
    setIsPlanoSheetOpen(true)
  }

  const handleSavePlano = async (data: any) => {
    try {
      if (planoToEdit) {
        // Edit mode
        const updated = await planoService.updatePlan(planoToEdit.id, data)
        setPlanos(prev => prev.map(p => p.id === planoToEdit.id ? updated : p))
        toast.success("Plano atualizado com sucesso")
      } else {
        // Create mode
        const created = await planoService.createPlan({ ...data, unidadeId: unidadeId! })
        setPlanos(prev => [created, ...prev])
        toast.success("Plano criado com sucesso")
      }
      setIsPlanoSheetOpen(false)
      setPlanoToEdit(null)
    } catch (error) {
      console.error("Failed to save plano:", error)
      toast.error("Erro ao salvar plano")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Planos de Assinatura
            </h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm mt-1">
              Fidelize seus clientes com recorrência.
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              size="sm" 
              className="flex-1 sm:flex-none h-11 sm:h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 font-bold transition-all shadow-lg shadow-primary/20 gap-2 border-0"
              onClick={handleNewClick}
            >
              <Plus className="size-4 stroke-[3px]" />
              <span className="hidden xs:inline">Criar Novo Plano</span>
              <span className="xs:hidden">Novo Plano</span>
            </Button>
          </div>
        </div>

        {/* Planos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {isInternalLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 sm:h-96 rounded-3xl border-2 border-dashed border-border flex items-center justify-center animate-pulse bg-muted/20" />
            ))
          ) : planos.length > 0 ? (
            planos.map((plano: Plano) => {
              const planClientes = getClientesInPlan(plano.id)
              return (
                <div key={plano.id} className="bg-card/40 rounded-3xl border border-border shadow-sm overflow-hidden backdrop-blur-sm flex flex-col group hover:border-primary/30 transition-all">
                  <div className="p-5 sm:p-6 space-y-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div className="size-10 sm:size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                        <CreditCard className="size-5 sm:size-6" />
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "rounded-lg font-bold text-[10px] sm:text-xs",
                          plano.isActive 
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-transparent"
                            : "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-transparent"
                        )}
                      >
                        {plano.isActive ? "Ativo" : "Pausado"}
                      </Badge>
                    </div>
                    
                    <div>
                      <h2 className="text-lg sm:text-xl font-black tracking-tight">{plano.name}</h2>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-xl sm:text-2xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plano.price)}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">/mês</span>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-3 leading-relaxed line-clamp-2">
                        {plano.description}
                      </p>
                    </div>

                    <div className="space-y-2 pt-2 sm:pt-4">
                      {plano.features.slice(0, 3).map((feature: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2.5">
                          <CheckCircle2 className="size-3.5 sm:size-4 text-primary shrink-0" />
                          <span className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 sm:pt-6 mt-auto border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="size-3.5 sm:size-4 text-muted-foreground" />
                          <span className="text-[10px] sm:text-xs font-bold text-foreground">
                            {planClientes.length} {planClientes.length === 1 ? 'membro' : 'membros'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="size-3 text-emerald-500" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase">+12%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 bg-muted/30 border-t border-border/50 flex items-center justify-between">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 sm:h-9 text-[10px] sm:text-xs font-bold text-slate-500 hover:text-foreground"
                      onClick={() => {
                        setSelectedPlanId(plano.id)
                        setIsSheetOpen(true)
                        setMemberSearch("")
                      }}
                    >
                      Ver Membros
                    </Button>
                    <div className="flex items-center gap-0.5">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 rounded-lg"
                        onClick={() => handleEditClick(plano)}
                      >
                        <Edit2 className="size-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="size-8 rounded-lg hover:text-destructive"
                        onClick={() => handleDeleteClick(plano)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6 bg-card/20 rounded-3xl border-2 border-dashed border-border/50 backdrop-blur-sm">
              <div className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary rotate-3 transform transition-transform hover:rotate-0">
                <CreditCard className="size-10" />
              </div>
              <div className="space-y-2 max-w-sm px-4">
                <h3 className="text-2xl font-black tracking-tight">Nenhum plano cadastrado</h3>
                <p className="text-muted-foreground font-medium text-sm">
                  Você ainda não criou nenhum plano de assinatura para seus clientes. Comece agora mesmo!
                </p>
              </div>
              <Button 
                onClick={handleNewClick}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-8 font-bold shadow-lg shadow-primary/20 gap-2 h-11"
              >
                <Plus className="size-5 stroke-[3px]" />
                Criar Meu Primeiro Plano
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Members Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full sm:max-w-md rounded-l-2xl border-l border-border bg-card/95 backdrop-blur-md">
          <SheetHeader className="pb-6 border-b border-border/50">
            <SheetTitle className="text-2xl font-black tracking-tighter flex items-center gap-2">
              <Users className="size-6 text-primary" />
              Membros do Plano
            </SheetTitle>
            <SheetDescription className="font-medium">
              {selectedPlan?.name} • {filteredMembers.length} clientes encontrados
            </SheetDescription>
          </SheetHeader>

          <div className="pt-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                placeholder="Filtrar por nome ou e-mail..."
                className="pl-10 h-10 bg-muted/50 border-transparent rounded-xl text-sm"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
              {filteredMembers.length === 0 ? (
                <div className="py-12 text-center space-y-2">
                  <div className="size-12 rounded-2xl bg-muted mx-auto flex items-center justify-center text-muted-foreground">
                    <Search className="size-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-500">Nenhum membro encontrado</p>
                </div>
              ) : filteredMembers.map((cliente: Cliente) => (
                <div key={cliente.id} className="p-3 rounded-2xl bg-muted/30 border border-border/50 flex items-center gap-3 group hover:bg-muted/50 transition-all">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <User className="size-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate tracking-tight">{cliente.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{cliente.email}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="size-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Plano"
        description="Você tem certeza que deseja excluir este plano? Clientes vinculados a este plano perderão seus benefícios imediatamente."
        itemName={planoToDelete?.name}
      />

      <PlanoSheet 
        isOpen={isPlanoSheetOpen}
        onOpenChange={setIsPlanoSheetOpen}
        onSave={handleSavePlano}
        plano={planoToEdit}
      />
    </AdminLayout>
  )
}
