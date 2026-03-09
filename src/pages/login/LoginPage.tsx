import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Scissors } from "lucide-react"
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

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log("Login data:", data)
      toast.success("Bem-vindo de volta!")
      navigate("/estoque")
    } catch (error) {
      toast.error("Erro ao realizar login. Verifique suas credenciais.")
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
          <div className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-primary to-primary/40 shadow-2xl shadow-primary/20 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Scissors className="size-10 text-primary-foreground stroke-[2.5px]" />
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              SeuCorte<span className="text-primary italic">.admin</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Gerencie sua barbearia com estilo e precisão.
            </p>
          </div>
        </div>

        <div className="bg-card/30 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          {/* Internal Glow */}
          <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                        E-mail
                      </label>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            placeholder="seu@email.com"
                            {...field}
                            className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-[10px] font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          Senha
                        </label>
                        <button 
                          type="button"
                          className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                        >
                          Esqueceu?
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
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
                    Entrar no Sistema
                    <ArrowRight className="size-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs font-bold text-muted-foreground">
              Não tem uma conta?{" "}
              <button className="text-primary hover:underline decoration-2 underline-offset-4">
                Criar Unidade
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center space-y-2 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
            Premium Management for Barbers
          </p>
          <div className="flex justify-center gap-4 text-[10px] font-bold text-muted-foreground uppercase">
            <span>Privacidade</span>
            <span className="size-1 bg-white/20 rounded-full mt-1" />
            <span>Suporte</span>
            <span className="size-1 bg-white/20 rounded-full mt-1" />
            <span>v1.0.4</span>
          </div>
        </div>
      </div>
    </div>
  )
}
