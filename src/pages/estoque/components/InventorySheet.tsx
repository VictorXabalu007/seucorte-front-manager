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
  PlusCircle,
  Scale
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
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { InventoryItem, InventoryFormData } from "../types/inventory"

const inventorySchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  category: z.string().min(1, "Categoria é obrigatória"),
  price: z.string().min(1, "Preço de venda é obrigatório"),
  stock: z.string().min(1, "Estoque atual é obrigatório"),
  minStock: z.string().min(1, "Estoque mínimo é obrigatório"),
  unit: z.string().min(1, "Unidade de medida é obrigatória"),
  commissionType: z.enum(["PERCENTAGE", "FIXED"]),
  commissionValue: z.string().min(1, "Valor da comissão é obrigatório"),
  linkedService: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.commissionType === "FIXED") {
    const commission = parseFloat(data.commissionValue)
    const price = parseFloat(data.price)
    
    if (commission > price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A comissão fixa não pode ser maior que o preço de venda",
        path: ["commissionValue"],
      })
    }
  }
})

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
      price: "0",
      stock: "0",
      minStock: "0",
      unit: "Unidades",
      commissionType: "PERCENTAGE",
      commissionValue: "0",
      linkedService: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (item) {
        form.reset({
          name: item.name,
          description: item.description || "",
          category: item.category,
          price: item.price.toString(),
          stock: item.stock.toString(),
          minStock: item.minStock.toString(),
          unit: item.unit,
          commissionType: item.commissionType,
          commissionValue: item.commissionValue.toString(),
          linkedService: item.linkedService || "",
        })
      } else {
        form.reset({
          name: "",
          description: "",
          category: "",
          price: "0",
          stock: "0",
          minStock: "0",
          unit: "Unidades",
          commissionType: "PERCENTAGE",
          commissionValue: "0",
          linkedService: "",
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
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Layers className="size-3 text-primary" /> Categoria
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Barba"
                          {...field}
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Scale className="size-3 text-primary" /> Unidade
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Un, Pacote, Frasco"
                          {...field}
                          className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 font-medium"
                        />
                      </FormControl>
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
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-3 text-primary" /> Preço de Venda
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground">R$</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            {...field}
                            className="bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 pl-9 font-bold text-lg"
                          />
                        </div>
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

            <div className="space-y-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Comissão de Venda</p>
              </div>
              
              <FormField
                control={form.control}
                name="commissionType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-2 gap-3"
                      >
                        <FormItem className="flex items-center space-x-2 space-y-0 p-3 rounded-xl bg-background/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="PERCENTAGE" />
                          </FormControl>
                          <FormLabel className="font-bold text-xs cursor-pointer flex-1">
                            Porcentagem (%)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2 space-y-0 p-3 rounded-xl bg-background/30 border border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="FIXED" />
                          </FormControl>
                          <FormLabel className="font-bold text-xs cursor-pointer flex-1">
                            Valor Fixo (R$)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commissionValue"
                render={({ field }) => {
                  const price = parseFloat(form.watch("price") || "0")
                  const isFixed = form.watch("commissionType") === "FIXED"
                  const isDisabled = isFixed && price <= 0

                  return (
                    <FormItem>
                      <FormLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        {isFixed ? "Valor Fixo (R$)" : "Porcentagem (%)"}
                      </FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs">
                              {isFixed ? "R$" : "%"}
                            </div>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              disabled={isDisabled}
                              className={`bg-background/50 border-border rounded-xl focus:ring-primary/20 h-11 pl-10 font-black text-lg ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                            />
                          </div>
                          {isDisabled && (
                            <p className="text-[10px] text-amber-500 font-bold bg-amber-500/10 p-2 rounded-lg animate-in fade-in slide-in-from-top-1">
                              Defina o preço de venda para habilitar a comissão fixa.
                            </p>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
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
