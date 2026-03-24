import { useEffect } from "react"
import { getUser } from "@/lib/auth"
import { useLocation, useNavigate } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { BottomNav } from "./BottomNav"
import { Loader } from "@/components/ui/loader"
import { useLoading } from "@/components/loading-provider"
import { useState } from "react"
import { 
  Sheet, 
  SheetContent,
} from "@/components/ui/sheet"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { setIsLoading } = useLoading()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Iniciamos o loader na troca de rota
    setIsLoading(true)
    // Fechar menu mobile na troca de rota
    setIsMobileMenuOpen(false)

    // Verificar troca obrigatória de senha
    const user = getUser()
    if (user) {
      if (user.forcePasswordChange && location.pathname !== "/primeiro-acesso") {
        navigate("/primeiro-acesso")
      }
    }
  }, [location.pathname, setIsLoading, navigate])

  return (
    <div className="flex h-screen overflow-hidden bg-[#fafafa] dark:bg-[#0f172a] font-sans antialiased text-slate-900 dark:text-slate-100">
      <Loader />
      
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header />
        <main className="flex-1 overflow-y-scroll overflow-x-hidden p-4 sm:p-6 lg:p-8 scroll-smooth pb-24 lg:pb-8">
          <div className="mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Navigation */}
      <BottomNav onMenuClick={() => setIsMobileMenuOpen(true)} />

      {/* Mobile Menu Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 border-r-0 w-72 bg-card [&>button]:hidden">
          <div className="h-full overflow-y-auto">
             <Sidebar isMobile />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
