import { useState, useEffect } from "react"
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  Loader2, 
  DollarSign, 
  ShieldCheck,
  Info,
  Zap,
  Percent
} from "lucide-react"
import { toast } from "sonner"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { useLoading } from "@/components/loading-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { unidadesService } from "../unidades/services/unidades.service"
import { getActiveUnidadeId } from "@/lib/auth"
import type { Unidade } from "../unidades/types"

export default function SettingsPage() {
  const { setIsLoading } = useLoading()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [unidade, setUnidade] = useState<Unidade | null>(null)

  const fetchUnidade = async () => {
    const id = getActiveUnidadeId()
    if (!id) {
      toast.error("Unidade não encontrada")
      setLoading(false)
      setIsLoading(false)
      return
    }

    try {
      const data = await unidadesService.getUnidade(id)
      setUnidade(data)
    } catch (error) {
      toast.error("Erro ao carregar dados da barbearia")
    } finally {
      setLoading(false)
      setIsLoading(false) // Desativa o loader global do AdminLayout
    }
  }

  useEffect(() => {
    fetchUnidade()
    
    // Garantir que o loader global seja desativado em caso de erro catastrófico
    return () => setIsLoading(false)
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!unidade) return

    setSaving(true)
    try {
      await unidadesService.updateUnidade(unidade.id, {
        name: unidade.name,
        phone: unidade.phone || undefined,
        email: unidade.email || undefined,
        zip: unidade.zip || undefined,
        street: unidade.street || undefined,
        number: unidade.number || undefined,
        complement: unidade.complement || undefined,
        neighborhood: unidade.neighborhood || undefined,
        city: unidade.city || undefined,
        state: unidade.state || undefined,
        planRevenueShareEnabled: unidade.planRevenueShareEnabled,
        planOwnerMargin: Number(unidade.planOwnerMargin)
      })
      toast.success("Configurações salvas com sucesso!")
      fetchUnidade()
    } catch (error) {
      toast.error("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <div>
          <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-tr from-foreground to-foreground/60 bg-clip-text text-transparent">
            Configurações da Barbearia
          </h1>
          <p className="text-muted-foreground font-medium text-sm mt-1">
            Gerencie as informações básicas e regras de negócio da sua unidade.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-[2rem]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-primary/10 rounded-2xl text-primary">
                  <Building2 size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Informações Básicas</CardTitle>
                  <CardDescription>Nome, contato e identificação da sua unidade.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Nome da Barbearia</Label>
                  <div className="relative">
                    <Input 
                      id="name"
                      required
                      value={unidade?.name || ""}
                      onChange={e => setUnidade(prev => prev ? {...prev, name: e.target.value} : null)}
                      className="h-12 rounded-2xl pl-11 bg-background/50 border-border/50 focus:border-primary/50 transition-all font-bold"
                    />
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Telefone / WhatsApp</Label>
                  <div className="relative">
                    <Input 
                      id="phone"
                      value={unidade?.phone || ""}
                      onChange={e => setUnidade(prev => prev ? {...prev, phone: e.target.value} : null)}
                      className="h-12 rounded-2xl pl-11 bg-background/50 border-border/50 focus:border-primary/50 transition-all font-bold"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">E-mail para Contato</Label>
                  <div className="relative">
                    <Input 
                      id="email"
                      type="email"
                      value={unidade?.email || ""}
                      onChange={e => setUnidade(prev => prev ? {...prev, email: e.target.value} : null)}
                      className="h-12 rounded-2xl pl-11 bg-background/50 border-border/50 focus:border-primary/50 transition-all font-bold"
                    />
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-[2rem]">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <MapPin size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Endereço e Localização</CardTitle>
                  <CardDescription>Onde seus clientes encontram você.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">CEP</Label>
                  <Input 
                    value={unidade?.zip || ""}
                    onChange={e => setUnidade(prev => prev ? {...prev, zip: e.target.value} : null)}
                    className="h-12 rounded-2xl bg-background/50 border-border/50 font-bold"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Rua / Logradouro</Label>
                  <Input 
                    value={unidade?.street || ""}
                    onChange={e => setUnidade(prev => prev ? {...prev, street: e.target.value} : null)}
                    className="h-12 rounded-2xl bg-background/50 border-border/50 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Número</Label>
                  <Input 
                    value={unidade?.number || ""}
                    onChange={e => setUnidade(prev => prev ? {...prev, number: e.target.value} : null)}
                    className="h-12 rounded-2xl bg-background/50 border-border/50 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Bairro</Label>
                  <Input 
                    value={unidade?.neighborhood || ""}
                    onChange={e => setUnidade(prev => prev ? {...prev, neighborhood: e.target.value} : null)}
                    className="h-12 rounded-2xl bg-background/50 border-border/50 font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Cidade / UF</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={unidade?.city || ""}
                      placeholder="Cidade"
                      onChange={e => setUnidade(prev => prev ? {...prev, city: e.target.value} : null)}
                      className="h-12 rounded-2xl bg-background/50 border-border/50 font-bold flex-1"
                    />
                    <Input 
                      value={unidade?.state || ""}
                      placeholder="UF"
                      maxLength={2}
                      onChange={e => setUnidade(prev => prev ? {...prev, state: e.target.value.toUpperCase()} : null)}
                      className="h-12 rounded-2xl bg-background/50 border-border/50 font-bold w-16 text-center"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rateio de Planos */}
          <Card className="border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden rounded-[2rem]">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-2xl text-purple-500">
                    <Zap size={24} />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold">Rateio de Assinaturas</CardTitle>
                    <CardDescription>Configure como a receita dos planos é dividida.</CardDescription>
                  </div>
                </div>
                <Switch 
                  checked={unidade?.planRevenueShareEnabled}
                  onCheckedChange={checked => setUnidade(prev => prev ? {...prev, planRevenueShareEnabled: checked} : null)}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {unidade?.planRevenueShareEnabled ? (
                <div className="bg-purple-500/5 border border-purple-500/10 rounded-3xl p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 mt-1">
                      <ShieldCheck size={28} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-purple-900 dark:text-purple-100">O sistema de rateio está ATIVO</h4>
                      <p className="text-sm text-purple-600/80 dark:text-purple-400/80 mt-1 font-medium leading-relaxed">
                        A receita líquida das assinaturas (mensalidades) será distribuída entre os barbeiros que realizarem atendimentos via plano, de forma proporcional às fichas acumuladas.
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-500/10">
                    <Label htmlFor="margin" className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 ml-1">Margem da Barbearia (%)</Label>
                    <div className="mt-2 relative max-w-[240px]">
                      <Input 
                        id="margin"
                        type="number"
                        min="0"
                        max="100"
                        value={unidade?.planOwnerMargin || 0}
                        onChange={e => setUnidade(prev => prev ? {...prev, planOwnerMargin: Number(e.target.value)} : null)}
                        className="h-12 rounded-2xl pl-11 bg-background/50 border-purple-500/20 focus:border-purple-500/50 transition-all font-black text-xl"
                      />
                      <Percent className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-purple-500" />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                      <Info className="size-3" />
                      Este percentual será calculado sobre a receita bruta mensal de planos antes da distribuição para os barbeiros.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 opacity-70">
                   <div className="p-4 bg-muted rounded-full">
                     <Zap size={32} className="text-muted-foreground" />
                   </div>
                   <div className="space-y-1">
                     <h4 className="font-bold">Rateio Desativado</h4>
                     <p className="text-sm text-muted-foreground max-w-sm">
                       Os serviços de plano não gerarão comissão automática nem participarão do rateio mensal até que você ative esta opção.
                     </p>
                   </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer fixo ou no final da página */}
          <div className="flex justify-end pt-4 pb-10">
             <Button
               type="submit"
               disabled={saving}
               className="h-14 rounded-2xl px-12 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg gap-3 shadow-2xl shadow-primary/20 transition-all border-0"
             >
                {saving ? <Loader2 className="size-6 animate-spin" /> : <Save className="size-6" />}
                SALVAR ALTERAÇÕES
             </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
