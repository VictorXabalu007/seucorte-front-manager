import { Link, useLocation } from "react-router-dom"
import { 
  type LucideIcon, 
  LayoutDashboard, 
  Package, 
  Scissors, 
  BarChart3, 
  Settings, 
  ChevronUp,
  Calendar,
  Users,
  DollarSign,
  PackageOpen,
  Percent,
  Target,
  CreditCard,
  Moon,
  Sun,
  Star,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { SheetClose } from "@/components/ui/sheet"
import logo from "@/assets/SeuCorte.svg"

import { useAuth } from "@/contexts/auth-context"

interface SidebarItemProps {
  icon: LucideIcon
  label: string
  href: string
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const location = useLocation()
  
  // Se for a home, exige match exato. Senão, aceita se o pathname começar com o href (para sub-rotas como /agenda-calendario)
  const active = href === "/" 
    ? location.pathname === href 
    : location.pathname.startsWith(href)

  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
        active 
          ? "bg-primary/10 text-primary font-semibold" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      )}
    >
      <Icon className={cn("size-5 transition-transform group-hover:scale-110", active ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
      <span className="text-sm">{label}</span>
    </Link>
  )
}

type UserRole = 'OWNER' | 'BARBER'

interface MenuItem {
  icon: LucideIcon
  label: string
  href: string
  roles: UserRole[]
}

interface MenuSection {
  section: string
  items: MenuItem[]
}

const MENU_CONFIG: MenuSection[] = [
  {
    section: "Operacional",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", roles: ['OWNER', 'BARBER'] },
      { icon: Calendar, label: "Agenda", href: "/agenda", roles: ['OWNER', 'BARBER'] },
      { icon: Users, label: "Clientes", href: "/clientes", roles: ['OWNER', 'BARBER'] },
      { icon: Scissors, label: "Serviços", href: "/servicos", roles: ['OWNER'] },
      { icon: PackageOpen, label: "Combos", href: "/combos", roles: ['OWNER'] },
      { icon: Package, label: "Estoque", href: "/estoque", roles: ['OWNER', 'BARBER'] },
      { icon: Star, label: "Barbeiros", href: "/barbeiros", roles: ['OWNER'] },
    ]
  },
  {
    section: "Financeiro",
    items: [
      { icon: DollarSign, label: "Financeiro", href: "/financeiro", roles: ['OWNER'] },
      { icon: Percent, label: "Comissões", href: "/comissao", roles: ['OWNER', 'BARBER'] },
      { icon: CreditCard, label: "Planos", href: "/planos", roles: ['OWNER'] },
    ]
  },
  {
    section: "Gestão",
    items: [
      { icon: BarChart3, label: "Relatórios", href: "/relatorios", roles: ['OWNER'] },  
      { icon: Target, label: "Metas", href: "/metas", roles: ['OWNER'] },
    ]
  },
  {
    section: "Sistema",
    items: [
      { icon: Settings, label: "Configurações", href: "/configuracoes", roles: ['OWNER', 'BARBER'] },
    ]
  }
]

export const Sidebar = ({ isMobile }: { isMobile?: boolean }) => {
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()

  const userRole = user?.role || 'BARBER'

  return (
    <aside className="w-64 bg-card flex-shrink-0 flex flex-col border-r border-border h-screen sticky top-0">
      <div className="p-6 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-primary size-9 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <img src={logo} alt="Logo" />
          </div>
          <div>
            <h1 className="text-foreground font-black text-lg tracking-tight leading-none uppercase">SeuCorte</h1>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mt-1">Admin Panel</p>
          </div>
        </Link>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="size-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {isMobile && (
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
              >
                <X className="size-4" />
              </Button>
            </SheetClose>
          )}
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto custom-scrollbar pb-10">
        {MENU_CONFIG.map((section) => {
          const visibleItems = section.items.filter(item => item.roles.includes(userRole))
          
          if (visibleItems.length === 0) return null

          return (
            <div key={section.section} className="space-y-1.5">
              <div className="pt-4 pb-2 px-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                  {section.section}
                </p>
              </div>
              {visibleItems.map((item) => (
                <SidebarItem 
                  key={item.href} 
                  icon={item.icon} 
                  label={item.label} 
                  href={item.href} 
                />
              ))}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div 
          onClick={logout}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer group"
        >
          <div className="size-9 rounded-full bg-muted border-2 border-border overflow-hidden ring-2 ring-transparent group-hover:ring-primary/50 transition-all">
            {user?.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} className="size-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-muted to-muted-foreground/20" />
            )}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-bold text-foreground truncate">{user?.name || 'Usuário'}</p>
            <p className="text-[10px] font-medium text-muted-foreground truncate uppercase tracking-wider">
              {user?.role === 'OWNER' ? 'Proprietário' : 'Barbeiro'}
            </p>
          </div>
          <ChevronUp className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
        </div>
      </div>
    </aside>
  )
}
