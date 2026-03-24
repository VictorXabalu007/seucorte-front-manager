import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Clock, 
  Coins, 
  Award, 
  ShieldAlert, 
  MapPin, 
  Phone, 
  Mail, 
  FileText,
  History,
  Scissors,
  Star,
  Edit2,
  TrendingUp,
  CreditCard,
  MessageSquare
} from "lucide-react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useLoading } from "@/components/loading-provider"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { clienteService } from "./services/cliente.service"
import type { Cliente } from "./types/cliente"
import { ClienteSheet } from "./components/ClienteSheet"
import { planoService } from "../planos/services/plano.service"
import type { Plano } from "../planos/types/plano"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

export default function ClienteProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { setIsLoading: setGlobalLoading } = useLoading()
  
  const [cliente, setCliente] = useState<any>(null)
  const [planos, setPlanos] = useState<Plano[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const loadData = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    try {
      const [clienteData, planosData] = await Promise.all([
        clienteService.getClienteProfile(id),
        planoService.getPlans()
      ])
      setCliente(clienteData)
      setPlanos(planosData)
    } catch (error) {
      console.error("Failed to load profile:", error)
      toast.error("Erro ao carregar perfil do cliente")
      navigate("/clientes")
    } finally {
      setIsLoading(false)
      setGlobalLoading(false)
    }
  }, [id, navigate, setGlobalLoading])

  useEffect(() => {
    loadData()
  }, [loadData])

  if (isLoading || !cliente) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
        </div>
      </AdminLayout>
    )
  }

  const handleSave = async (data: any) => {
    try {
      await clienteService.updateCliente(cliente.id, data)
      toast.success("Cliente atualizado com sucesso")
      loadData()
      setIsSheetOpen(false)
    } catch (error) {
      toast.error("Erro ao atualizar cliente")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                className="size-10 rounded-2xl border border-border bg-card/40 backdrop-blur-sm"
                onClick={() => navigate("/clientes")}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
                Perfil do Cliente
              </h1>
              <p className="text-muted-foreground font-medium text-xs sm:text-sm">
                Informações detalhadas e histórico.
              </p>
            </div>
          </div>
          
          <Button 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl px-6 font-bold shadow-lg shadow-primary/20 gap-2 h-11"
            onClick={() => setIsSheetOpen(true)}
          >
            <Edit2 className="size-4" />
            Editar Cadastro
          </Button>
        </div>

        {/* HEADER SECTION - PREMIUM CARD */}
        <div className="bg-card/40 backdrop-blur-md rounded-[32px] border border-border p-6 sm:p-8 flex flex-col md:flex-row gap-8 items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <User className="size-48 rotate-12" />
          </div>

          <div className="relative">
            <Avatar className="size-32 sm:size-40 rounded-[28px] border-4 border-background shadow-2xl">
              <AvatarImage src={cliente.avatarUrl} alt={cliente.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-4xl font-black">
                {cliente.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {cliente.isVip && (
              <div className="absolute -top-3 -right-3 bg-amber-500 border-4 border-background size-10 rounded-full flex items-center justify-center shadow-lg animate-bounce-slow">
                <Award className="size-5 text-white fill-white/20" />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-6 relative">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-4xl font-black tracking-tighter">{cliente.name}</h2>
                <Badge variant="outline" className={cn(
                  "rounded-full px-3 py-1 font-black uppercase tracking-widest text-[10px]",
                  cliente.type === 'pro' ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground"
                )}>
                  {cliente.type === 'pro' ? 'CLIENTE PRO' : 'CLIENTE AVULSO'}
                </Badge>
                {cliente.isBlocked && (
                  <Badge variant="destructive" className="rounded-full px-3 py-1 font-black uppercase tracking-widest text-[10px] gap-1">
                    <ShieldAlert className="size-3" />
                    Bloqueado
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground font-medium flex items-center gap-2">
                <Mail className="size-3.5" /> {cliente.email || 'Sem e-mail cadastrado'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Phone className="size-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Telefone</p>
                  <p className="text-sm font-bold tracking-tight">{cliente.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <MapPin className="size-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Localização</p>
                  <p className="text-sm font-bold tracking-tight">{cliente.city ? `${cliente.city}, ${cliente.state}` : 'Não informado'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                   <Calendar className="size-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Aniversário</p>
                  <p className="text-sm font-bold tracking-tight">{cliente.birthDate ? new Date(cliente.birthDate).toLocaleDateString('pt-BR') : '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS QUICK VIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border p-5 space-y-1">
            <Coins className="size-5 text-emerald-500 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Gasto</p>
            <p className="text-2xl font-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cliente.stats?.totalSpent || 0)}
            </p>
          </div>
          <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border p-5 space-y-1">
            <History className="size-5 text-primary mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Visitas Totais</p>
            <p className="text-2xl font-black tracking-tighter">{cliente.stats?.appointmentsCount || 0}</p>
          </div>
          <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border p-5 space-y-1">
            <TrendingUp className="size-5 text-blue-500 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Ticket Médio</p>
            <p className="text-2xl font-black tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cliente.stats?.appointmentsCount > 0 ? (cliente.stats.totalSpent / cliente.stats.appointmentsCount) : 0)}
            </p>
          </div>
          <div className="bg-card/40 backdrop-blur-md rounded-3xl border border-border p-5 space-y-1">
            <Star className="size-5 text-amber-500 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Frequência</p>
            <p className="text-2xl font-black tracking-tighter">
              {cliente.stats?.frequencia || 'Baixa'}
            </p>
          </div>
        </div>

        {/* DETAILED CONTENT */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="bg-card/40 border border-border rounded-2xl h-12 p-1 mb-8">
            <TabsTrigger value="history" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <History className="size-4" /> Histórico
            </TabsTrigger>
            <TabsTrigger value="services" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <Scissors className="size-4" /> Serviços
            </TabsTrigger>
            <TabsTrigger value="info" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <FileText className="size-4" /> Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded-xl px-6 font-bold text-xs gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <MessageSquare className="size-4" /> Notas Internas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="mt-0">
            <div className="bg-card/40 rounded-3xl border border-border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/40">
                  <TableRow className="border-border">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest py-5 px-8">Data</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Serviço</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Profissional</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Valor</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cliente.agendamentos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-bold">
                        Nenhum agendamento registrado.
                      </TableCell>
                    </TableRow>
                  ) : (
                    cliente.agendamentos.map((agto: any) => (
                      <TableRow key={agto.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 border-slate-100 dark:border-slate-800/60">
                        <TableCell className="py-4 px-8">
                          <div className="flex items-center gap-2">
                            <Clock className="size-3.5 text-slate-400" />
                            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                              {new Date(agto.startTime).toLocaleDateString('pt-BR')} {new Date(agto.startTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-black tracking-tight">{agto.service.name}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                             <Avatar className="size-6">
                                <AvatarFallback className="text-[10px] bg-primary/5">{agto.professional.user.name[0]}</AvatarFallback>
                             </Avatar>
                             <p className="text-xs font-bold">{agto.professional.user.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-xs font-black">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(agto.amount)}
                          </p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn(
                            "rounded-lg font-black uppercase tracking-widest text-[9px]",
                            agto.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
                            agto.status === 'CANCELLED' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" :
                            "bg-blue-500/10 text-blue-500 border-blue-500/20"
                          )}>
                            {agto.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="services" className="mt-0">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Aqui poderíamos listar os serviços que o cliente mais faz */}
                <div className="p-6 bg-card/40 rounded-3xl border border-border flex flex-col items-center text-center space-y-4">
                   <div className="size-16 rounded-2xl bg-primary/5 flex items-center justify-center">
                      <Scissors className="size-8 text-primary" />
                   </div>
                   <div>
                      <h4 className="font-black text-xl tracking-tight">Cabelo & Barba</h4>
                      <p className="text-muted-foreground text-xs font-medium">Serviço mais realizado</p>
                   </div>
                   <Badge className="bg-primary/10 text-primary border-primary/20">12 Visitas</Badge>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="info" className="mt-0">
             <div className="bg-card/40 rounded-3xl border border-border p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Informações Pessoais</h4>
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">CPF / CNPJ</p>
                            <p className="text-sm font-bold">{cliente.cpfCnpj || '-'}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">RG</p>
                            <p className="text-sm font-bold">{cliente.rg || '-'}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Gênero</p>
                            <p className="text-sm font-bold">{cliente.gender === 'M' ? 'Masculino' : cliente.gender === 'F' ? 'Feminino' : 'Outro'}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Endereço Completo</h4>
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Logradouro</p>
                            <p className="text-sm font-bold">{cliente.street ? `${cliente.street}, ${cliente.number}` : '-'}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Bairro</p>
                            <p className="text-sm font-bold">{cliente.neighborhood || '-'}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">CEP</p>
                            <p className="text-sm font-bold">{cliente.zip || '-'}</p>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-primary">Informações Adicionais</h4>
                      <div className="space-y-4">
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Observações</p>
                            <p className="text-sm font-medium italic">"{cliente.observations || 'Nenhuma observação.'}"</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Cadastrado em</p>
                            <p className="text-sm font-bold">{new Date(cliente.createdAt).toLocaleDateString('pt-BR')}</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="notes" className="mt-0">
             <div className="bg-card/40 rounded-3xl border border-border p-8 space-y-4">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                       <MessageSquare className="size-4 text-primary" />
                    </div>
                    <h4 className="font-bold tracking-tight">Notas Internas Confidenciais</h4>
                 </div>
                 <div className="min-h-[150px] p-6 bg-muted/20 rounded-2xl border border-border/5 text-sm font-medium leading-relaxed italic text-slate-400">
                    {cliente.internalNotes || 'Nenhuma nota interna registrada para este cliente. Use estas notas para informações que apenas a equipe deve visualizar.'}
                 </div>
                 <p className="text-[10px] font-bold text-muted-foreground/40 text-center">Essas notas nunca são exibidas para o cliente.</p>
             </div>
          </TabsContent>
        </Tabs>
      </div>

      <ClienteSheet 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSave={handleSave}
        cliente={cliente}
        planos={planos.map(p => ({ id: p.id, name: p.name }))}
      />
    </AdminLayout>
  )
}
