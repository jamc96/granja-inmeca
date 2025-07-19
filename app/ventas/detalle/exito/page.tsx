'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home } from "lucide-react"

export default function ExitoVentaDetallePage() {
  const router = useRouter()

  const handleVolverInicio = () => {
    router.push('/')
  }

  const handleNuevaVenta = () => {
    router.push('/ventas/detalle')
  }

  return (
    <div className="min-h-screen bg-background pb-20 flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-center">
          <h1 className="text-lg font-semibold">Venta Registrada</h1>
        </div>
      </div>

      {/* Contenido */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <CheckCircle className="h-24 w-24 text-green-600 mb-6" />
        
        <h2 className="text-2xl font-bold mb-4">
          ¡Venta Registrada Exitosamente!
        </h2>
        
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          La venta al detalle ha sido registrada en el sistema. 
          Puedes ver el resumen en la sección de reportes.
        </p>

        {/* Botones */}
        <div className="space-y-4 w-full max-w-sm">
          <Button
            onClick={handleVolverInicio}
            className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700"
          >
            <Home className="h-5 w-5 mr-2" />
            Volver al Inicio
          </Button>
          
          <Button
            variant="outline"
            onClick={handleNuevaVenta}
            className="w-full h-12"
          >
            Registrar Otra Venta
          </Button>
        </div>
      </div>
    </div>
  )
} 