"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, BarChart3, Users, Package, Settings, Plus } from "lucide-react"
import { SalesModal } from "./sales-modal"
import { useState } from "react"

export function BottomNav() {
  const pathname = usePathname()
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false)

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Inicio"
    },
    {
      href: "/ventas",
      icon: Package,
      label: "Ventas"
    },
    {
      href: "/reportes",
      icon: BarChart3,
      label: "Reportes"
    },
    {
      href: "/clientes",
      icon: Users,
      label: "Clientes"
    },
    {
      href: "/stock",
      icon: Package,
      label: "Stock"
    },
    {
      href: "/config",
      icon: Settings,
      label: "Config"
    }
  ]

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t">
        <div className="flex items-center justify-between px-4 py-2">
          {/* Navegación izquierda */}
          <div className="flex items-center space-x-2">
            {navItems.slice(0, 2).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Botón central de venta */}
          <Button
            onClick={() => setIsSalesModalOpen(true)}
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
          >
            <Plus className="h-8 w-8" />
          </Button>

          {/* Navegación derecha */}
          <div className="flex items-center space-x-2">
            {navItems.slice(2, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <SalesModal 
        isOpen={isSalesModalOpen} 
        onClose={() => setIsSalesModalOpen(false)} 
      />
    </>
  )
} 