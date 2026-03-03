import { Search, Bell, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Header() {
  return (
    <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md group hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4 group-focus-within:text-primary transition-colors" />
          <Input 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all rounded-xl text-sm" 
            placeholder="Buscar..." 
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:bg-muted rounded-xl transition-colors">
          <Bell className="size-5" />
          <span className="absolute top-2.5 right-2.5 size-2 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
        </Button>
        
        <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 sm:px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95 group">
          <div className="bg-white/20 p-0.5 rounded-md group-hover:rotate-90 transition-transform">
            <Plus className="size-3.5 stroke-[3px]" />
          </div>
          <span className="hidden xs:inline">Novo</span>
        </Button>
      </div>
    </header>
  )
}
