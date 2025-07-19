"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Fish, Calculator } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { createVentaDetalle, getClientes, getPrecioPorTipo } from "@/lib/actions"
import { useRouter } from "next/navigation"

export default function VentaDetallePage() {
  const router = useRouter()
  const [clienteId, setClienteId] = useState<string>("")
  const [tipoPreparacion, setTipoPreparacion] = useState<"VIVO" | "LIMPIO">("VIVO")
  const [cantidadPescados, setCantidadPescados] = useState<number>(0)
  const [pesoTotalLibras, setPesoTotalLibras] = useState<number>(0)
  const [precioPorLibra, setPrecioPorLibra] = useState<number>(45)
  const [tipoPago, setTipoPago] = useState<"EFECTIVO" | "CREDITO">("EFECTIVO")
  const [notas, setNotas] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [clientes, setClientes] = useState<Array<{id: number, nombre: string}>>([])
  const [isLoading, setIsLoading] = useState(false)

  const totalPrecio = pesoTotalLibras * precioPorLibra
  const promedioPorPescado = cantidadPescados > 0 ? pesoTotalLibras / cantidadPescados : 0

  // Cargar clientes y precios al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      const clientesData = await getClientes()
      setClientes(clientesData)
      
      // Cargar precio por defecto
      const precio = await getPrecioPorTipo(tipoPreparacion, false)
      setPrecioPorLibra(precio)
    }
    cargarDatos()
  }, [])

  // Actualizar precio cuando cambie el tipo de preparación
  useEffect(() => {
    const actualizarPrecio = async () => {
      const precio = await getPrecioPorTipo(tipoPreparacion, false)
      setPrecioPorLibra(precio)
    }
    actualizarPrecio()
  }, [tipoPreparacion])

  const handleSubmit = async () => {
    if (cantidadPescados <= 0 || pesoTotalLibras <= 0) {
      alert("Debes ingresar una cantidad y peso válidos")
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmarVenta = async () => {
    setIsLoading(true)
    try {
      const result = await createVentaDetalle({
        clienteId: clienteId || undefined,
        tipoPreparacion,
        cantidadPescados,
        pesoTotalLibras,
        precioPorLibra,
        tipoPago,
        notas: notas || undefined
      })
      
      if (result.success) {
        alert("Venta registrada exitosamente")
        router.push("/")
      } else {
        alert("Error al registrar la venta: " + result.error)
      }
    } catch (error) {
      console.error("Error al guardar la venta:", error)
      alert("Error al guardar la venta")
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Venta Detalle</h1>
        <Fish className="h-6 w-6 text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario principal */}
        <Card>
          <CardHeader>
            <CardTitle>Información de la Venta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={clienteId} onValueChange={setClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nombre}
                    </SelectItem>
                  ))}
                  <SelectItem value="nuevo">+ Agregar nuevo cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preparacion">Preparación</Label>
              <Select value={tipoPreparacion} onValueChange={(value: "VIVO" | "LIMPIO") => setTipoPreparacion(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VIVO">Vivo</SelectItem>
                  <SelectItem value="LIMPIO">Limpio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad de Pescados</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="1"
                  value={cantidadPescados}
                  onChange={(e) => setCantidadPescados(parseInt(e.target.value) || 0)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso Total (lbs)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={pesoTotalLibras}
                  onChange={(e) => setPesoTotalLibras(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="precio">Precio por Libra</Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                value={precioPorLibra}
                onChange={(e) => setPrecioPorLibra(parseFloat(e.target.value) || 0)}
                className="text-right"
                disabled
              />
              <p className="text-xs text-muted-foreground">
                Precio automático según configuración
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="pago">Tipo de Pago</Label>
              <Select value={tipoPago} onValueChange={(value: "EFECTIVO" | "CREDITO") => setTipoPago(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EFECTIVO">Efectivo</SelectItem>
                  <SelectItem value="CREDITO">Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas</Label>
              <Textarea
                id="notas"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Notas adicionales..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Resumen y totales */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Cantidad:</span>
                <span className="font-medium">{cantidadPescados} pescados</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Peso Total:</span>
                <span className="font-medium">{pesoTotalLibras.toFixed(1)} lbs</span>
              </div>
              {cantidadPescados > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Promedio por Pescado:</span>
                  <span className="font-medium">{promedioPorPescado.toFixed(2)} lbs</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Precio por Libra:</span>
                <span className="font-medium">{formatCurrency(precioPorLibra)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-primary">{formatCurrency(totalPrecio)}</span>
              </div>
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSubmit} 
                className="w-full" 
                disabled={cantidadPescados <= 0 || pesoTotalLibras <= 0 || isLoading}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {isLoading ? "Guardando..." : "Registrar Venta"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• La venta al detalle se registra por cantidad de pescados y peso total</p>
          <p>• El promedio por pescado se calcula automáticamente</p>
          <p>• El stock se actualiza automáticamente al registrar la venta</p>
          <p>• Los precios se pueden ajustar según la configuración</p>
        </CardContent>
      </Card>

      {/* Dialog de confirmación */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Venta</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres registrar esta venta?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Cantidad:</span>
              <span className="font-medium">{cantidadPescados} pescados</span>
            </div>
            <div className="flex justify-between">
              <span>Peso Total:</span>
              <span className="font-medium">{pesoTotalLibras.toFixed(1)} lbs</span>
            </div>
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold text-primary">{formatCurrency(totalPrecio)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmarVenta} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Confirmar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 