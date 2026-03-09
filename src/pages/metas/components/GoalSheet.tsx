import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Target, Save, TrendingUp, Calendar, User, LayoutGrid, Info } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Meta, MetaFormData, MetaType, MetaStatus } from "../types"

const metaSchema = z.object({
  title: z.string().min(3, "Título deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  targetValue: z.number().min(0.01, "Valor alvo deve ser maior que zero"),
  type: z.enum(["revenue", "bookings", "new_clients", "services"]),
  startDate: z.string(),
  endDate: z.string(),
  professionalName: z.string().optional(),
  unitName: z.string().optional(),
  status: z.enum(["active", "completed", "failed", "pending"]).optional(),
})

interface GoalSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  meta: Meta | null
  onSave: (data: MetaFormData) => void
}

export function GoalSheet({
  isOpen,
  onOpenChange,
  meta,
  onSave
}: GoalSheetProps) {
  const form = useForm<MetaFormData>({
    resolver: zodResolver(metaSchema),
    defaultValues: {
      title: "",
      description: "",
      targetValue: 0,
      type: "revenue",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      status: "active",
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (meta) {
        form.reset({
          title: meta.title,
          description: meta.description || "",
          targetValue: meta.targetValue,
          type: meta.type,
          startDate: meta.startDate,
          endDate: meta.endDate,
          status: meta.status,
        })
      } else {
        form.reset({
          title: "",
          description: "",
          targetValue: 0,
          type: "revenue",
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
          status: "active",
        })
      }
    }
  }, [meta, isOpen, form])

  const onSubmit = (data: MetaFormData) => {
    onSave(data)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md rounded-l-2xl border-l border-border bg-card/95 backdrop-blur-md p-0 overflow-y-auto invisible-scrollbar">
        <SheetHeader className="p-8 pb-4">
          <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Target className="size-6 text-primary" />
            </div>
            {meta ? "Editar Meta" : "Nova Meta"}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 pt-0">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Título da Meta
                    </label>
                    <FormControl>
                      <div className="relative">
                        <Target className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="Ex: Meta de Faturamento Março"
                          {...field}
                          className="pl-10 h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Tipo
                      </label>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                           <SelectTrigger className="h-12 bg-card/40 border-border/50 rounded-2xl font-bold px-4">
                             <SelectValue placeholder="Tipo" />
                           </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-2xl border-border bg-card/95 backdrop-blur-md font-bold">
                          <SelectItem value="revenue" className="rounded-xl">Faturamento</SelectItem>
                          <SelectItem value="bookings" className="rounded-xl">Agendamentos</SelectItem>
                          <SelectItem value="new_clients" className="rounded-xl">Novos Clientes</SelectItem>
                          <SelectItem value="services" className="rounded-xl">Serviços</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetValue"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Valor Alvo
                      </label>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold tabular-nums"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Data Início
                      </label>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Data Fim
                      </label>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
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
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Observações
                    </label>
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full min-h-[100px] p-4 bg-card/40 border border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold text-sm outline-none transition-all"
                        placeholder="Detalhes adicionais sobre a meta..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
                <Info className="size-5 text-primary shrink-0" />
                <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
                  As metas são monitoradas automaticamente em tempo real com base nos agendamentos e vendas realizadas no sistema.
                </p>
              </div>
            </div>

            <SheetFooter className="mt-8 flex gap-3 sm:flex-row flex-col pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-border text-muted-foreground hover:bg-muted rounded-xl h-11 font-bold w-full uppercase text-[10px] tracking-widest"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl h-11 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 w-full uppercase text-[10px] tracking-widest"
              >
                <Save className="size-4" />
                {meta ? "Salvar Alterações" : "Criar Meta"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
