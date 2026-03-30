import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Save,
  Type,
  Activity,
  Scissors,
  Users,
  Search,
  ArrowLeft,
  Check
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useLoading } from "@/components/loading-provider"
import { getActiveUnidadeId } from "@/lib/auth"
import { toast } from "sonner"

import { planoService } from "./services/plano.service"
import { servicesService } from "../servicos/services/services.service"
import { clienteService } from "../clientes/services/cliente.service"
import type { Plano } from "./types/plano"
import type { Service } from "../servicos/types"

const planoSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  price: z.coerce.number().min(0, "Preço inválido"),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  features: z.array(z.object({ value: z.string().min(1, "Característica não pode ser vazia") })).min(1, "Adicione pelo menos uma característica"),
  billingCycle: z.enum(["monthly", "yearly"]),
  isActive: z.boolean(),
  serviceIds: z.array(z.string()).optional(),
  clienteIds: z.array(z.string()).optional(),
})

type PlanoFormValues = z.infer<typeof planoSchema>

export default function PlanoFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { setIsLoading } = useLoading()
  const isEditing = !!id
  const unidadeId = getActiveUnidadeId()

  const [searchTerm, setSearchTerm] = useState("")
  const [servicosDisponiveis, setServicosDisponiveis] = useState<Service[]>([])
  const [clientesDisponiveis, setClientesDisponiveis] = useState<any[]>([])

  const form = useForm<PlanoFormValues>({
    resolver: zodResolver(planoSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
      features: [{ value: "" }],
      billingCycle: "monthly",
      isActive: true,
      serviceIds: [],
      clienteIds: [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features" as never,
  })

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!unidadeId) {
        toast.error("Nenhuma unidade ativa encontrada")
        navigate("/planos")
        return
      }

      setIsLoading(true)
      try {
        const [servicos, clientes] = await Promise.all([
          servicesService.getServices(unidadeId),
          clienteService.getClientes({ unidadeId })
        ])
        setServicosDisponiveis(servicos)
        setClientesDisponiveis(clientes.data || [])

        if (isEditing) {
          const plano = await planoService.getPlanById(id)
          if (plano) {
            form.reset({
              name: plano.name,
              price: plano.price,
              description: plano.description,
              features: plano.features && plano.features.length > 0 
                ? plano.features.map((f: any) => typeof f === 'string' ? { value: f } : f) 
                : [{ value: "" }],
              billingCycle: plano.billingCycle as any,
              isActive: plano.isActive,
              serviceIds: plano.servicos ? plano.servicos.map((s: any) => s.id) : [],
              clienteIds: (clientes.data || [])
                .filter((c: any) => c.assinaturas?.some((a: any) => a.plano.id === plano.id && a.isActive))
                .map((c: any) => c.id),
            })
          } else {
            toast.error("Plano não encontrado")
            navigate("/planos")
          }
        }
      } catch (error) {
        toast.error("Erro ao carregar os dados do plano")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [id, isEditing, unidadeId, navigate, form, setIsLoading])

  const onSubmit = async (data: PlanoFormValues) => {
    try {
      if (!unidadeId) return
      setIsLoading(true)
      
      const payload = { 
        ...data, 
        features: data.features.map((f: any) => f.value),
        unidadeId 
      }
      
      if (isEditing) {
        await planoService.updatePlan(id, payload)
        toast.success("Plano atualizado com sucesso!")
      } else {
        await planoService.createPlan(payload)
        toast.success("Plano criado com sucesso!")
      }
      
      navigate("/planos")
    } catch (error) {
      toast.error("Erro ao salvar o plano")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/planos")}
            className="rounded-xl"
          >
            <ArrowLeft className="size-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="size-6" />
              </div>
              {isEditing ? "Editar Plano" : "Novo Plano"}
            </h1>
            <p className="text-muted-foreground font-medium text-sm mt-1 mb-8">
              {isEditing 
                ? "Ajuste os valores e benefícios deste plano de assinatura." 
                : "Defina o nome, preço e as vantagens do novo plano para seus clientes."}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Identificação & Custo</p>
                
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <Type className="size-3 text-primary" /> Nome do Plano
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Master Experience" className="h-12 bg-background/50 border-border rounded-xl focus:ring-primary/20" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <DollarSign className="size-3 text-primary" /> Valor Mensal
                      </FormLabel>
                      <FormControl>
                         <Input type="number" step="0.01" placeholder="0.00" className="h-12 bg-background/50 border-border rounded-xl focus:ring-primary/20" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <FormField control={form.control} name="billingCycle" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-muted-foreground">Ciclo</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background/50 border-border rounded-xl h-12">
                            <SelectValue placeholder="Selecione o ciclo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-border bg-card">
                          <SelectItem value="monthly" className="font-medium text-sm">Mensal</SelectItem>
                          <SelectItem value="yearly" className="font-medium text-sm">Anual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                <FormField control={form.control} name="description" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground mt-4 block">Descrição Curta</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva os benefícios gerais do plano..." className="bg-background/50 border-border rounded-xl focus:ring-primary/20 min-h-[80px] resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Serviços Cobertos pelo Plano</p>
                
                <FormField control={form.control} name="serviceIds" render={({ field }) => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                        <Scissors className="size-3 text-primary" /> Selecione os serviços
                      </FormLabel>
                      <p className="text-[10px] text-muted-foreground mt-1 mb-4">
                        Apenas os serviços marcados abaixo usarão o saldo de fichas do cliente.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
                      {servicosDisponiveis.map((service) => {
                        const isChecked = field.value?.includes(service.id) || false
                        return (
                          <div
                            key={service.id}
                            className={`flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-3 cursor-pointer transition-all ${
                              isChecked ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border/50 hover:bg-muted/50"
                            }`}
                            onClick={() => {
                              const currentValues = field.value || []
                              const newValue = isChecked
                                ? currentValues.filter((v) => v !== service.id)
                                : [...currentValues, service.id]
                              field.onChange(newValue)
                            }}
                          >
                            <div className={`size-5 rounded flex items-center justify-center border-2 transition-all ${isChecked ? "bg-primary border-primary text-primary-foreground" : "border-border/50 text-transparent"}`}>
                              <Check className="size-3.5" />
                            </div>
                            <div className="space-y-1 mt-0">
                              <FormLabel className="text-xs font-bold cursor-pointer">{service.name}</FormLabel>
                              <p className="text-[10px] text-muted-foreground">{service.creditsCost} {service.creditsCost === 1 ? 'ficha' : 'fichas'}</p>
                            </div>
                          </div>
                        )
                      })}
                      {servicosDisponiveis.length === 0 && (
                        <div className="col-span-full py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border font-medium">
                          Nenhum serviço cadastrado na unidade.
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
               <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Clientes Assinantes</p>
                <div className="relative mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input 
                    placeholder="Buscar clientes por nome..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12 pl-12 text-sm bg-background/50 border-border rounded-xl focus:ring-primary/20"
                  />
                </div>

                <FormField control={form.control} name="clienteIds" render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
                      {clientesDisponiveis
                        .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((cliente) => {
                          const isChecked = field.value?.includes(cliente.id) || false
                          return (
                            <div
                              key={cliente.id}
                              className={`flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-3 cursor-pointer transition-all ${
                                isChecked ? "bg-primary/5 border-primary shadow-sm" : "bg-card border-border/50 hover:bg-muted/50"
                              }`}
                              onClick={() => {
                                const currentValues = field.value || []
                                const newValue = isChecked
                                  ? currentValues.filter((v) => v !== cliente.id)
                                  : [...currentValues, cliente.id]
                                field.onChange(newValue)
                              }}
                            >
                              <div className={`size-5 rounded flex items-center justify-center border-2 transition-all ${isChecked ? "bg-primary border-primary text-primary-foreground" : "border-border/50 text-transparent"}`}>
                                <Check className="size-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <FormLabel className="text-[11px] font-bold cursor-pointer truncate block">{cliente.name}</FormLabel>
                                <p className="text-[9px] text-muted-foreground truncate">{cliente.email || cliente.phone}</p>
                              </div>
                              <Users className={`size-4 ${isChecked ? "text-primary/80" : "text-muted-foreground/30"}`} />
                            </div>
                          )
                        })}
                      {clientesDisponiveis.length === 0 && (
                        <div className="col-span-full py-6 text-center text-xs text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border font-medium">
                          Nenhum cliente disponível.
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="bg-card/40 border border-border/50 rounded-3xl p-6 sm:p-8 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-background/30 p-2 rounded-xl">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-2">Recursos & Vantagens</p>
                  <Button type="button" variant="ghost" size="sm" onClick={() => append({ value: "" })} className="h-8 text-xs font-bold text-primary hover:bg-primary/10 rounded-lg flex items-center gap-1">
                    <Plus className="size-4" /> Adicionar
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-3">
                      <div className="size-8 shrink-0 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shadow-sm">
                        <CheckCircle2 className="size-4" />
                      </div>
                      <Input 
                        placeholder={`Vantagem ${index + 1}`} 
                        className="h-11 bg-background/50 border-border rounded-xl text-sm focus:border-emerald-500/50" 
                        {...form.register(`features.${index}.value` as const)} 
                      />
                      {fields.length > 1 && (
                        <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="size-11 shrink-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-colors">
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-border/50">
                <FormField control={form.control} name="isActive" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                      <Activity className="size-3 text-primary" /> Status do Plano
                    </FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === "true")} value={field.value ? "true" : "false"}>
                      <FormControl>
                        <SelectTrigger className="bg-background/50 border-border rounded-xl h-12 w-full md:w-1/2">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-xl border-border bg-card">
                        <SelectItem value="true" className="font-medium text-sm">Disponível para Venda</SelectItem>
                        <SelectItem value="false" className="font-medium text-sm">Indisponível (Pausado)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="flex gap-4 pt-6 pb-12">
               <Button type="button" variant="outline" onClick={() => navigate("/planos")} className="flex-1 border-border text-foreground hover:bg-muted rounded-xl h-14 font-bold text-sm">
                 Cancelar
               </Button>
               <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-black rounded-xl h-14 shadow-xl shadow-primary/20 flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                  <Save className="size-4" />
                  {isEditing ? "Salvar Plano" : "Criar Plano"}
               </Button>
            </div>
          </form>
        </Form>
      </div>
    </AdminLayout>
  )
}
