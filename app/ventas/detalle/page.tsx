'use client'

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Minus, Info } from "lucide-react"
import { getClientes, getPrecioPorTipo } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"
import { TopNav } from "@/components/top-nav"

function VentaDetalleContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [clientes, setClientes] = useState<Array<{id: number, nombre: string}>>([])
  const [pesoTotalLibras, setPesoTotalLibras] = useState(searchParams.get('pesoTotalLibras') || '')
  const [cantidadPescados, setCantidadPescados] = useState(searchParams.get('cantidadPescados') || '')
  const [precioPorLibra, setPrecioPorLibra] = useState(0)
  const [clienteId, setClienteId] = useState('consumidor-final')
  const [tipoPreparacion, setTipoPreparacion] = useState<'VIVO' | 'LIMPIO'>((searchParams.get('tipoPreparacion') as 'VIVO' | 'LIMPIO') || 'VIVO')
  const [notas, setNotas] = useState(searchParams.get('notas') || '')
  const [showInfoModal, setShowInfoModal] = useState(false)

  // Cargar clientes al montar el componente
  useEffect(() => {
    const cargarClientes = async () => {
      const clientesData = await getClientes()
      setClientes(clientesData)
    }
    cargarClientes()
  }, [])

  // Actualizar precio cuando cambie el tipo de preparación
  useEffect(() => {
    const actualizarPrecio = async () => {
      const precio = await getPrecioPorTipo(tipoPreparacion, false)
      setPrecioPorLibra(precio)
    }
    actualizarPrecio()
  }, [tipoPreparacion])

  // Calcular precio total
  const precioTotal = parseFloat(pesoTotalLibras || '0') * precioPorLibra

  const handleCantidadChange = (value: string) => {
    setCantidadPescados(value)
  }

  const handlePesoChange = (value: string) => {
    setPesoTotalLibras(value)
  }

  const incrementarCantidad = () => {
    const actual = parseInt(cantidadPescados) || 0
    setCantidadPescados((actual + 1).toString())
  }

  const decrementarCantidad = () => {
    const actual = parseInt(cantidadPescados) || 0
    if (actual > 0) {
      setCantidadPescados((actual - 1).toString())
    }
  }

  const incrementarPeso = () => {
    const actual = parseFloat(pesoTotalLibras) || 0
    setPesoTotalLibras((actual + 0.5).toFixed(1))
  }

  const decrementarPeso = () => {
    const actual = parseFloat(pesoTotalLibras) || 0
    if (actual > 0) {
      setPesoTotalLibras((actual - 0.5).toFixed(1))
    }
  }

  const handleRegistrarVenta = () => {
    if (!cantidadPescados || !pesoTotalLibras) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    // Construir URL con parámetros
    const params = new URLSearchParams({
      cantidadPescados,
      pesoTotalLibras,
      precioPorLibra: precioPorLibra.toString(),
      cliente: clienteId === 'consumidor-final' ? 'Consumidor Final' : clientes.find(c => c.id.toString() === clienteId)?.nombre || '',
      notas,
      tipoPreparacion
    })

    router.push(`/ventas/detalle/confirmar?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <TopNav title="Venta Detalle" showBack={true} />

      {/* Calculadora de precio */}
      <div className="bg-green-100 p-4 mx-4 mt-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-green-800">
            Precio Total: {formatCurrency(precioTotal)}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-green-800"
            onClick={() => setShowInfoModal(true)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Formulario */}
      <div className="p-4 space-y-6">
        {/* Peso total */}
        <div className="space-y-2">
          <Label htmlFor="pesoTotalLibras" className="text-base font-medium">
            Peso total (lbs)
          </Label>
          <div className="flex items-center space-x-3">
            <Input
              id="pesoTotalLibras"
              type="number"
              step="0.1"
              value={pesoTotalLibras}
              onChange={(e) => handlePesoChange(e.target.value)}
              placeholder="0.0"
              className="flex-1 h-12 text-lg"
              inputMode="decimal"
            />
            <Button
              onClick={decrementarPeso}
              variant="outline"
              size="icon"
              className="h-12 w-12"
            >
              <Minus className="h-6 w-6" />
            </Button>
            <Button
              onClick={incrementarPeso}
              variant="outline"
              size="icon"
              className="h-12 w-12"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Cantidad de pescados */}
        <div className="space-y-2">
          <Label htmlFor="cantidadPescados" className="text-base font-medium">
            Cantidad Pescado
          </Label>
          <div className="flex items-center space-x-3">
            <Input
              id="cantidadPescados"
              type="number"
              value={cantidadPescados}
              onChange={(e) => handleCantidadChange(e.target.value)}
              placeholder="0"
              className="flex-1 h-12 text-lg"
              inputMode="numeric"
            />
            <Button
              onClick={decrementarCantidad}
              variant="outline"
              size="icon"
              className="h-12 w-12"
            >
              <Minus className="h-6 w-6" />
            </Button>
            <Button
              onClick={incrementarCantidad}
              variant="outline"
              size="icon"
              className="h-12 w-12"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Tipo de preparación */}
        <div className="space-y-2">
          <Label htmlFor="tipoPreparacion" className="text-base font-medium">
            Preparación
          </Label>
          <div className="flex space-x-3">
            <Button
              onClick={() => setTipoPreparacion('VIVO')}
              variant={tipoPreparacion === 'VIVO' ? 'default' : 'outline'}
              className="flex-1 h-12 text-lg"
            >
              Vivo
            </Button>
            <Button
              onClick={() => setTipoPreparacion('LIMPIO')}
              variant={tipoPreparacion === 'LIMPIO' ? 'default' : 'outline'}
              className="flex-1 h-12 text-lg"
            >
              Limpio
            </Button>
          </div>
        </div>

        {/* Cliente */}
        <div className="space-y-2">
          <Label htmlFor="cliente" className="text-base font-medium">
            Cliente
          </Label>
          <Select value={clienteId} onValueChange={setClienteId}>
            <SelectTrigger className="h-12 text-lg w-full">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="consumidor-final">Consumidor Final</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id.toString()}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notas */}
        <div className="space-y-2">
          <Label htmlFor="notas" className="text-base font-medium">
            Nota
          </Label>
          <Textarea
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas adicionales..."
            className="min-h-24 text-base w-full"
          />
        </div>

        {/* Botón registrar */}
        <Button
          onClick={handleRegistrarVenta}
          disabled={!cantidadPescados || !pesoTotalLibras}
          className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700"
        >
          Registrar Venta
        </Button>
      </div>

      {/* Modal informativo */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Información del Precio</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Cálculo del Precio Total</h3>
              <p className="text-sm text-muted-foreground">
                El precio total se calcula multiplicando el peso total por el precio por libra:
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-mono text-sm">
                  Precio Total = Peso Total (lbs) × Precio por Libra
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold">Precios por Preparación</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>Pescado Vivo:</span>
                  <span className="font-medium">{formatCurrency(45)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pescado Limpio:</span>
                  <span className="font-medium">{formatCurrency(50)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Ejemplo</h3>
              <p className="text-sm text-muted-foreground">
                Si vendes 10 lbs de pescado vivo a {formatCurrency(45)} por libra:
              </p>
              <div className="bg-muted p-3 rounded-lg">
                <p className="font-mono text-sm">
                  10 lbs × {formatCurrency(45)} = {formatCurrency(450)}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function VentaDetallePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <VentaDetalleContent />
    </Suspense>
  )
} 