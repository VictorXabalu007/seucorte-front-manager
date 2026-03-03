import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  CheckCircle2,
  XCircle,
  PlusCircle,
  Save
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Cliente } from "../types/cliente"

const clienteSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  type: z.enum(["customer", "pro"]),
  planId: z.string().optional(),
  status: z.enum(["active", "inactive"]),
})

type ClienteFormValues = z.infer<typeof clienteSchema>

interface ClienteSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: ClienteFormValues) => void
  cliente?: Cliente | null
  planos?: { id: string, name: string }[]
}

export function ClienteSheet({
  isOpen,
  onOpenChange,
  onSave,
  cliente,
  planos = []
}: ClienteSheetProps) {
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "customer",
      planId: "",
      status: "active",
    },
  })

  useEffect(() => {
    if (isOpen) {
      if (cliente) {
        form.reset({
          name: cliente.name,
          email: cliente.email,
          phone: cliente.phone,
          type: cliente.type,
          planId: cliente.planId || "",
          status: cliente.status,
        })
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          type: "customer",
          planId: "",
          status: "active",
        })
      }
    }
  }, [isOpen, cliente, form])

  const selectedType = form.watch("type")

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-md overflow-y-auto rounded-l-2xl">
        <SheetHeader className="mb-8">
          <SheetTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
              <User className="size-6" />
            </div>
            {cliente ? "Editar Cliente" : "Novo Cliente"}
          </SheetTitle>
          <p className="text-sm text-muted-foreground text-left">
            {cliente 
              ? "Atualize as informações do cadastro deste cliente." 
              : "Preencha os campos abaixo para cadastrar um novo cliente no sistema."
            }
          </p>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Informações Básicas</p>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <User className="size-3 text-primary" /> Nome Completo
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: João Silva" className="bg-background/50 border-border rounded-xl focus:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Mail className="size-3 text-primary" /> E-mail
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" className="bg-background/50 border-border rounded-xl focus:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Phone className="size-3 text-primary" /> WhatsApp
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" className="bg-background/50 border-border rounded-xl focus:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Perfil & Assinatura</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground">Tipo de Cliente</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border rounded-xl h-10">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border bg-card">
                          <SelectItem value="customer" className="font-medium text-sm">Avulso (Common)</SelectItem>
                          <SelectItem value="pro" className="font-medium text-sm">Assinante (PRO)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground">Status do Cadastro</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border rounded-xl h-10">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border bg-card">
                          <SelectItem value="active" className="font-medium text-sm">Ativo</SelectItem>
                          <SelectItem value="inactive" className="font-medium text-sm">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {selectedType === "pro" && (
                <FormField
                  control={form.control}
                  name="planId"
                  render={({ field }) => (
                    <FormItem className="animate-in fade-in slide-in-from-top-2 duration-300">
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <ShieldCheck className="size-3 text-primary" /> Plano Vinculado
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border rounded-xl h-10">
                            <SelectValue placeholder="Selecione o plano" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border bg-card">
                          {planos.map(plano => (
                            <SelectItem key={plano.id} value={plano.id} className="font-medium text-sm">{plano.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                {cliente ? (
                  <>
                    <Save className="size-4" />
                    Salvar Alterações
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-4" />
                    Cadastrar Cliente
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
