import { useEffect, useState } from "react"
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
  Save,
  Fingerprint,
  Calendar,
  MapPin,
  AlertTriangle,
  Star,
  FileText,
  Map,
  Hash
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Cliente } from "../types/cliente"

const clienteSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido").or(z.literal("")),
  phone: z.string().min(10, "Telefone inválido"),
  cpfCnpj: z.string(),
  rg: z.string(),
  gender: z.string(),
  birthDate: z.string(),
  
  // Endereço
  zip: z.string(),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  number: z.string(),
  
  // Status e Marcadores
  type: z.enum(["customer", "pro"]),
  status: z.enum(["active", "inactive"]),
  isVip: z.boolean(),
  isBlocked: z.boolean(),
  internalNotes: z.string(),
  observations: z.string(),
  planoId: z.string().optional(),
})

type ClienteFormValues = z.infer<typeof clienteSchema>

interface ClienteSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: ClienteFormValues) => void
  cliente?: Cliente | null
  planos: Array<{ id: string, name: string }>
}

export function ClienteSheet({
  isOpen,
  onOpenChange,
  onSave,
  cliente,
  planos
}: ClienteSheetProps) {
  const [activeTab, setActiveTab] = useState("geral")
  
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      type: "customer",
      status: "active",
      isVip: false,
      isBlocked: false,
      cpfCnpj: "",
      rg: "",
      gender: "M",
      birthDate: "",
      zip: "",
      state: "",
      city: "",
      neighborhood: "",
      street: "",
      number: "",
      internalNotes: "",
      observations: "",
      planoId: "",
    },
  })

  useEffect(() => {
    if (isOpen) {
      setActiveTab("geral")
      if (cliente) {
        form.reset({
          name: cliente.name,
          email: cliente.email || "",
          phone: cliente.phone,
          type: cliente.type,
          status: cliente.status,
          isVip: cliente.isVip || false,
          isBlocked: cliente.isBlocked || false,
          cpfCnpj: cliente.cpfCnpj || "",
          rg: cliente.rg || "",
          gender: cliente.gender || "M",
          birthDate: cliente.birthDate ? new Date(cliente.birthDate).toISOString().split("T")[0] : "",
          zip: cliente.zip || "",
          state: cliente.state || "",
          city: cliente.city || "",
          neighborhood: cliente.neighborhood || "",
          street: cliente.street || "",
          number: cliente.number || "",
          internalNotes: cliente.internalNotes || "",
          observations: cliente.observations || "",
          planoId: cliente.assinaturas?.[0]?.plano?.id || "",
        })
      } else {
        form.reset({
          name: "",
          email: "",
          phone: "",
          type: "customer",
          status: "active",
          isVip: false,
          isBlocked: false,
          cpfCnpj: "",
          rg: "",
          gender: "M",
          birthDate: "",
          zip: "",
          state: "",
          city: "",
          neighborhood: "",
          street: "",
          number: "",
          internalNotes: "",
          observations: "",
          planoId: "",
        })
      }
    }
  }, [isOpen, cliente, form])

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="bg-card border-border text-foreground sm:max-w-xl rounded-l-3xl p-0 flex flex-col h-full overflow-hidden shadow-2xl">
        <div className="p-6 pb-0">
          <SheetHeader className="mb-6">
            <SheetTitle className="text-2xl font-black tracking-tight text-foreground flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="size-6" />
              </div>
              {cliente ? "Editar Cliente" : "Novo Cliente"}
            </SheetTitle>
          </SheetHeader>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-0 flex flex-col h-full overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
              <div className="px-6 border-b border-border">
                <TabsList className="bg-transparent border-none p-0 h-12 gap-6">
                  <TabsTrigger value="geral" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold">Geral</TabsTrigger>
                  <TabsTrigger value="endereco" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold">Endereço</TabsTrigger>
                  <TabsTrigger value="extras" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0 font-bold">Informações Extras</TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <TabsContent value="geral" className="mt-0 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Dados de Contato</p>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground">Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Ex: João Silva" className="bg-background/50 border-border rounded-xl" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-muted-foreground">E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="email@exemplo.com" className="bg-background/50 border-border rounded-xl" {...field} />
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
                            <FormLabel className="text-xs font-bold text-muted-foreground">WhatsApp</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 00000-0000" className="bg-background/50 border-border rounded-xl" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Documentos e Perfil</p>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cpfCnpj"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-muted-foreground">CPF ou CNPJ</FormLabel>
                            <FormControl>
                              <Input placeholder="000.000.000-00" className="bg-background/50 border-border rounded-xl" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="rg"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-muted-foreground">RG</FormLabel>
                            <FormControl>
                              <Input placeholder="00.000.000-0" className="bg-background/50 border-border rounded-xl" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="birthDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-muted-foreground">Data de Nascimento</FormLabel>
                            <FormControl>
                              <Input type="date" className="bg-background/50 border-border rounded-xl h-10" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-muted-foreground">Sexo</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border rounded-xl h-10">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="M">Masculino</SelectItem>
                                <SelectItem value="F">Feminino</SelectItem>
                                <SelectItem value="O">Outro</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="planoId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground underline decoration-primary/30 underline-offset-4">Plano de Assinatura (Opcional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-border rounded-xl h-12 shadow-sm border-primary/20">
                                <SelectValue placeholder="Selecione um plano para este cliente" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-card border-border shadow-2xl rounded-2xl">
                              <SelectItem value="none" className="text-muted-foreground italic">Nenhum / Sem Assinatura</SelectItem>
                              {planos.map((plano) => (
                                <SelectItem key={plano.id} value={plano.id} className="font-semibold">
                                  {plano.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="endereco" className="mt-0 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Localização</p>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="zip"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs font-bold text-muted-foreground">CEP</FormLabel>
                            <FormControl>
                              <Input placeholder="00000-000" className="bg-background/50 border-border rounded-xl" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs font-bold text-muted-foreground">Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Cidade" className="bg-background/50 border-border rounded-xl" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs font-bold text-muted-foreground">Estado</FormLabel>
                            <FormControl>
                              <Input placeholder="UF" maxLength={2} className="bg-background/50 border-border rounded-xl uppercase" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem className="col-span-3">
                            <FormLabel className="text-xs font-bold text-muted-foreground">Logradouro / Rua</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome da rua" className="bg-background/50 border-border rounded-xl" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem className="col-span-1">
                            <FormLabel className="text-xs font-bold text-muted-foreground">Nº</FormLabel>
                            <FormControl>
                              <Input placeholder="123" className="bg-background/50 border-border rounded-xl" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground">Bairro</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu Bairro" className="bg-background/50 border-border rounded-xl" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="extras" className="mt-0 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Marcadores & Status</p>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="isVip"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-4 space-y-0 bg-background/30">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-bold flex items-center gap-2 underline decoration-amber-500/50 underline-offset-4">
                                <Star className="size-4 text-amber-500" /> Cliente VIP
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isBlocked"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-xl border border-border p-4 space-y-0 bg-background/30">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm font-bold flex items-center gap-2 underline decoration-destructive/50 underline-offset-4 text-destructive">
                                <AlertTriangle className="size-4" /> Bloqueado
                              </FormLabel>
                            </div>
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-muted-foreground">Classificação</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border rounded-xl h-12">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="customer">Consumidor Comum</SelectItem>
                                <SelectItem value="pro">Profissional / PRO</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold text-muted-foreground">Status do Cadastro</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-background/50 border-border rounded-xl h-12">
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="active">Ativo</SelectItem>
                                <SelectItem value="inactive">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Anotações Internas</p>
                    <FormField
                      control={form.control}
                      name="observations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground">Observações sobre o Cliente</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Histórico médico, preferências, etc." className="bg-background/50 border-border rounded-xl min-h-[80px]" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="internalNotes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold text-muted-foreground">Notas Internas (Equipe)</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Mensagem interna para atendentes..." className="bg-background/50 border-border rounded-xl min-h-[80px]" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </div>
            </Tabs>

            <div className="p-6 border-t border-border bg-card mt-auto rounded-bl-3xl">
              <SheetFooter className="gap-3 sm:flex-row flex-col">
                {activeTab === "geral" ? (
                  <SheetClose asChild>
                    <Button type="button" variant="ghost" className="flex-1 text-muted-foreground font-bold h-12 rounded-xl">
                      Cancelar
                    </Button>
                  </SheetClose>
                ) : (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1 text-muted-foreground font-bold h-12 rounded-xl"
                    onClick={() => {
                      if (activeTab === "extras") setActiveTab("endereco")
                      else if (activeTab === "endereco") setActiveTab("geral")
                    }}
                  >
                    Voltar
                  </Button>
                )}

                {activeTab !== "extras" ? (
                  <Button 
                    type="button" 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 shadow-lg shadow-primary/20 flex items-center gap-2"
                    onClick={async () => {
                      // Opcional: validar apenas os campos da aba atual antes de prosseguir
                      if (activeTab === "geral") {
                        const isValid = await form.trigger(["name", "email", "phone"])
                        if (isValid) setActiveTab("endereco")
                      } else if (activeTab === "endereco") {
                        setActiveTab("extras")
                      }
                    }}
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 shadow-lg shadow-primary/20 flex items-center gap-2">
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
                )}
              </SheetFooter>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
