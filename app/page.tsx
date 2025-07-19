import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { prisma } from "@/lib/prisma"
import { formatCurrency } from "@/lib/utils"
import { Fish, Package, DollarSign, TrendingUp } from "lucide-react"

async function getDashboardData() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [registroDiario, stockActual] = await Promise.all([
    prisma.registroDiario.findUnique({
      where: { fecha: today },
    }),
    prisma.stockDetalle.findFirst({
      where: {
        fecha: today,
        puntoVenta: 'CIUDAD'
      },
      orderBy: { actualizadoEn: 'desc' }
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
    stockActual: stockActual || {
      cantidadPescados: 0,
      pesoTotalLibras: 0,
    }
  }
}

export default async function DashboardPage() {
  const { registroDiario, stockActual } = await getDashboardData()

  const totalVentas = registroDiario.totalMayoreoPrecio + registroDiario.totalDetallePrecio
  const totalLibras = registroDiario.totalMayoreoLibras + registroDiario.totalDetalleLibras

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <Badge variant="secondary" className="text-sm">
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Badge>
      </div>

      {/* Resumen de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalVentas)}</div>
            <p className="text-xs text-muted-foreground">
              {registroDiario.totalMayoreoPrecio > 0 || registroDiario.totalDetallePrecio > 0 
                ? "Hoy" 
                : "Sin ventas hoy"}
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
              {registroDiario.totalMayoreoLibras > 0 || registroDiario.totalDetalleLibras > 0 
                ? "Vendidas hoy" 
                : "Sin ventas hoy"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pagos Pendientes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(registroDiario.totalPagosPendientes)}</div>
            <p className="text-xs text-muted-foreground">
              {registroDiario.totalPagosPendientes > 0 ? "En crédito" : "Sin pendientes"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Disponible</CardTitle>
            <Fish className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stockActual.cantidadPescados}</div>
            <p className="text-xs text-muted-foreground">
              {stockActual.pesoTotalLibras && stockActual.pesoTotalLibras > 0 
                ? `${stockActual.pesoTotalLibras.toFixed(1)} lbs` 
                : "Sin stock"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Desglose de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ventas Mayoreo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Libras:</span>
              <span className="font-medium">{registroDiario.totalMayoreoLibras.toFixed(1)} lbs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-medium">{formatCurrency(registroDiario.totalMayoreoPrecio)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ventas Detalle</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Libras:</span>
              <span className="font-medium">{registroDiario.totalDetalleLibras.toFixed(1)} lbs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total:</span>
              <span className="font-medium">{formatCurrency(registroDiario.totalDetallePrecio)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <a 
              href="/ventas/mayoreo" 
              className="flex items-center justify-center p-6 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-lg font-medium"
            >
              <Package className="h-6 w-6 mr-3" />
              <span>Venta Mayoreo</span>
            </a>
            <a 
              href="/ventas/detalle" 
              className="flex items-center justify-center p-6 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors text-lg font-medium"
            >
              <Fish className="h-6 w-6 mr-3" />
              <span>Venta Detalle</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
