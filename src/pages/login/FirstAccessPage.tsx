import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Lock, Eye, EyeOff, ArrowRight, Loader2, Scissors, ShieldAlert } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { authService } from "@/services/auth"

const firstAccessSchema = z.object({
  password: z.string().min(6, "A nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type FirstAccessFormData = z.infer<typeof firstAccessSchema>

export default function FirstAccessPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<FirstAccessFormData>({
    resolver: zodResolver(firstAccessSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (data: FirstAccessFormData) => {
    setIsLoading(true)
    try {
      await authService.changePassword(data.password)
      
      // Atualiza o dado do usuário no localStorage para remover o flag
      const storedUser = localStorage.getItem("@BarberFlow:user")
      if (storedUser) {
        const user = JSON.parse(storedUser)
        user.forcePasswordChange = false
        localStorage.setItem("@BarberFlow:user", JSON.stringify(user))
      }

      toast.success("Senha atualizada com sucesso!")
      navigate("/estoque")
    } catch (error: any) {
      // O toast de erro genérico agora é disparado pelo interceptor
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a0b]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-[440px] px-6 py-12">
        <div className="text-center mb-10 space-y-4">
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-500/40 shadow-2xl shadow-amber-500/20 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
            <ShieldAlert className="size-10 text-white stroke-[2.5px]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase">
              Primeiro Acesso
            </h1>
            <p className="text-muted-foreground font-medium text-xs max-w-[280px] mx-auto">
              Por segurança, você deve alterar sua senha padrão antes de acessar o painel.
            </p>
          </div>
        </div>

        <div className="bg-card/30 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Nova Senha
                      </label>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Sua nova senha"
                            {...field}
                            className="pl-12 pr-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        Confirmar Senha
                      </label>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirme sua senha"
                            {...field}
                            className="pl-12 pr-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    Configurar Senha
                    <ArrowRight className="size-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        <div className="mt-8 text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
           <div className="flex justify-center gap-4 text-[10px] font-black text-white uppercase tracking-[0.2em] items-center">
            <Scissors className="size-3" />
            <span>SeuCorte Premium Security</span>
          </div>
        </div>
      </div>
    </div>
  )
}
