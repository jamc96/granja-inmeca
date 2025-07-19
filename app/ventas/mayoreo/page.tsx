"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Package, Plus, Trash2, Calculator } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { createVentaMayoreo, getClientes, getPrecioPorTipo } from "@/lib/actions"
import { useRouter } from "next/navigation"

interface Pesaje {
  id: string
  pesoLibras: number
  notas?: string
}

export default function VentaMayoreoPage() {
  const router = useRouter()
  const [clienteId, setClienteId] = useState<string>("")
  const [tipoPreparacion, setTipoPreparacion] = useState<"VIVO" | "LIMPIO">("VIVO")
  const [precioPorLibra, setPrecioPorLibra] = useState<number>(38)
  const [tipoPago, setTipoPago] = useState<"EFECTIVO" | "CREDITO">("EFECTIVO")
  const [notas, setNotas] = useState("")
  const [pesajes, setPesajes] = useState<Pesaje[]>([])
  const [nuevoPesaje, setNuevoPesaje] = useState({ pesoLibras: "", notas: "" })
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [clientes, setClientes] = useState<Array<{id: number, nombre: string}>>([])
  const [isLoading, setIsLoading] = useState(false)

  const totalLibras = pesajes.reduce((sum, pesaje) => sum + pesaje.pesoLibras, 0)
  const totalPrecio = totalLibras * precioPorLibra

  // Cargar clientes y precios al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      const clientesData = await getClientes()
      setClientes(clientesData)
      
      // Cargar precio por defecto
      const precio = await getPrecioPorTipo(tipoPreparacion, true)
      setPrecioPorLibra(precio)
    }
    cargarDatos()
  }, [])

  // Actualizar precio cuando cambie el tipo de preparación
  useEffect(() => {
    const actualizarPrecio = async () => {
      const precio = await getPrecioPorTipo(tipoPreparacion, true)
      setPrecioPorLibra(precio)
    }
    actualizarPrecio()
  }, [tipoPreparacion])

  const agregarPesaje = () => {
    if (nuevoPesaje.pesoLibras) {
      const pesaje: Pesaje = {
        id: Date.now().toString(),
        pesoLibras: parseFloat(nuevoPesaje.pesoLibras),
        notas: nuevoPesaje.notas || undefined
      }
      setPesajes([...pesajes, pesaje])
      setNuevoPesaje({ pesoLibras: "", notas: "" })
    }
  }

  const eliminarPesaje = (id: string) => {
    setPesajes(pesajes.filter(p => p.id !== id))
  }

  const handleSubmit = async () => {
    if (pesajes.length === 0) {
      alert("Debes agregar al menos un pesaje")
      return
    }

    setShowConfirmDialog(true)
  }

  const confirmarVenta = async () => {
    setIsLoading(true)
    try {
      const result = await createVentaMayoreo({
        clienteId: clienteId || undefined,
        tipoPreparacion,
        precioPorLibra,
        tipoPago,
        notas: notas || undefined,
        pesajes: pesajes.map(p => ({ pesoLibras: p.pesoLibras, notas: p.notas }))
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
        <h1 className="text-2xl font-bold text-foreground">Venta Mayoreo</h1>
        <Package className="h-6 w-6 text-primary" />
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
                <span className="text-sm text-muted-foreground">Total Libras:</span>
                <span className="font-medium">{totalLibras.toFixed(1)} lbs</span>
              </div>
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
                disabled={pesajes.length === 0 || isLoading}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {isLoading ? "Guardando..." : "Registrar Venta"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pesajes */}
      <Card>
        <CardHeader>
          <CardTitle>Pesajes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Agregar nuevo pesaje */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (lbs)</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={nuevoPesaje.pesoLibras}
                onChange={(e) => setNuevoPesaje({...nuevoPesaje, pesoLibras: e.target.value})}
                placeholder="0.0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notas-pesaje">Notas</Label>
              <Input
                id="notas-pesaje"
                value={nuevoPesaje.notas}
                onChange={(e) => setNuevoPesaje({...nuevoPesaje, notas: e.target.value})}
                placeholder="Opcional"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={agregarPesaje} className="w-full" disabled={!nuevoPesaje.pesoLibras}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Lista de pesajes */}
          {pesajes.length > 0 && (
            <div className="space-y-2">
              <Label>Pesajes Registrados</Label>
              <div className="space-y-2">
                {pesajes.map((pesaje) => (
                  <div key={pesaje.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <span className="font-medium">{pesaje.pesoLibras.toFixed(1)} lbs</span>
                      {pesaje.notas && (
                        <span className="text-sm text-muted-foreground ml-2">- {pesaje.notas}</span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarPesaje(pesaje.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
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
              <span>Total Libras:</span>
              <span className="font-medium">{totalLibras.toFixed(1)} lbs</span>
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