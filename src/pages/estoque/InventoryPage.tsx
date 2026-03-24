import { useState, useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { InventoryKPIs } from "./InventoryKPIs"
import { 
  MoreHorizontal, 
  Edit2, 
  Trash2, 
  Filter, 
  Download, 
  Plus, 
  Search,
  Package,
  PlusCircle,
  PackagePlus,
  Ban,
  Tag,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DeleteConfirmationModal } from "@/components/ui/DeleteConfirmationModal"
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
import { inventoryService } from "./services/inventory.service"
import type { InventoryItem, InventoryFormData, InventoryStats } from "./types/inventory"
import { useLoading } from "@/components/loading-provider"
import { getActiveUnidadeId } from "@/lib/auth"
import { InventorySheet } from "./components/InventorySheet"
import { RestockDialog } from "./components/RestockDialog"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useDebounce } from "@/hooks/use-debounce"

export default function InventoryPage() {
  const { setIsLoading } = useLoading()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [isInternalLoading, setIsInternalLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<InventoryItem | null>(null)
  
  // Sheet & Restock State
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [isRestockOpen, setIsRestockOpen] = useState(false)
  const [restockItem, setRestockItem] = useState<InventoryItem | null>(null)

  const itemsPerPage = 8

  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const loadData = async () => {
    setIsLoading(true)
    setIsInternalLoading(true)
    try {
      const results = await Promise.all([
        inventoryService.getItems({ 
            search: debouncedSearchTerm, 
            category: categoryFilter !== 'all' ? categoryFilter : undefined 
        }),
        inventoryService.getStats()
      ])
      
      const [data, statsData] = results
      setItems(data)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to load inventory:", error)
      toast.error("Erro ao carregar dados do estoque")
      
      // Fallback apenas se houver erro real e não houver dados
      setItems([])
    } finally {
      setIsLoading(false)
      setIsInternalLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [debouncedSearchTerm, categoryFilter])

  // Filtering logic
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    const matchesActive = item.isActive !== false // Only show active items by default

    return matchesSearch && matchesCategory && matchesStatus && matchesActive
  })

  // Get unique categories for the filter
  const categories = Array.from(new Set(items.map(item => item.category)))

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset to first page on search
  }

  const handleDeleteClick = (item: InventoryItem) => {
    setItemToDelete(item)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return
    
    // In a real app, call service here
    console.log("Deleting item:", itemToDelete.id)
    
    setItems(prev => prev.filter(i => i.id !== itemToDelete.id))
    setIsDeleteModalOpen(false)
    setItemToDelete(null)
  }
  return (
    <AdminLayout>
      <div className="space-y-8 pb-10">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
              Estoque Inteligente
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1">
              Gerencie seus insumos e acompanhe o consumo por serviço em tempo real.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <Button variant="outline" size="sm" className="hidden sm:flex rounded-xl transition-all gap-2 px-3 h-10">
              <Download className="size-4" />
              Relatório em PDF
            </Button>
            <Button 
              size="sm" 
              onClick={() => {
                setEditingItem(null)
                setIsSheetOpen(true)
              }}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-4 h-11 sm:h-10 font-bold transition-all shadow-lg shadow-primary/20 gap-2 order-first sm:order-last"
            >
              <PlusCircle className="size-4 stroke-[3px]" />
              Novo Produto
            </Button>
          </div>
        </div>

        {/* KPIs */}
        <InventoryKPIs stats={stats} isLoading={isInternalLoading} />

        {/* Main Content Card */}
        <div className="bg-card/40 rounded-3xl border border-border shadow-sm overflow-hidden backdrop-blur-sm">
          {/* Table Toolbar */}
          <div className="p-4 sm:p-6 border-b border-border/50 flex flex-col lg:flex-row justify-between items-center gap-4 bg-muted/30">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Select 
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full sm:w-40 h-10 sm:h-9 rounded-xl bg-background/50 border-border/50 font-bold text-xs ring-offset-0 focus:ring-1 focus:ring-primary/30">
                  <SelectValue placeholder="Todas Categorias" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-md">
                  <SelectItem value="all" className="text-xs font-bold">Todas Categorias</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat} className="text-xs font-bold">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="w-full sm:w-40 h-10 sm:h-9 rounded-xl bg-background/50 border-border/50 font-bold text-xs ring-offset-0 focus:ring-1 focus:ring-primary/30">
                  <SelectValue placeholder="Todos Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-md">
                  <SelectItem value="all" className="text-xs font-bold">Todos Status</SelectItem>
                  <SelectItem value="SAFE" className="text-xs font-bold">Seguro</SelectItem>
                  <SelectItem value="LOW" className="text-xs font-bold">Baixo</SelectItem>
                  <SelectItem value="CRITICAL" className="text-xs font-bold">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input 
                  placeholder="Buscar no estoque..." 
                  className="pl-9 h-10 sm:h-9 bg-background/50 border-transparent rounded-xl text-xs focus:ring-1 focus:ring-primary/30" 
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 sm:h-9 w-10 sm:w-9 rounded-xl border-border shrink-0">
                <Filter className="size-4 text-slate-500" />
              </Button>
            </div>
          </div>

          {/* Grid View (Cards) */}
          <div className="bg-background">
            {isInternalLoading ? (
              <div className="p-8 space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-xl border border-border/50" />
                ))}
              </div>
            ) : paginatedItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="size-20 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Package className="size-10 text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-bold">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto">Tente ajustar seus filtros ou cadastre um novo produto.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-widest py-4 pl-8">Produto</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Categoria</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Estoque</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Valores (Custo/Venda)</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest py-4">Lucro (%)</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest py-4 text-center">Status</TableHead>
                      <TableHead className="w-[100px] text-right py-4 pr-8"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedItems.map((item) => (
                      <TableRow key={item.id} className="group hover:bg-muted/30 transition-colors border-border/40">
                        <TableCell className="py-4 pl-8">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center border border-border/50 shrink-0">
                                <Package className="size-5 text-muted-foreground/40 group-hover:text-primary/40 transition-colors" />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="font-bold text-sm text-foreground truncate">{item.name}</span>
                                <span className="text-[10px] text-muted-foreground truncate max-w-[200px]">{item.description || "Sem descrição"}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                            <Badge variant="secondary" className="bg-muted text-[10px] font-black uppercase tracking-tighter px-2 h-5">
                                {item.category}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col gap-1.5 w-32">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-tighter">
                                    <span className={cn(
                                        item.status === 'SAFE' ? "text-emerald-500" : 
                                        item.status === 'LOW' ? "text-amber-500" : "text-rose-500"
                                    )}>
                                        {item.stock} un
                                    </span>
                                    <span className="text-muted-foreground/40">min {item.minStock}</span>
                                </div>
                                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div 
                                        className={cn(
                                            "h-full transition-all duration-1000",
                                            item.status === 'SAFE' ? "bg-emerald-500" : 
                                            item.status === 'LOW' ? "bg-amber-500" : "bg-rose-500"
                                        )}
                                        style={{ width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-foreground">R$ {Number(item.salePrice).toFixed(2)}</span>
                                <span className="text-[10px] font-bold text-muted-foreground">Custo: R$ {Number(item.costPrice).toFixed(2)}</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                                {Number(item.salePrice) > 0 
                                    ? (((Number(item.salePrice) - Number(item.costPrice)) / Number(item.salePrice)) * 100).toFixed(0) 
                                    : "0"
                                }%
                            </span>
                        </TableCell>
                        <TableCell className="text-center">
                            <Badge className={cn(
                                "rounded-lg text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 shadow-none border-0",
                                item.status === 'SAFE' ? "bg-emerald-500/10 text-emerald-500" : 
                                item.status === 'LOW' ? "bg-amber-500/10 text-amber-500" : 
                                "bg-rose-500/10 text-rose-500"
                            )}>
                                {item.status === 'SAFE' ? 'Seguro' : item.status === 'LOW' ? 'Baixo' : 'Crítico'}
                            </Badge>
                        </TableCell>
                        <TableCell className="pr-8">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={() => {
                                        setRestockItem(item)
                                        setIsRestockOpen(true)
                                    }}
                                >
                                    <PackagePlus className="size-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
                                    onClick={() => {
                                        setEditingItem(item)
                                        setIsSheetOpen(true)
                                    }}
                                >
                                    <Edit2 className="size-4" />
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="size-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                                    onClick={() => handleDeleteClick(item)}
                                >
                                    <Ban className="size-4" />
                                </Button>
                            </div>
                            <div className="group-hover:hidden flex justify-end">
                                <MoreHorizontal className="size-4 text-muted-foreground/40" />
                            </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          <div className="p-4 bg-muted/40 border-t border-border flex items-center justify-between px-8">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Exibindo {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredItems.length)} de {filteredItems.length} insumos
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
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button 
                  key={page}
                  size="sm" 
                  className={cn(
                    "size-8 p-0 rounded-lg font-bold transition-all",
                    currentPage === page ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "hover:bg-accent"
                  )}
                  variant={currentPage === page ? "default" : "ghost"}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

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
        title="Inativar Produto"
        description="Deseja realmente inativar este produto? Ele não aparecerá mais nas listagens de venda, mas o histórico será mantido para relatórios."
        itemName={itemToDelete?.name}
      />

      <InventorySheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        item={editingItem}
        onSave={async (data: InventoryFormData) => {
            try {
                // Get unidadeId from context or local storage
                const unidadeId = localStorage.getItem("unidadeId") || ""
                
                const payload = {
        ...data,
        salePrice: data.salePrice,
        costPrice: data.costPrice,
        stock: Number(data.stock),
        minStock: Number(data.minStock),
        unidadeId: getActiveUnidadeId() || ""
      } as any

                if (editingItem) {
                    await inventoryService.updateItem(editingItem.id, payload)
                    toast.success("Produto atualizado com sucesso!")
                } else {
                    await inventoryService.createItem(payload)
                    toast.success("Produto cadastrado com sucesso!")
                }
                setIsSheetOpen(false)
                loadData()
            } catch (error) {
                toast.error("Erro ao salvar produto")
            }
        }}
      />

      <RestockDialog
        isOpen={isRestockOpen}
        onOpenChange={setIsRestockOpen}
        item={restockItem}
        onConfirm={async (id, quantity) => {
            try {
              await inventoryService.restock(id, quantity)
              toast.success("Estoque renovado com sucesso!")
              loadData()
            } catch (error) {
              toast.error("Erro ao reabastecer produto")
            }
        }}
      />
    </AdminLayout>
  )
}
