import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Fish, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function VentasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Registrar Venta</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/ventas/mayoreo" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Venta Mayoreo</CardTitle>
                <Package className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Registra ventas al mayoreo con múltiples pesajes de canastas.
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Por libras con pesajes individuales</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ventas/detalle" className="block">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Venta Detalle</CardTitle>
                <Fish className="h-8 w-8 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Registra ventas al detalle por cantidad de pescados.
              </p>
              <div className="flex items-center text-sm text-muted-foreground">
                <span>Por cantidad y peso total</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• <strong>Mayoreo:</strong> Ventas por libras con pesajes de canastas individuales</p>
          <p>• <strong>Detalle:</strong> Ventas por cantidad de pescados y peso total</p>
          <p>• Los precios se calculan automáticamente según la configuración</p>
          <p>• Puedes seleccionar clientes existentes o crear nuevos</p>
        </CardContent>
      </Card>
    </div>
  )
} 