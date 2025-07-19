import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, Calendar, DollarSign, Package, Fish } from "lucide-react"
import type { Venta, Cliente, Usuario, DetalleMayoreo, DetalleVenta, Pesaje } from "@prisma/client"

// Forzar renderizado dinámico para evitar errores de build
export const dynamic = 'force-dynamic'

type VentaWithRelations = Venta & {
  cliente: Cliente | null
  usuario: Usuario
  detalleMayoreo: (DetalleMayoreo & {
    pesajes: Pesaje[]
  }) | null
  detalleVenta: DetalleVenta | null
}

async function getReporteData(): Promise<{
  registroDiario: {
    totalMayoreoLibras: number
    totalMayoreoPrecio: number
    totalDetalleLibras: number
    totalDetallePrecio: number
    totalPagosPendientes: number
  }
  ventas: VentaWithRelations[]
}> {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [registroDiario, ventas] = await Promise.all([
    prisma.registroDiario.findUnique({
      where: { fecha: today },
    }),
    prisma.venta.findMany({
      where: {
        fecha: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: {
        cliente: true,
        usuario: true,
        detalleMayoreo: {
          include: {
            pesajes: true
          }
        },
        detalleVenta: true
      },
      orderBy: { fecha: 'desc' }
    })
  ])

  return {
    registroDiario: registroDiario || {
      totalMayoreoLibras: 0,
      totalMayoreoPrecio: 0,
      totalDetalleLibras: 0,
      totalDetallePrecio: 0,
      totalPagosPendientes: 0,
    },
    ventas: ventas as VentaWithRelations[]
  }
}

export default async function ReportesPage() {
  const { registroDiario, ventas } = await getReporteData()

  const totalVentas = registroDiario.totalMayoreoPrecio + registroDiario.totalDetallePrecio
  const totalLibras = registroDiario.totalMayoreoLibras + registroDiario.totalDetalleLibras

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Reportes</h1>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-muted-foreground" />
          <Badge variant="secondary">
            {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
        </div>
      </div>

      {/* Resumen del día */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVentas)}</div>
            <p className="text-xs text-muted-foreground">
              {ventas.length} transacciones hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Libras</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLibras.toFixed(1)} lbs</div>
            <p className="text-xs text-muted-foreground">
              Vendidas hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Mayoreo</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(registroDiario.totalMayoreoPrecio)}</div>
            <p className="text-xs text-muted-foreground">
              {registroDiario.totalMayoreoLibras.toFixed(1)} lbs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Detalle</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(registroDiario.totalDetallePrecio)}</div>
            <p className="text-xs text-muted-foreground">
              {registroDiario.totalDetalleLibras.toFixed(1)} lbs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de ventas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Ventas del Día
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ventas.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Preparación</TableHead>
                    <TableHead>Libras</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Pago</TableHead>
                    <TableHead>Vendedor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ventas.map((venta) => (
                    <TableRow key={venta.id}>
                      <TableCell>
                        {venta.fecha.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge variant={venta.tipoVenta === 'MAYOREO' ? 'default' : 'secondary'}>
                          {venta.tipoVenta}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {venta.cliente?.nombre || 'Sin cliente'}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {venta.tipoPreparacion}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {venta.totalLibras.toFixed(1)} lbs
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(venta.totalPrecio)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={venta.tipoPago === 'EFECTIVO' ? 'default' : 'destructive'}>
                          {venta.tipoPago}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {venta.usuario.nombre}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay ventas registradas hoy</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información adicional */}
      {registroDiario.totalPagosPendientes > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Pagos Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(registroDiario.totalPagosPendientes)}
            </div>
            <p className="text-sm text-muted-foreground">
              Total en crédito pendiente de pago
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 