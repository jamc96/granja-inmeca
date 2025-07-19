'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Package, Fish } from "lucide-react"
import { useRouter } from "next/navigation"

interface SalesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SalesModal({ isOpen, onClose }: SalesModalProps) {
  const router = useRouter()

  const handleSelectSaleType = (type: 'mayoreo' | 'detalle') => {
    onClose()
    router.push(`/ventas/${type}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-semibold">
            Seleccionar Tipo de Venta
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 p-4">
          <Button
            onClick={() => handleSelectSaleType('mayoreo')}
            className="h-16 text-lg font-medium bg-green-600 hover:bg-green-700"
          >
            <Package className="mr-3 h-6 w-6" />
            Venta al Mayoreo
          </Button>
          <Button
            onClick={() => handleSelectSaleType('detalle')}
            className="h-16 text-lg font-medium bg-blue-600 hover:bg-blue-700"
          >
            <Fish className="mr-3 h-6 w-6" />
            Venta al Detalle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 