import { Link, useLocation } from "react-router-dom"
import { 
  Calendar, 
  DollarSign, 
  Scissors, 
  Users, 
  Menu 
} from "lucide-react"
import { cn } from "@/lib/utils"

import { useAuth } from "@/contexts/auth-context"

interface BottomNavItemProps {
  icon: typeof Calendar
  label: string
  href: string
  isActive?: boolean
  onClick?: () => void
}

const BottomNavItem = ({ icon: Icon, label, href, isActive, onClick }: BottomNavItemProps) => {
  return (
    <Link
      to={href}
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 flex-1 py-2 h-full transition-all",
        isActive 
          ? "text-primary bg-primary/5" 
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("size-5", isActive && "stroke-[2.5px]")} />
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </Link>
  )
}

interface BottomNavProps {
  onMenuClick: () => void
}

export function BottomNav({ onMenuClick }: BottomNavProps) {
  const location = useLocation()
  const { user } = useAuth()
  const userRole = user?.role || 'BARBER'

  const items = [
    { icon: Calendar, label: "Agenda", href: "/agenda", roles: ['OWNER', 'BARBER'] },
    { icon: DollarSign, label: "Financeiro", href: "/financeiro", roles: ['OWNER'] },
    { icon: Scissors, label: "Serviços", href: "/servicos", roles: ['OWNER'] },
    { icon: Users, label: "Clientes", href: "/clientes", roles: ['OWNER', 'BARBER'] },
  ]

  const visibleItems = items.filter(item => item.roles.includes(userRole as any))

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50 lg:hidden safe-area-pb">
      {visibleItems.map((item) => (
        <BottomNavItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          isActive={location.pathname.startsWith(item.href)}
        />
      ))}
      <button
        onClick={onMenuClick}
        className="flex flex-col items-center justify-center gap-1 flex-1 py-2 h-full text-muted-foreground hover:text-foreground transition-all"
      >
        <Menu className="size-5" />
        <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
      </button>
    </nav>
  )
}
