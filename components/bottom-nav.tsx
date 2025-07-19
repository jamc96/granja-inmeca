"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, ShoppingCart, BarChart3, Users, Package, Settings, Fish } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Inicio",
    href: "/",
    icon: Home,
  },
  {
    title: "Ventas",
    href: "/ventas",
    icon: ShoppingCart,
  },
  {
    title: "Reportes",
    href: "/reportes",
    icon: BarChart3,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    title: "Stock",
    href: "/stock",
    icon: Package,
  },
  {
    title: "Config",
    href: "/config",
    icon: Settings,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.title}</span>
            </Link>
          )
        })}
      </div>
      
      {/* Botones de acciones rápidas */}
      <div className="flex justify-center gap-4 p-2 bg-muted/50">
        <Link href="/ventas/mayoreo">
          <Button size="sm" className="h-8 px-3 text-xs">
            <Package className="h-3 w-3 mr-1" />
            Mayoreo
          </Button>
        </Link>
        <Link href="/ventas/detalle">
          <Button size="sm" variant="secondary" className="h-8 px-3 text-xs">
            <Fish className="h-3 w-3 mr-1" />
            Detalle
          </Button>
        </Link>
      </div>
    </nav>
  )
} 