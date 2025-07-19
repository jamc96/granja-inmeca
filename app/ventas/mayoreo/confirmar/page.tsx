'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Suspense } from "react"
import { useState } from "react"
import { TopNav } from "@/components/top-nav"

function ConfirmarVentaMayoreoContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [tipoPago, setTipoPago] = useState<'EFECTIVO' | 'CREDITO'>('EFECTIVO')

  // Obtener datos de la URL
  const pesajes = searchParams.get('pesajes')
  const precioPorLibra = searchParams.get('precioPorLibra')
  const cliente = searchParams.get('cliente')
  const notas = searchParams.get('notas')
  const tipoPreparacion = searchParams.get('tipoPreparacion')

  // Parsear pesajes
  const pesajesArray = pesajes ? JSON.parse(decodeURIComponent(pesajes)) : []
  const totalLibras = pesajesArray.reduce((sum: number, pesaje: {pesoLibras: string}) => sum + parseFloat(pesaje.pesoLibras), 0)
  const totalPrecio = totalLibras * parseFloat(precioPorLibra || '0')

  const handleConfirmar = () => {
    // Aquí se enviarían los datos al servidor
    // Por ahora solo redirigimos a la página de éxito
    router.push('/ventas/mayoreo/exito')
  }

  const handleCancelar = () => {
    // Reconstruir la URL con los datos originales para preservar el state
    const params = new URLSearchParams({
      pesajes: pesajes || '',
      precioPorLibra: precioPorLibra || '',
      cliente: cliente || '',
      notas: notas || '',
      tipoPreparacion: tipoPreparacion || ''
    })
    router.push(`/ventas/mayoreo?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav title="Registro de Venta" showBack={true} onBack={handleCancelar} />

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
              <span className="font-medium">Total de canastas:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {pesajesArray.length} canastas
              </Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Peso total:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {totalLibras.toFixed(1)} libras
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

          {/* Detalles de pesajes */}
          {pesajesArray.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Detalles de pesajes:</h3>
              <div className="space-y-2">
                {pesajesArray.map((pesaje: {pesoLibras: string}, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-muted/30 p-2 rounded">
                    <span>Canasta {index + 1}:</span>
                    <span className="font-medium">{pesaje.pesoLibras} lbs</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
            
            <div className="space-y-2">
              <Label className="text-base font-medium">Tipo de Pago</Label>
              <Select value={tipoPago} onValueChange={(value: 'EFECTIVO' | 'CREDITO') => setTipoPago(value)}>
                <SelectTrigger className="h-12 text-lg w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="CREDITO">Crédito</SelectItem>
                </SelectContent>
              </Select>
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
            Regresar
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmarVentaMayoreoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <ConfirmarVentaMayoreoContent />
    </Suspense>
  )
} 