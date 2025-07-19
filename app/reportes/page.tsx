import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { BarChart3, Calendar, DollarSign, Package, Fish, TrendingUp, TrendingDown } from "lucide-react"
import { TopNav } from "@/components/top-nav"
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

async function getReporteData(fecha?: Date): Promise<{
  registroDiario: {
    totalMayoreoLibras: number
    totalMayoreoPrecio: number
    totalDetalleLibras: number
    totalDetallePrecio: number
    totalPagosPendientes: number
  }
  ventas: VentaWithRelations[]
  fechaSeleccionada: Date
}> {
  const fechaConsulta = fecha || new Date()
  fechaConsulta.setHours(0, 0, 0, 0)
  const fechaFin = new Date(fechaConsulta)
  fechaFin.setHours(23, 59, 59, 999)

  const [registroDiario, ventas] = await Promise.all([
    prisma.registroDiario.findUnique({
      where: { fecha: fechaConsulta },
    }),
    prisma.venta.findMany({
      where: {
        fecha: {
          gte: fechaConsulta,
          lte: fechaFin
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
    ventas: ventas as VentaWithRelations[],
    fechaSeleccionada: fechaConsulta
  }
}

export default async function ReportesPage({
  searchParams,
}: {
  searchParams: Promise<{ fecha?: string }>
}) {
  const params = await searchParams
  const fecha = params.fecha ? new Date(params.fecha) : undefined
  const { registroDiario, ventas, fechaSeleccionada } = await getReporteData(fecha)

  const totalVentas = registroDiario.totalMayoreoPrecio + registroDiario.totalDetallePrecio
  const totalLibras = registroDiario.totalMayoreoLibras + registroDiario.totalDetalleLibras

  // Calcular estadísticas adicionales
  const ventasMayoreo = ventas.filter(v => v.tipoVenta === 'MAYOREO')
  const ventasDetalle = ventas.filter(v => v.tipoVenta === 'DETALLE')
  const ventasEfectivo = ventas.filter(v => v.tipoPago === 'EFECTIVO')
  const ventasCredito = ventas.filter(v => v.tipoPago === 'CREDITO')

  return (
    <div className="min-h-screen bg-background">
      <TopNav title="Reportes" />
      
      <div className="p-4 space-y-6">
        {/* Selector de fecha */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <Badge variant="secondary">
              {fechaSeleccionada.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Badge>
          </div>
          <div className="flex gap-2">
            <a 
              href={`/reportes?fecha=${new Date(fechaSeleccionada.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`}
              className="px-3 py-1 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              Ayer
            </a>
            <a 
              href="/reportes"
              className="px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Hoy
            </a>
            <a 
              href={`/reportes?fecha=${new Date(fechaSeleccionada.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]}`}
              className="px-3 py-1 text-sm bg-muted rounded-md hover:bg-muted/80 transition-colors"
            >
              Mañana
            </a>
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
                {ventas.length} transacciones
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
                Vendidas
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
                {registroDiario.totalMayoreoLibras.toFixed(1)} lbs • {ventasMayoreo.length} ventas
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
                {registroDiario.totalDetalleLibras.toFixed(1)} lbs • {ventasDetalle.length} ventas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Efectivo</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(ventasEfectivo.reduce((sum, v) => sum + v.totalPrecio, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                {ventasEfectivo.length} transacciones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pagos Crédito</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(ventasCredito.reduce((sum, v) => sum + v.totalPrecio, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                {ventasCredito.length} transacciones
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Promedio por Venta</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {ventas.length > 0 ? formatCurrency(totalVentas / ventas.length) : formatCurrency(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Promedio
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabla de ventas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Ventas del {fechaSeleccionada.toLocaleDateString('es-ES')}
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
                <p>No hay ventas registradas en esta fecha</p>
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
    </div>
  )
} 