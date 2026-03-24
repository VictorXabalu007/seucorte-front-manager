import { useLoading } from "@/components/loading-provider"
import { cn } from "@/lib/utils"
import logo from "@/assets/SeuCorte.svg"

export function Loader() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-background/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative flex flex-col items-center gap-4">
        {/* Outer Ring */}
        <div className="size-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        
        {/* Inner Pulse */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="size-10 rounded-full bg-primary/40 animate-pulse" />
        </div>

        {/* Brand Logo/Initial */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary size-8 rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
          {/* <span className="text-primary-foreground font-bold text-lg">B</span> */}
          <img src={logo} alt="Logo" />
        </div>

        <div className="flex flex-col items-center">
          <p className="text-foreground font-black text-xl tracking-tighter uppercase animate-pulse">
            SeuCorte
          </p>
          <div className="flex gap-1 mt-1">
            <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="size-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="size-1.5 rounded-full bg-primary animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  )
}
