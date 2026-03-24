import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  Scissors, 
  User, 
  Building2, 
  Phone,
  MapPin,
  Hash,
  Navigation,
  Map,
  CheckCircle2
} from "lucide-react"
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

const registerSchema = z.object({
  // Passo 1: Usuário
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A confirmação deve ter pelo menos 6 caracteres"),
  
  // Passo 2: Unidade
  unitName: z.string().min(3, "O nome da unidade deve ter pelo menos 3 caracteres"),
  zip: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(3, "Bairro é obrigatório"),
  city: z.string().min(3, "Cidade é obrigatória"),
  state: z.string().length(2, "UF deve ter 2 caracteres"),
  complement: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      unitName: "",
      password: "",
      confirmPassword: "",
      zip: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      complement: "",
    },
  })

  const nextStep = async () => {
    const fieldsStep1 = ["name", "email", "phone", "password", "confirmPassword"] as const
    const isValid = await form.trigger(fieldsStep1)
    if (isValid) setStep(2)
  }

  const prevStep = () => {
    setStep(1)
  }

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const { confirmPassword, ...registerData } = data
      await authService.register(registerData)
      
      navigate(`/verify-email?email=${encodeURIComponent(data.email)}&purpose=email-verification`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a0b] py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-[550px] px-6">
        <div className="text-center mb-10 space-y-4">
          <Link to="/login" className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-primary to-primary/40 shadow-2xl shadow-primary/20 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Scissors className="size-10 text-primary-foreground stroke-[2.5px]" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              SeuCorte<span className="text-primary italic">.admin</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              {step === 1 ? "Crie sua conta pessoal para começar" : "Agora, as informações da sua barbearia"}
            </p>
          </div>
        </div>

        {/* Stepper Indicator */}
        <div className="flex justify-center mb-8 gap-4">
          <div className="flex items-center gap-2">
            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step >= 1 ? "bg-primary border-primary text-primary-foreground" : "border-white/10 text-white/40"}`}>
              {step > 1 ? <CheckCircle2 className="size-4" /> : "1"}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step >= 1 ? "text-white" : "text-white/40"}`}>Conta</span>
          </div>
          <div className={`w-12 h-[2px] self-center rounded-full transition-colors ${step === 2 ? "bg-primary" : "bg-white/10"}`} />
          <div className="flex items-center gap-2">
            <div className={`size-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step === 2 ? "bg-primary border-primary text-primary-foreground" : "border-white/10 text-white/40"}`}>
              2
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${step === 2 ? "text-white" : "text-white/40"}`}>Unidade</span>
          </div>
        </div>

        <div className="bg-card/30 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          {/* Internal Glow */}
          <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              
              {/* STEP 1: USER INFO */}
              {step === 1 && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-right-4 duration-500">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Nome Completo
                        </label>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              placeholder="Seu nome"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Telefone Pessoal
                        </label>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              placeholder="(00) 00000-0000"
                              {...field}
                              className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Senha
                          </label>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
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
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Confirmar
                          </label>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center gap-2 ml-1">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primary/80 transition-colors"
                    >
                      {showPassword ? "Ocultar Senhas" : "Mostrar Senhas"}
                    </button>
                  </div>

                  <Button
                    type="button"
                    onClick={nextStep}
                    className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Próximo Passo
                    <ArrowRight className="size-5" />
                  </Button>
                </div>
              )}

              {/* STEP 2: UNIT INFO */}
              {step === 2 && (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                  <FormField
                    control={form.control}
                    name="unitName"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Nome da Unidade
                        </label>
                        <FormControl>
                          <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                            <Input
                              placeholder="Ex: Barbearia Estilo"
                              {...field}
                              className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            CEP
                          </label>
                          <FormControl>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <Input
                                placeholder="00000-000"
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
                      name="neighborhood"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Bairro
                          </label>
                          <FormControl>
                            <div className="relative">
                              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                              <Input
                                placeholder="Bairro"
                                {...field}
                                className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="street"
                        render={({ field }) => (
                          <FormItem>
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                              Logradouro (Rua)
                            </label>
                            <FormControl>
                              <div className="relative">
                                <Map className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                  placeholder="Rua..."
                                  {...field}
                                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                              Número
                            </label>
                            <FormControl>
                              <div className="relative">
                                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input
                                  placeholder="Nº"
                                  {...field}
                                  className="pl-12 h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                                />
                              </div>
                            </FormControl>
                            <FormMessage className="text-[10px] font-bold" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="complement"
                    render={({ field }) => (
                      <FormItem>
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                          Complemento (Opcional)
                        </label>
                        <FormControl>
                          <Input
                            placeholder="Sala, Andar, Ponto de ref..."
                            {...field}
                            className="h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-bold" />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Cidade
                          </label>
                          <FormControl>
                            <Input
                              placeholder="Cidade"
                              {...field}
                              className="h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                            Estado (UF)
                          </label>
                          <FormControl>
                            <Input
                              placeholder="UF"
                              maxLength={2}
                              {...field}
                              className="h-14 bg-white/5 border-white/10 rounded-2xl focus-visible:ring-primary/20 focus-visible:border-primary font-bold transition-all placeholder:text-white/20 uppercase"
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-bold" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4 pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="w-1/3 h-14 border-white/10 bg-transparent hover:bg-white/5 text-white rounded-2xl font-black uppercase tracking-widest gap-3 transition-all"
                    >
                      <ArrowLeft className="size-5" />
                      Voltar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <Loader2 className="size-5 animate-spin" />
                      ) : (
                        <>
                          Finalizar Cadastro
                          <ArrowRight className="size-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs font-bold text-muted-foreground">
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary hover:underline decoration-2 underline-offset-4">
                Fazer Login
              </Link>
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
            <span>v1.0.5</span>
          </div>
        </div>
      </div>
    </div>
  )
}
