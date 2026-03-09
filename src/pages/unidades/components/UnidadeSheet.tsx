import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Plus, Save, Building2, Globe, MapPin, Phone, Mail, Image as ImageIcon } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"
import type { Unidade, UnidadeFormData } from "../types"

const unidadeSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  logoUrl: z.string().url("URL de logo inválida").optional().or(z.literal("")),
  isActive: z.boolean(),
})

interface UnidadeSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  unidade: Unidade | null
  onSave: (data: UnidadeFormData) => void
}

export function UnidadeSheet({
  isOpen,
  onOpenChange,
  unidade,
  onSave
}: UnidadeSheetProps) {
  const form = useForm<UnidadeFormData>({
    resolver: zodResolver(unidadeSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      logoUrl: "",
      isActive: true,
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (unidade) {
        form.reset({
          name: unidade.name || "",
          address: unidade.address || "",
          phone: unidade.phone || "",
          email: unidade.email || "",
          logoUrl: unidade.logoUrl || "",
          isActive: unidade.isActive ?? true,
        })
      } else {
        form.reset({
          name: "",
          address: "",
          phone: "",
          email: "",
          logoUrl: "",
          isActive: true,
        })
      }
    }
  }, [unidade, isOpen, form])

  const onSubmit = (data: UnidadeFormData) => {
    onSave(data)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md rounded-l-2xl border-l border-border bg-card/95 backdrop-blur-md p-0 overflow-y-auto invisible-scrollbar">
        <SheetHeader className="p-8 pb-4">
          <SheetTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Building2 className="size-6 text-primary" />
            </div>
            {unidade ? "Editar Unidade" : "Nova Unidade"}
          </SheetTitle>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-8 pt-0">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Nome da Unidade
                    </label>
                    <FormControl>
                      <div className="relative">
                        <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="Ex: Barber Shop - Centro"
                          {...field}
                          className="pl-10 h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      Endereço
                    </label>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="Rua, Número, Bairro, Cidade"
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
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Telefone
                      </label>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder="(00) 00000-0000"
                            {...field}
                            className="pl-10 h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                        E-mail
                      </label>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder="contato@barber.com"
                            {...field}
                            className="pl-10 h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">
                      URL do Logo
                    </label>
                    <FormControl>
                      <div className="relative">
                        <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input
                          placeholder="https://imagem.com/logo.png"
                          {...field}
                          className="pl-10 h-12 bg-card/40 border-border/50 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between p-4 bg-card/40 border border-border/50 rounded-2xl">
                    <div className="space-y-0.5">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground block">
                        Unidade Ativa
                      </label>
                      <p className="text-[10px] text-muted-foreground font-medium">Permitir agendamentos nesta unidade</p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <SheetFooter className="mt-8 flex gap-3 sm:flex-row flex-col pt-6 border-t border-border/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 border-border text-muted-foreground hover:bg-muted rounded-xl h-11 font-bold w-full"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 w-full"
              >
                <Save className="size-4" />
                {unidade ? "Salvar Alterações" : "Cadastrar Unidade"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
