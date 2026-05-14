import { useState, useMemo, useEffect } from "react"
import { Package, Search, Plus, Minus, ShoppingBag, AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ProductItem {
  id: string
  name: string
  category: string
  stock: number
  salePrice: number
  status: 'SAFE' | 'LOW' | 'CRITICAL'
}

interface SelectedProduct {
  product: ProductItem
  quantity: number
  priceCharged: number
}

interface ProductPickerModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  products: ProductItem[]
  currentProducts?: { produtoId: string; quantity: number; priceCharged: number }[]
  onConfirm: (selected: SelectedProduct[]) => void
}

export function ProductPickerModal({
  isOpen,
  onOpenChange,
  products,
  currentProducts = [],
  onConfirm,
}: ProductPickerModalProps) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Map<string, SelectedProduct>>(new Map())

  useEffect(() => {
    if (isOpen) {
      setSearch("")
      const map = new Map<string, SelectedProduct>()
      currentProducts.forEach(cp => {
        const prod = products.find(p => p.id === cp.produtoId)
        if (prod) {
          map.set(prod.id, { product: prod, quantity: cp.quantity, priceCharged: cp.priceCharged })
        }
      })
      setSelected(map)
    }
  }, [isOpen, currentProducts, products])

  const filtered = useMemo(() =>
    products.filter(p =>
      p.stock > 0 &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.category.toLowerCase().includes(search.toLowerCase()))
    ), [products, search])

  const handleToggle = (product: ProductItem) => {
    setSelected(prev => {
      const next = new Map(prev)
      if (next.has(product.id)) {
        next.delete(product.id)
      } else {
        next.set(product.id, { product, quantity: 1, priceCharged: Number(product.salePrice) })
      }
      return next
    })
  }

  const handleQuantity = (productId: string, delta: number) => {
    setSelected(prev => {
      const next = new Map(prev)
      const item = next.get(productId)
      if (!item) return prev
      const maxQty = item.product.stock
      const newQty = Math.max(1, Math.min(item.quantity + delta, maxQty))
      next.set(productId, { ...item, quantity: newQty })
      return next
    })
  }

  const handlePrice = (productId: string, value: string) => {
    setSelected(prev => {
      const next = new Map(prev)
      const item = next.get(productId)
      if (!item) return prev
      next.set(productId, { ...item, priceCharged: Number(value) || 0 })
      return next
    })
  }

  const handleConfirm = () => {
    onConfirm(Array.from(selected.values()))
    onOpenChange(false)
  }

  const statusColors: Record<string, string> = {
    SAFE: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    LOW: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    CRITICAL: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  }
  const statusLabels: Record<string, string> = { SAFE: 'OK', LOW: 'Baixo', CRITICAL: 'Crítico' }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border text-foreground rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-black tracking-tight flex items-center gap-2">
            <ShoppingBag className="size-5 text-primary" />
            Adicionar Produtos
          </DialogTitle>

          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
            <Input
              placeholder="Buscar produto..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-10 bg-background/50 border-border/50 rounded-xl text-sm"
            />
          </div>
        </DialogHeader>

        <div className="max-h-[380px] overflow-y-auto px-4 py-3 space-y-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center text-muted-foreground">
              <Package className="size-10 mb-2 opacity-30" />
              <p className="text-sm font-bold">Nenhum produto disponível</p>
            </div>
          ) : (
            filtered.map(product => {
              const isSelected = selected.has(product.id)
              const item = selected.get(product.id)
              return (
                <div
                  key={product.id}
                  className={cn(
                    "rounded-xl border p-3 transition-all duration-200",
                    isSelected
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/50 bg-background/40 hover:border-primary/20 hover:bg-background/60 cursor-pointer"
                  )}
                  onClick={() => !isSelected && handleToggle(product)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={cn(
                        "size-8 rounded-lg flex items-center justify-center shrink-0",
                        isSelected ? "bg-primary/20" : "bg-muted"
                      )}>
                        <Package className={cn("size-4", isSelected ? "text-primary" : "text-muted-foreground/40")} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{product.name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-muted-foreground">{product.category}</span>
                          <Badge className={cn("text-[9px] px-1.5 h-4 border font-black", statusColors[product.status])}>
                            {product.status === 'CRITICAL' && <AlertTriangle className="size-2.5 mr-0.5" />}
                            {statusLabels[product.status]} ({product.stock})
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="flex items-center gap-2 shrink-0" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-lg hover:bg-primary/10"
                            onClick={() => handleQuantity(product.id, -1)}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="text-sm font-black w-5 text-center">{item?.quantity}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-7 rounded-lg hover:bg-primary/10"
                            onClick={() => handleQuantity(product.id, 1)}
                            disabled={item?.quantity === product.stock}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-bold">R$</span>
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            value={item?.priceCharged}
                            onChange={e => handlePrice(product.id, e.target.value)}
                            className="w-20 h-7 pl-6 pr-1 text-xs font-black bg-background border border-border/50 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/30"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 rounded-lg hover:bg-rose-500/10 hover:text-rose-500"
                          onClick={() => handleToggle(product)}
                        >
                          <Minus className="size-3.5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-sm font-black text-emerald-500">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.salePrice)}
                        </span>
                        <Button type="button" size="icon" className="size-7 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary" onClick={() => handleToggle(product)}>
                          <Plus className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/50 flex items-center justify-between gap-3">
          <div className="text-xs font-bold text-muted-foreground">
            {selected.size > 0
              ? `${selected.size} produto(s) • Total: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Array.from(selected.values()).reduce((a, i) => a + i.priceCharged * i.quantity, 0))}`
              : 'Nenhum produto selecionado'}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button className="rounded-xl bg-primary font-black" onClick={handleConfirm} disabled={selected.size === 0}>
              Confirmar ({selected.size})
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
