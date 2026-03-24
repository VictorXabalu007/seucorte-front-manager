import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Filter, 
  Plus, 
  Search,
  Users,
  Star,
  User,
  TrendingUp,
  Coins,
  Award,
  ChevronRight,
  ShieldAlert,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal"
import { ClienteSheet } from "./components/ClienteSheet"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { clienteService } from "./services/cliente.service"
import { planoService } from "../planos/services/plano.service"
import type { Cliente } from "./types/cliente"
import type { Plano } from "../planos/types/plano"
import { useLoading } from "@/components/loading-provider"
import { getActiveUnidadeId } from "@/lib/auth"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "@/hooks/use-debounce"
import { toast } from "sonner"

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  return (
    <div className="bg-card/40 backdrop-blur-md border border-border p-5 rounded-3xl space-y-3 hover:border-primary/20 transition-all group">
      <div className="flex items-center justify-between">
        <div className={cn("p-2.5 rounded-2xl", color)}>
          <Icon className="size-5" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
            <TrendingUp className="size-3" />
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</p>
        <p className="text-2xl font-black tracking-tighter mt-1">{value}</p>
      </div>
    </div>
  )
}

export default function ClientesPage() {
  const navigate = useNavigate()
  const { setIsLoading } = useLoading()
  const unidadeId = getActiveUnidadeId()
  
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isInternalLoading, setIsInternalLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearch = useDebounce(searchTerm, 500)
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalItems, setTotalItems] = useState(0)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState<Cliente | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [clienteToEdit, setClienteToEdit] = useState<Cliente | null>(null)
  const itemsPerPage = 8

  const loadData = async () => {
    if (!unidadeId) {
      setIsLoading(false)
      return
    }
    setIsInternalLoading(true)
    try {
      const [clientesRes, planosData, statsData] = await Promise.all([
        clienteService.getClientes({ 
          unidadeId, 
          search: debouncedSearch, 
          page: currentPage, 
          limit: itemsPerPage 
        }),
        planoService.getPlans(),
        clienteService.getStats(unidadeId)
      ])
      setClientes(clientesRes.data)
      setTotalPages(clientesRes.pages)
      setTotalItems(clientesRes.total)
      setPlanos(planosData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load clientes data:", error)
      toast.error("Erro ao carregar dados dos clientes")
    } finally {
      setIsInternalLoading(false)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [unidadeId, debouncedSearch, currentPage])

  const getPlanName = (cliente: Cliente) => {
    if (cliente.assinaturas && cliente.assinaturas.length > 0) {
      return cliente.assinaturas[0].plano.name
    }
    return "-"
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }

  const handleDeleteClick = (cliente: Cliente) => {
    setClienteToDelete(cliente)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!clienteToDelete) return
    
    try {
      await clienteService.deleteCliente(clienteToDelete.id)
      toast.success("Cliente excluído com sucesso")
      loadData()
      setIsDeleteModalOpen(false)
      setClienteToDelete(null)
    } catch (error) {
      toast.error("Erro ao excluir cliente")
    }
  }

  const handleEditClick = (cliente: Cliente) => {
    setClienteToEdit(cliente)
    setIsSheetOpen(true)
  }

  const handleNewClick = () => {
    setClienteToEdit(null)
    setIsSheetOpen(true)
  }

  const handleSaveCliente = async (data: any) => {
    try {
      if (clienteToEdit) {
        await clienteService.updateCliente(clienteToEdit.id, data)
        toast.success("Cliente atualizado com sucesso")
      } else {
        await clienteService.createCliente({ ...data, unidadeId })
        toast.success("Cliente cadastrado com sucesso")
      }
      loadData()
      setIsSheetOpen(false)
      setClienteToEdit(null)
    } catch (error) {
      toast.error("Erro ao salvar cliente")
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8 pb-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Gestão de Clientes
            </h1>
            <p className="text-muted-foreground font-medium text-xs sm:text-sm mt-1">
              Base de clientes e assinaturas.
            </p>
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button 
              size="sm" 
              className="flex-1 sm:flex-none h-11 sm:h-9 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 font-bold transition-all shadow-lg shadow-primary/20 gap-2 border-0"
              onClick={handleNewClick}
            >
              <Plus className="size-4 stroke-[3px]" />
              <span className="hidden xs:inline">Novo Cliente</span>
              <span className="xs:hidden">Novo</span>
            </Button>
          </div>
        </div>

        {/* KPI DASHBOARD */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Total de Clientes" 
            value={stats?.total || 0} 
            icon={Users} 
            color="bg-primary/10 text-primary" 
          />
          <StatCard 
            title="Clientes VIP" 
            value={stats?.vipTotal || 0} 
            icon={Award} 
            trend="+5%" 
            color="bg-amber-500/10 text-amber-500" 
          />
          <StatCard 
            title="Faturamento (Total)" 
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.totalRevenue || 0)} 
            icon={Coins} 
            color="bg-emerald-500/10 text-emerald-500" 
          />
          <StatCard 
            title="Média por Cliente" 
            value={new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats?.avgSpent || 0)} 
            icon={TrendingUp} 
            color="bg-blue-500/10 text-blue-500" 
          />
        </div>

        <div className="bg-card/40 rounded-3xl border border-border shadow-sm overflow-hidden backdrop-blur-sm">
          <div className="p-4 sm:p-6 border-b border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 bg-muted/30">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Select 
                value={typeFilter}
                onValueChange={(value) => {
                  setTypeFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full md:w-44 h-11 sm:h-9 rounded-xl bg-background/50 border-border/50 font-bold text-xs ring-offset-0 focus:ring-1 focus:ring-primary/30">
                  <SelectValue placeholder="Todos Tipos" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-md">
                  <SelectItem value="all" className="text-xs font-bold">Todos Tipos</SelectItem>
                  <SelectItem value="customer" className="text-xs font-bold">Cliente Avulso</SelectItem>
                  <SelectItem value="pro" className="text-xs font-bold">Cliente PRO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input 
                  placeholder="Buscar clientes..." 
                  className="pl-10 h-11 sm:h-9 bg-background/50 border-transparent rounded-xl text-xs font-medium focus:ring-1 focus:ring-primary/30" 
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="icon" className="h-11 sm:h-9 w-11 sm:w-9 rounded-xl border-border shrink-0">
                <Filter className="size-4 text-slate-500" />
              </Button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border">
                  <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-widest py-5 px-8">Cliente</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Tipo</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Plano Ativo</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Última Visita</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right py-5 px-8 text-[10px] font-black uppercase tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isInternalLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-bold">
                      Carregando clientes...
                    </TableCell>
                  </TableRow>
                ) : clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-slate-500 font-bold">
                      Nenhum cliente encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-slate-100 dark:border-slate-800/60">
                      <TableCell className="py-4 px-8">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "size-10 rounded-xl flex items-center justify-center transition-colors relative",
                            cliente.type === 'pro' 
                              ? "bg-primary/10 text-primary" 
                              : "bg-muted text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
                          )}>
                            {cliente.type === 'pro' ? <Star className="size-5 fill-primary" /> : <User className="size-5" />}
                            {cliente.isVip && (
                              <div className="absolute -top-1 -right-1 bg-amber-500 border-2 border-background size-4 rounded-full flex items-center justify-center">
                                <Award className="size-2 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold tracking-tight">{cliente.name}</p>
                              {cliente.isBlocked && <ShieldAlert className="size-3 text-destructive" />}
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium">{cliente.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "rounded-lg font-bold",
                          cliente.type === 'pro' 
                            ? "bg-primary/10 text-primary border-primary/20" 
                            : "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-transparent"
                        )}>
                          {cliente.type === 'pro' ? 'Cliente PRO' : 'Avulso'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <p className={cn(
                          "text-xs font-bold",
                          cliente.type === 'pro' ? "text-foreground" : "text-muted-foreground font-medium"
                        )}>
                          {getPlanName(cliente)}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {cliente.lastVisit && cliente.lastVisit !== "-" ? new Date(cliente.lastVisit).toLocaleDateString('pt-BR') : '-'}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "flex items-center gap-1.5",
                          cliente.status === 'active' ? "text-emerald-500" : "text-slate-400"
                        )}>
                          <div className={cn(
                            "size-1.5 rounded-full shadow-lg",
                            cliente.status === 'active' ? "bg-emerald-500 shadow-emerald-500/50" : "bg-slate-400 shadow-slate-400/50"
                          )} />
                          <span className="text-[11px] font-black uppercase tracking-wider">
                            {cliente.status === 'active' ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                            onClick={() => handleEditClick(cliente)}
                          >
                            <Edit2 className="size-3.5 text-slate-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800"
                            onClick={() => navigate(`/clientes/${cliente.id}/perfil`)}
                          >
                            <ChevronRight className="size-3.5 text-slate-500" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500"
                            onClick={() => handleDeleteClick(cliente)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-border/30">
            {isInternalLoading ? (
              <div className="py-12 text-center text-muted-foreground font-bold">Carregando...</div>
            ) : clientes.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground font-bold">Nenhum cliente encontrado.</div>
            ) : (
              clientes.map((cliente) => (
                <div key={cliente.id} className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "size-12 rounded-2xl flex items-center justify-center transition-colors shadow-sm border border-border/10",
                        cliente.type === 'pro' 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted text-muted-foreground"
                      )}>
                        {cliente.type === 'pro' ? <Star className="size-6 fill-primary" /> : <User className="size-6" />}
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight">{cliente.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium line-clamp-1">{cliente.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl" onClick={() => handleEditClick(cliente)}>
                        <Edit2 className="size-4 text-primary" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl" onClick={() => handleDeleteClick(cliente)}>
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-muted/20 p-3 rounded-2xl border border-border/5">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Tipo</p>
                      <Badge variant="outline" className={cn(
                        "rounded-lg font-bold text-[9px] px-1.5 py-0",
                        cliente.type === 'pro' 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : "bg-slate-100 text-slate-600 border-transparent dark:bg-slate-800"
                      )}>
                        {cliente.type === 'pro' ? 'PRO' : 'Avulso'}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Plano Ativo</p>
                      <p className="text-[11px] font-bold truncate">{getPlanName(cliente)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <div className={cn(
                          "size-2 rounded-full",
                          cliente.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-slate-400"
                        )} />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {cliente.status === 'active' ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
                      <Users className="size-3" />
                      {cliente.appointmentsCount || 0} visitas
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-4 sm:p-5 bg-muted/40 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-8">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest order-last sm:order-first">
               {((currentPage - 1) * itemsPerPage) + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
            </span>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="size-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <MoreHorizontal className="size-4 rotate-90" />
              </Button>
              
              <div className="flex items-center gap-1 overflow-x-auto max-w-[150px] sm:max-w-none no-scrollbar">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button 
                    key={page}
                    size="sm" 
                    className={cn(
                      "size-8 min-w-[32px] p-0 rounded-lg font-bold transition-all shrink-0",
                      currentPage === page ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent"
                    )}
                    variant={currentPage === page ? "default" : "ghost"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button 
                variant="ghost" 
                size="sm" 
                className="size-8 p-0 rounded-lg"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                <MoreHorizontal className="size-4 -rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        title="Excluir Cliente"
        description="Você tem certeza que deseja excluir os dados deste cliente? O histórico de serviços será preservado mas o acesso PRO (se houver) será cancelado."
        itemName={clienteToDelete?.name}
      />

      <ClienteSheet 
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        onSave={handleSaveCliente}
        cliente={clienteToEdit}
        planos={planos.map(p => ({ id: p.id, name: p.name }))}
      />
    </AdminLayout>
  )
}
