import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Mail, ArrowRight, Loader2, Scissors, ChevronLeft } from "lucide-react"
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

const forgotPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)
    try {
      await authService.forgotPassword(data.email)
      toast.success("Se o e-mail existir, um código foi enviado.")
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}&purpose=password-reset`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao solicitar recuperação.")
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
          <Link to="/login" className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-primary to-primary/40 shadow-2xl shadow-primary/20 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Scissors className="size-10 text-primary-foreground stroke-[2.5px]" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              Recuperar <span className="text-primary italic">senha</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Insira seu e-mail para receber o código de verificação.
            </p>
          </div>
        </div>

        <div className="bg-card/30 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                      E-mail de Cadastro
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

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    Enviar Código
                    <ArrowRight className="size-5" />
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
              <ChevronLeft className="size-4" />
              Voltar ao Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
