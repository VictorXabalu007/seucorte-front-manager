import { useState, useEffect, useRef } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { Scissors, ArrowRight, Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { authService } from "@/services/auth"

export default function OtpVerificationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const email = searchParams.get("email") || ""
  const purpose = (searchParams.get("purpose") as 'email-verification' | 'password-reset') || 'email-verification'
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(60)
  const [isResending, setIsResending] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (!email) {
      navigate("/login")
      return
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [email, navigate])

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return

    const newOtp = [...otp]
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const data = e.clipboardData.getData("text").replace(/\D/g, "")
    if (!data) return

    const pasteData = data.slice(0, 6).split("")
    const newOtp = [...otp]
    
    pasteData.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char
      }
    })

    setOtp(newOtp)
    
    // Focus the last filled input or the first empty one
    const nextFocusIndex = Math.min(pasteData.length, 5)
    inputRefs.current[nextFocusIndex]?.focus()
  }

  const handleResend = async () => {
    if (resendTimer > 0 || isResending) return

    setIsResending(true)
    try {
      await authService.resendOtp({ email, purpose })
      setResendTimer(60)
    } finally {
      setIsResending(false)
    }
  }

  const handleVerify = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const otpValue = otp.join("")
    if (otpValue.length < 6) {
      toast.error("Por favor, insira o código de 6 dígitos.")
      return
    }

    setIsLoading(true)
    try {
      if (purpose === 'email-verification') {
        await authService.verifyEmail({ email, otp: otpValue })
        navigate("/login")
      } else {
        const response = await authService.verifyOtp({ email, otp: otpValue })
        navigate(`/reset-password?token=${response.resetToken}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-submit when last digit is entered
  useEffect(() => {
    if (otp.every(digit => digit !== "")) {
      handleVerify()
    }
  }, [otp])

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0a0a0b]">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 w-full max-w-[440px] px-6 py-12">
        <div className="text-center mb-10 space-y-4">
          <Link to="/login" className="inline-flex p-4 rounded-3xl bg-gradient-to-tr from-primary to-primary/40 shadow-2xl shadow-primary/20 mb-2 rotate-3 hover:rotate-0 transition-transform duration-500">
            <Scissors className="size-10 text-primary-foreground stroke-[2.5px]" />
          </Link>
          <div className="space-y-1">
            <h1 className="text-4xl font-black tracking-tighter text-white">
              Verifique seu <span className="text-primary italic">e-mail</span>
            </h1>
            <p className="text-muted-foreground font-medium text-sm">
              Enviamos um código de 6 dígitos para <span className="text-white font-bold">{email}</span>.
            </p>
          </div>
        </div>

        <div className="bg-card/30 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute -top-24 -right-24 size-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors duration-700" />
          
          <form className="space-y-8 relative z-10">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-16 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl font-black text-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                />
              ))}
            </div>

            <Button
              onClick={(e) => handleVerify(e)}
              disabled={isLoading || otp.some(d => d === "")}
              className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-widest gap-3 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  Verificar Código
                  <ArrowRight className="size-5" />
                </>
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendTimer > 0 || isResending}
                className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-white disabled:opacity-50 transition-colors"
              >
                {isResending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <RefreshCw className={`size-4 ${resendTimer > 0 ? '' : 'animate-spin-slow'}`} />
                )}
                {resendTimer > 0 ? `Reenviar em ${resendTimer}s` : 'Reenviar código agora'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center opacity-40 hover:opacity-100 transition-opacity duration-500">
           <Link to="/login" className="text-[10px] font-black text-white uppercase tracking-[0.2em] hover:text-primary transition-colors">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  )
}
