"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Settings, Edit, Fish, Package, Save } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

interface Configuracion {
  id: number
  clave: string
  valor: string
  descripcion?: string
  actualizadoEn: Date
}

// Datos de ejemplo - en una app real vendrían de la base de datos
const configuraciones: Configuracion[] = [
  {
    id: 1,
    clave: "precioVivoDefault",
    valor: "38",
    descripcion: "Precio por libra para pescado vivo (mayoreo) - Lps",
    actualizadoEn: new Date()
  },
  {
    id: 2,
    clave: "precioLimpioDefault",
    valor: "38",
    descripcion: "Precio por libra para pescado limpio (mayoreo) - Lps",
    actualizadoEn: new Date()
  },
  {
    id: 3,
    clave: "precioVivoDetalle",
    valor: "45",
    descripcion: "Precio por libra para pescado vivo (detalle) - Lps",
    actualizadoEn: new Date()
  },
  {
    id: 4,
    clave: "precioLimpioDetalle",
    valor: "50",
    descripcion: "Precio por libra para pescado limpio (detalle) - Lps",
    actualizadoEn: new Date()
  },
  {
    id: 5,
    clave: "multiplicadorLimpio",
    valor: "1.2",
    descripcion: "Multiplicador para pescado limpio (20% más caro)",
    actualizadoEn: new Date()
  }
]

export default function ConfigPage() {
  const [configs, setConfigs] = useState<Configuracion[]>(configuraciones)
  const [editingConfig, setEditingConfig] = useState<Configuracion | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleEditConfig = (config: Configuracion) => {
    setEditingConfig(config)
    setEditValue(config.valor)
  }

  const handleSaveConfig = () => {
    if (editingConfig && editValue.trim()) {
      setConfigs(configs.map(c => 
        c.id === editingConfig.id 
          ? { ...c, valor: editValue.trim(), actualizadoEn: new Date() }
          : c
      ))
      setEditingConfig(null)
      setEditValue("")
    }
  }

  const getConfigValue = (clave: string) => {
    const config = configs.find(c => c.clave === clave)
    return config ? parseFloat(config.valor) : 0
  }

  const precioVivoMayoreo = getConfigValue("precioVivoDefault")
  const precioLimpioMayoreo = getConfigValue("precioLimpioDefault")
  const precioVivoDetalle = getConfigValue("precioVivoDetalle")
  const precioLimpioDetalle = getConfigValue("precioLimpioDetalle")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <Settings className="h-6 w-6 text-primary" />
      </div>

      {/* Resumen de precios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Precios Mayoreo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pescado Vivo:</span>
              <span className="font-medium">{formatCurrency(precioVivoMayoreo)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pescado Limpio:</span>
              <span className="font-medium">{formatCurrency(precioLimpioMayoreo)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fish className="h-5 w-5" />
              Precios Detalle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pescado Vivo:</span>
              <span className="font-medium">{formatCurrency(precioVivoDetalle)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Pescado Limpio:</span>
              <span className="font-medium">{formatCurrency(precioLimpioDetalle)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de configuraciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuraciones del Sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Configuración</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Última Actualización</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map((config) => (
                  <TableRow key={config.id}>
                    <TableCell className="font-medium">
                      {config.clave}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {config.clave.includes('precio') ? formatCurrency(parseFloat(config.valor)) : config.valor}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <span className="text-sm text-muted-foreground">
                        {config.descripcion || "Sin descripción"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {config.actualizadoEn.toLocaleDateString('es-ES')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditConfig(config)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Información adicional */}
      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Los precios se aplican automáticamente al registrar ventas</p>
          <p>• Los cambios se guardan inmediatamente</p>
          <p>• Los precios de detalle suelen ser más altos que los de mayoreo</p>
          <p>• El multiplicador para pescado limpio se aplica sobre el precio base</p>
        </CardContent>
      </Card>

      {/* Dialog de edición */}
      <Dialog open={!!editingConfig} onOpenChange={() => setEditingConfig(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Configuración</DialogTitle>
            <DialogDescription>
              Modifica el valor de la configuración seleccionada.
            </DialogDescription>
          </DialogHeader>
          {editingConfig && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Configuración</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="font-medium">{editingConfig.clave}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <div className="p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      {editingConfig.descripcion || "Sin descripción"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-valor">Nuevo Valor</Label>
                  <Input
                    id="edit-valor"
                    type={editingConfig.clave.includes('precio') ? "number" : "text"}
                    step={editingConfig.clave.includes('precio') ? "0.01" : undefined}
                    min={editingConfig.clave.includes('precio') ? "0" : undefined}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    placeholder="Ingresa el nuevo valor"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingConfig(null)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveConfig}>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 