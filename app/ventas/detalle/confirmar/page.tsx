'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Suspense } from "react"

function ConfirmarVentaDetalleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Obtener datos de la URL
  const cantidadPescados = searchParams.get('cantidadPescados')
  const pesoTotalLibras = searchParams.get('pesoTotalLibras')
  const precioPorLibra = searchParams.get('precioPorLibra')
  const cliente = searchParams.get('cliente')
  const notas = searchParams.get('notas')
  const tipoPreparacion = searchParams.get('tipoPreparacion')
  const tipoPago = searchParams.get('tipoPago')

  const totalPrecio = parseFloat(pesoTotalLibras || '0') * parseFloat(precioPorLibra || '0')

  const handleConfirmar = () => {
    // Aquí se enviarían los datos al servidor
    // Por ahora solo redirigimos a la página de éxito
    router.push('/ventas/detalle/exito')
  }

  const handleCancelar = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelar}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Atrás
          </Button>
          <h1 className="text-lg font-semibold">Registro de Venta</h1>
          <div className="w-10" /> {/* Espaciador */}
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Resumen de venta</h2>
          <p className="text-muted-foreground">Revisa los detalles antes de confirmar</p>
        </div>

        {/* Resumen */}
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cantidad:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {cantidadPescados} pescados
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Peso total:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {parseFloat(pesoTotalLibras || '0').toFixed(1)} libras
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Precio por libra:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {formatCurrency(parseFloat(precioPorLibra || '0'))}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Total:</span>
              <Badge variant="default" className="text-lg px-3 py-1 bg-green-600">
                {formatCurrency(totalPrecio)}
              </Badge>
            </div>
          </div>

          {/* Detalles adicionales */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Cliente:</span>
              <span className="text-muted-foreground">
                {cliente || 'Sin cliente'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Preparación:</span>
              <Badge variant="outline">
                {tipoPreparacion}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Pago:</span>
              <Badge variant={tipoPago === 'EFECTIVO' ? 'default' : 'destructive'}>
                {tipoPago}
              </Badge>
            </div>
            
            {notas && (
              <div className="flex justify-between items-start">
                <span className="font-medium">Notas:</span>
                <span className="text-muted-foreground text-right max-w-48">
                  {notas}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={handleConfirmar}
            className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700"
          >
            Confirmar Venta
          </Button>
          
          <Button
            variant="outline"
            onClick={handleCancelar}
            className="w-full h-12"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmarVentaDetallePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <ConfirmarVentaDetalleContent />
    </Suspense>
  )
} 