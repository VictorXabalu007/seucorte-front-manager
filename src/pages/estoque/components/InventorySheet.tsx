import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Plus, 
  Package, 
  Save, 
  FileText, 
  Tag, 
  Layers, 
  AlertCircle,
  Scissors,
  DollarSign,
  PlusCircle
} from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MoneyInput } from "@/components/ui/money-input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { InventoryItem, InventoryFormData } from "../types/inventory"

const inventorySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  salePrice: z.number().min(0.01, "Preço de venda deve ser maior que zero"),
  costPrice: z.number().min(0.01, "Preço de custo deve ser maior que zero"),
  stock: z.string().min(1, "Estoque atual é obrigatório"),
  minStock: z.string().min(1, "Estoque mínimo é obrigatório"),
})

const INVENTORY_CATEGORIES = [
  "Cabelo",
  "Barba",
  "Bebidas",
  "Insumos",
  "Acessórios",
  "Outros"
]

interface InventorySheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem | null
  onSave: (data: InventoryFormData) => void
}

export function InventorySheet({
  isOpen,
  onOpenChange,
  item,
  onSave
}: InventorySheetProps) {
  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      salePrice: 0,
      costPrice: 0,
      stock: "0",
      minStock: "0",
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset({
          name: item.name,
          description: item.description || "",
          category: item.category,
          salePrice: item.salePrice,
          costPrice: item.costPrice,
          stock: item.stock.toString(),
          minStock: item.minStock.toString(),
        })
      } else {
        form.reset({
          name: "",
          description: "",
          category: "",
          salePrice: 0,
          costPrice: 0,
          stock: "0",
          minStock: "0",
        })
      }
    }
  }, [item, isOpen, form])

  const onSubmit = (data: InventoryFormData) => {
    onSave(data)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-md overflow-y-auto rounded-l-2xl">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              {item ? <Package className="size-6" /> : <Plus className="size-6" />}
            </div>
            {item ? "Editar Produto" : "Novo Produto"}
          </SheetTitle>
          <p className="text-sm text-muted-foreground text-left">
            {item 
              ? "Atualize as informações do seu produto em estoque." 
              : "Cadastre um novo produto ou insumo para o seu estoque."
            }
          </p>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Identificação & Descrição</p>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <Tag className="size-3 text-primary" /> Nome do Produto
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ex: Pomada Matte"
                        {...field}
                        className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Layers className="size-3 text-primary" /> Categoria
                      </FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border bg-card/95 backdrop-blur-md">
                          {INVENTORY_CATEGORIES.map(cat => (
                            <SelectItem key={cat} value={cat} className="text-sm font-medium">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <FileText className="size-3 text-primary" /> Descrição Curta
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalhes sobre o produto..."
                        {...field}
                        className="bg-background/50 border-border rounded-xl focus:ring-primary/20 font-medium min-h-[80px] resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Valores & Estoque</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-3 text-primary" /> Preço de Venda
                      </FormLabel>
                      <FormControl>
                        <MoneyInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0,00"
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-bold text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="costPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-3 text-amber-600" /> Preço de Custo
                      </FormLabel>
                      <FormControl>
                        <MoneyInput
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="0,00"
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-bold text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <AlertCircle className="size-3 text-amber-500" /> Estoque Mínimo
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-bold text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {!item && (
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground">Estoque Inicial</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-bold text-lg"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>


            <SheetFooter className="mt-8 flex gap-3 sm:flex-row flex-col pt-6 border-t border-border/50">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1 border-border text-muted-foreground hover:bg-muted rounded-xl h-11 font-bold">
                  Cancelar
                </Button>
              </SheetClose>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 shadow-lg shadow-primary/20 flex items-center gap-2">
                {item ? (
                  <>
                    <Save className="size-4" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" />
                    Cadastrar Produto
                  </>
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
