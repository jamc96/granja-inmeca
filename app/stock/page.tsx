"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Package, Edit, Fish, TrendingUp, TrendingDown } from "lucide-react"
import { TopNav } from "@/components/top-nav"


interface StockInfo {
  cantidadPescados: number
  pesoTotalLibras: number
  fecha: Date
  puntoVenta: "CIUDAD" | "GRANJA"
}

// Datos de ejemplo
const stockActual: StockInfo = {
  cantidadPescados: 100,
  pesoTotalLibras: 250.5,
  fecha: new Date(),
  puntoVenta: "CIUDAD"
}

const historialStock: StockInfo[] = [
  { cantidadPescados: 120, pesoTotalLibras: 300.0, fecha: new Date(Date.now() - 24 * 60 * 60 * 1000), puntoVenta: "CIUDAD" },
  { cantidadPescados: 150, pesoTotalLibras: 375.0, fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), puntoVenta: "CIUDAD" },
  { cantidadPescados: 80, pesoTotalLibras: 200.0, fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), puntoVenta: "CIUDAD" },
]

export default function StockPage() {
  const [stock, setStock] = useState<StockInfo>(stockActual)
  const [showUpdateDialog, setShowUpdateDialog] = useState(false)
  const [newStock, setNewStock] = useState({
    cantidadPescados: stock.cantidadPescados.toString(),
    pesoTotalLibras: stock.pesoTotalLibras.toString()
  })

  const promedioPorPescado = stock.cantidadPescados > 0 ? stock.pesoTotalLibras / stock.cantidadPescados : 0
  const diferenciaCantidad = stock.cantidadPescados - historialStock[0]?.cantidadPescados || 0
  const diferenciaPeso = stock.pesoTotalLibras - historialStock[0]?.pesoTotalLibras || 0

  const handleUpdateStock = () => {
    const cantidad = parseInt(newStock.cantidadPescados) || 0
    const peso = parseFloat(newStock.pesoTotalLibras) || 0

    if (cantidad >= 0 && peso >= 0) {
      setStock({
        ...stock,
        cantidadPescados: cantidad,
        pesoTotalLibras: peso,
        fecha: new Date()
      })
      setShowUpdateDialog(false)
      setNewStock({
        cantidadPescados: cantidad.toString(),
        pesoTotalLibras: peso.toString()
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <TopNav title="Gestión de Stock" />
      
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Edit className="h-4 w-4 mr-2" />
                Actualizar Stock
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Actualizar Stock</DialogTitle>
              <DialogDescription>
                Actualiza la cantidad y peso del stock disponible.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad de Pescados</Label>
                <Input
                  id="cantidad"
                  type="number"
                  min="0"
                  value={newStock.cantidadPescados}
                  onChange={(e) => setNewStock({...newStock, cantidadPescados: e.target.value})}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="peso">Peso Total (lbs)</Label>
                <Input
                  id="peso"
                  type="number"
                  step="0.1"
                  min="0"
                  value={newStock.pesoTotalLibras}
                  onChange={(e) => setNewStock({...newStock, pesoTotalLibras: e.target.value})}
                  placeholder="0.0"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleUpdateStock}>
                Actualizar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stock actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pescados Disponibles</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stock.cantidadPescados}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {diferenciaCantidad !== 0 && (
                <>
                  {diferenciaCantidad > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(diferenciaCantidad)} desde ayer
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peso Total</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stock.pesoTotalLibras.toFixed(1)} lbs</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {diferenciaPeso !== 0 && (
                <>
                  {diferenciaPeso > 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                  )}
                  {Math.abs(diferenciaPeso).toFixed(1)} lbs desde ayer
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio por Pescado</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promedioPorPescado.toFixed(2)} lbs</div>
            <p className="text-xs text-muted-foreground">
              Peso promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Punto de Venta</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant="outline">
              {stock.puntoVenta}
            </Badge>
            <p className="text-xs text-muted-foreground mt-1">
              Última actualización: {stock.fecha.toLocaleDateString('es-ES')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Stock</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Estado Actual</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Pescados disponibles:</span>
                  <span className="font-medium">{stock.cantidadPescados}</span>
                </div>
                <div className="flex justify-between">
                  <span>Peso total:</span>
                  <span className="font-medium">{stock.pesoTotalLibras.toFixed(1)} lbs</span>
                </div>
                <div className="flex justify-between">
                  <span>Promedio por pescado:</span>
                  <span className="font-medium">{promedioPorPescado.toFixed(2)} lbs</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Tendencias</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Cambio cantidad:</span>
                  <span className={`font-medium ${diferenciaCantidad > 0 ? 'text-green-600' : diferenciaCantidad < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {diferenciaCantidad > 0 ? '+' : ''}{diferenciaCantidad}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cambio peso:</span>
                  <span className={`font-medium ${diferenciaPeso > 0 ? 'text-green-600' : diferenciaPeso < 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                    {diferenciaPeso > 0 ? '+' : ''}{diferenciaPeso.toFixed(1)} lbs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historial reciente */}
      <Card>
        <CardHeader>
          <CardTitle>Historial Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {historialStock.map((registro, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <div className="font-medium">
                    {registro.cantidadPescados} pescados - {registro.pesoTotalLibras.toFixed(1)} lbs
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {registro.fecha.toLocaleDateString('es-ES')}
                  </div>
                </div>
                <Badge variant="outline">
                  {registro.puntoVenta}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
} 