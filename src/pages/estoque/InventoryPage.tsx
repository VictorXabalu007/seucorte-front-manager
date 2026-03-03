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
import type { InventoryItem, InventoryFormData } from "./types/inventory"
import { useLoading } from "@/components/loading-provider"
import { InventorySheet } from "./components/InventorySheet"
import { RestockDialog } from "./components/RestockDialog"
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function InventoryPage() {
  const { setIsLoading } = useLoading()
  const [items, setItems] = useState<InventoryItem[]>([])
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

  const itemsPerPage = 6

  useEffect(() => {
    const loadItems = async () => {
      setIsLoading(true)
      setIsInternalLoading(true)
      try {
        const data = await inventoryService.getItems().catch(() => inventoryService.getMockItems())
        setItems(data)
      } catch (error) {
        console.error("Failed to load inventory:", error)
      } finally {
        setIsLoading(false)
        setIsInternalLoading(false)
      }
    }

    loadItems()
  }, [])

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
        <InventoryKPIs items={items} isLoading={isInternalLoading} />

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

          {/* Table (Desktop) */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow className="border-border">
                  <TableHead className="w-[250px] text-[10px] font-black uppercase tracking-widest py-5 px-8">Produto</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Categoria</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Valor Venda</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Saldo Atual</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Comissão</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right py-5 px-8 text-[10px] font-black uppercase tracking-widest">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isInternalLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-bold">
                      Carregando estoque...
                    </TableCell>
                  </TableRow>
                ) : paginatedItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center text-slate-500 font-bold">
                      Nenhum item encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item) => (
                    <TableRow key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-slate-100 dark:border-slate-800/60">
                      <TableCell className="py-4 px-8">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                            <Package className="size-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold tracking-tight">{item.name}</p>
                            <p className="text-[11px] text-muted-foreground font-medium line-clamp-1">{item.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-transparent rounded-lg font-bold whitespace-nowrap">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-black tabular-nums whitespace-nowrap">R$ {item.price.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1.5 min-w-[100px]">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black tabular-nums">{item.stock}</span>
                            <span className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{item.unit}</span>
                          </div>
                          <div className="w-full max-w-[100px] h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full shadow-lg",
                                item.status === 'SAFE' ? "bg-primary shadow-primary/20" : 
                                item.status === 'LOW' ? "bg-amber-500 shadow-amber-500/20" : 
                                "bg-destructive shadow-destructive/20"
                              )}
                              style={{ width: `${Math.min((item.stock / (item.minStock * 3)) * 100, 100)}%` }}
                             />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col whitespace-nowrap">
                            <span className="text-xs font-bold text-slate-700">
                                {item.commissionType === 'PERCENTAGE' ? `${item.commissionValue}%` : `R$ ${item.commissionValue.toFixed(2)}`}
                            </span>
                            <span className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter">por venda</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn(
                          "flex items-center gap-1.5 whitespace-nowrap",
                          item.status === 'SAFE' ? "text-primary" : 
                          item.status === 'LOW' ? "text-amber-500" : 
                          "text-destructive"
                        )}>
                          <div className={cn(
                            "size-1.5 rounded-full shadow-lg",
                            item.status === 'SAFE' ? "bg-primary shadow-primary/50" : 
                            item.status === 'LOW' ? "bg-amber-500 shadow-amber-500/50" : 
                            "bg-destructive shadow-destructive/50"
                          )} />
                          <span className="text-[11px] font-black uppercase tracking-wider">
                            {item.status === 'SAFE' ? 'Seguro' : item.status === 'LOW' ? 'Baixo' : 'Crítico'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                                setRestockItem(item)
                                setIsRestockOpen(true)
                            }}
                            className="size-8 rounded-lg hover:bg-emerald-500/10 hover:text-emerald-500"
                          >
                            <PackagePlus className="size-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => {
                                setEditingItem(item)
                                setIsSheetOpen(true)
                            }}
                            className="size-8 rounded-lg hover:bg-primary/10 hover:text-primary"
                          >
                            <Edit2 className="size-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="size-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Ban className="size-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Card View (Mobile) */}
          <div className="md:hidden divide-y divide-border/50">
            {isInternalLoading ? (
               <div className="p-8 text-center text-slate-500 font-bold">Carregando...</div>
            ) : paginatedItems.length === 0 ? (
               <div className="p-8 text-center text-slate-500 font-bold">Nenhum item encontrado.</div>
            ) : (
              paginatedItems.map((item) => (
                <div key={item.id} className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                        <Package className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black tracking-tight">{item.name}</p>
                        <Badge variant="outline" className="mt-1 bg-sky-50 text-sky-600 border-sky-100 text-[9px] px-1.5 py-0 rounded-md font-bold uppercase tracking-wider">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => { setRestockItem(item); setIsRestockOpen(true); }}>
                        <PackagePlus className="size-4 text-emerald-500" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => { setEditingItem(item); setIsSheetOpen(true); }}>
                        <Edit2 className="size-4 text-primary" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-muted/20 p-3 rounded-2xl">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Preço Venda</p>
                      <p className="text-sm font-black">R$ {item.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Status</p>
                      <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase", item.status === 'SAFE' ? "text-primary" : item.status === 'LOW' ? "text-amber-500" : "text-destructive")}>
                        <div className={cn("size-1.5 rounded-full", item.status === 'SAFE' ? "bg-primary" : item.status === 'LOW' ? "bg-amber-500" : "bg-destructive")} />
                        {item.status === 'SAFE' ? 'Seguro' : item.status === 'LOW' ? 'Baixo' : 'Crítico'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">Estoque</p>
                        <p className="text-sm font-black tabular-nums">{item.stock} <span className="text-[10px] text-slate-400">{item.unit}</span></p>
                      </div>
                      <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden mt-2">
                        <div 
                          className={cn("h-full rounded-full", item.status === 'SAFE' ? "bg-primary" : item.status === 'LOW' ? "bg-amber-500" : "bg-destructive")}
                          style={{ width: `${Math.min((item.stock / (item.minStock * 3)) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-0.5 text-right">Comissão</p>
                      <p className="text-xs font-bold text-right">
                        {item.commissionType === 'PERCENTAGE' ? `${item.commissionValue}%` : `R$ ${item.commissionValue.toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </div>
              ))
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
                const numericData = {
                    ...data,
                    price: parseFloat(data.price),
                    stock: parseFloat(data.stock),
                    minStock: parseFloat(data.minStock),
                    commissionValue: parseFloat(data.commissionValue),
                }

                if (editingItem) {
                    // Update
                    console.log("Updating item:", editingItem.id, numericData)
                    setItems(prev => prev.map(i => i.id === editingItem.id ? { ...i, ...numericData, status: numericData.stock <= numericData.minStock ? 'CRITICAL' : 'SAFE' } as InventoryItem : i))
                    toast.success("Produto atualizado com sucesso!")
                } else {
                    // Create
                    const newItem: InventoryItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        ...numericData,
                        isActive: true,
                        status: numericData.stock <= numericData.minStock ? 'CRITICAL' : 'SAFE',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    } as InventoryItem
                    setItems(prev => [newItem, ...prev])
                    toast.success("Produto cadastrado com sucesso!")
                }
                setIsSheetOpen(false)
            } catch (error) {
                toast.error("Erro ao salvar produto")
            }
        }}
      />

      <RestockDialog
        isOpen={isRestockOpen}
        onOpenChange={setIsRestockOpen}
        item={restockItem}
        onConfirm={(id, quantity) => {
            setItems(prev => prev.map(i => {
                if (i.id === id) {
                    const newStock = i.stock + quantity
                    return {
                        ...i,
                        stock: newStock,
                        status: newStock <= i.minStock ? 'CRITICAL' : newStock <= i.minStock * 1.5 ? 'LOW' : 'SAFE'
                    }
                }
                return i
            }))
            toast.success("Estoque renovado com sucesso!")
        }}
      />
    </AdminLayout>
  )
}
