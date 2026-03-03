import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PackagePlus, Save, AlertTriangle } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
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
import type { InventoryItem } from "../types/inventory"

const restockSchema = z.object({
  quantity: z.string().refine((val) => parseFloat(val) > 0, {
    message: "A quantidade deve ser maior que zero",
  }),
})

interface RestockDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  item: InventoryItem | null
  onConfirm: (id: string, quantity: number) => void
}

export function RestockDialog({
  isOpen,
  onOpenChange,
  item,
  onConfirm
}: RestockDialogProps) {
  const form = useForm<{ quantity: string }>({
    resolver: zodResolver(restockSchema),
    defaultValues: {
      quantity: "1",
    },
  })

  const onSubmit = (data: { quantity: string }) => {
    if (item) {
      onConfirm(item.id, parseFloat(data.quantity))
      onOpenChange(false)
      form.reset()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-popover border-border/50 p-0 overflow-hidden rounded-[2.5rem] gap-0">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black tracking-tight flex items-center gap-3 text-foreground">
            <div className="p-2 bg-primary/20 rounded-xl">
              <PackagePlus className="size-6 text-primary" />
            </div>
            Reposição de Estoque
          </DialogTitle>
        </DialogHeader>

        <div className="px-8 py-2">
            <div className="p-4 bg-muted/50 rounded-2xl border border-border/50 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Produto</p>
                <p className="text-sm font-bold text-foreground">{item?.name}</p>
                <p className="text-[11px] text-muted-foreground">Saldo atual: <strong>{item?.stock} {item?.unit}</strong></p>
            </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 pt-4">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Quantidade a adicionar
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        placeholder="Ex: 10"
                        {...field}
                        className="h-14 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-black text-2xl text-center"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 flex gap-3">
                <AlertTriangle className="size-5 text-amber-500 shrink-0" />
                <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
                    Esta ação irá somar a quantidade digitada ao estoque atual. Essa operação ficará registrada no histórico de movimentações.
                </p>
            </div>

            <DialogFooter className="pt-4 flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-12 rounded-2xl px-6 border-border font-bold text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex-1"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="h-12 rounded-2xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground font-black shadow-lg shadow-primary/20 transition-all flex-1 gap-2 border-0"
              >
                <Save className="size-4" />
                Confirmar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
