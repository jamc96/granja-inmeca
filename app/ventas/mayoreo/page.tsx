'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Minus, Info, Trash2 } from "lucide-react"
import { getClientes, getPrecioPorTipo } from "@/lib/actions"
import { formatCurrency } from "@/lib/utils"

export default function VentaMayoreoPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Array<{id: number, nombre: string}>>([])
  const [precioPorLibra, setPrecioPorLibra] = useState(0)
  const [clienteId, setClienteId] = useState('sin-cliente')
  const [tipoPreparacion, setTipoPreparacion] = useState<'VIVO' | 'LIMPIO'>('VIVO')
  const [tipoPago, setTipoPago] = useState<'EFECTIVO' | 'CREDITO'>('EFECTIVO')
  const [notas, setNotas] = useState('')
  const [pesajes, setPesajes] = useState<Array<{pesoLibras: string, notas: string}>>([])

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
      const precio = await getPrecioPorTipo(tipoPreparacion, true)
      setPrecioPorLibra(precio)
    }
    actualizarPrecio()
  }, [tipoPreparacion])

  // Calcular precio total
  const totalLibras = pesajes.reduce((sum, pesaje) => sum + parseFloat(pesaje.pesoLibras || '0'), 0)
  const precioTotal = totalLibras * precioPorLibra

  const agregarPesaje = () => {
    setPesajes([...pesajes, { pesoLibras: '', notas: '' }])
  }

  const eliminarPesaje = (index: number) => {
    setPesajes(pesajes.filter((_, i) => i !== index))
  }

  const actualizarPesaje = (index: number, campo: 'pesoLibras' | 'notas', valor: string) => {
    const nuevosPesajes = [...pesajes]
    nuevosPesajes[index] = { ...nuevosPesajes[index], [campo]: valor }
    setPesajes(nuevosPesajes)
  }

  const incrementarPeso = (index: number) => {
    const actual = parseFloat(pesajes[index]?.pesoLibras || '0')
    actualizarPesaje(index, 'pesoLibras', (actual + 0.5).toFixed(1))
  }

  const decrementarPeso = (index: number) => {
    const actual = parseFloat(pesajes[index]?.pesoLibras || '0')
    if (actual > 0) {
      actualizarPesaje(index, 'pesoLibras', (actual - 0.5).toFixed(1))
    }
  }

  const handleRegistrarVenta = () => {
    if (pesajes.length === 0) {
      alert('Debes agregar al menos un pesaje')
      return
    }

    const pesajesValidos = pesajes.filter(p => p.pesoLibras && parseFloat(p.pesoLibras) > 0)
    if (pesajesValidos.length === 0) {
      alert('Debes completar al menos un pesaje válido')
      return
    }

    // Construir URL con parámetros
    const params = new URLSearchParams({
      pesajes: encodeURIComponent(JSON.stringify(pesajesValidos)),
      precioPorLibra: precioPorLibra.toString(),
      cliente: clienteId === 'sin-cliente' ? '' : clientes.find(c => c.id.toString() === clienteId)?.nombre || '',
      notas,
      tipoPreparacion,
      tipoPago
    })

    router.push(`/ventas/mayoreo/confirmar?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-primary-foreground p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-primary-foreground hover:bg-primary/80"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Atrás
          </Button>
          <h1 className="text-lg font-semibold">Venta Mayoreo</h1>
          <div className="w-10" /> {/* Espaciador */}
        </div>
      </div>

      {/* Calculadora de precio */}
      <div className="bg-green-100 p-4 mx-4 mt-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-green-800">
            Precio Total: {formatCurrency(precioTotal)}
          </span>
          <Button variant="ghost" size="sm" className="text-green-800">
            <Info className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Formulario */}
      <div className="p-4 space-y-6">
        {/* Cliente */}
        <div className="space-y-2">
          <Label htmlFor="cliente" className="text-base font-medium">
            Cliente
          </Label>
          <Select value={clienteId} onValueChange={setClienteId}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue placeholder="Seleccionar cliente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sin-cliente">Sin cliente</SelectItem>
              {clientes.map((cliente) => (
                <SelectItem key={cliente.id} value={cliente.id.toString()}>
                  {cliente.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de preparación */}
        <div className="space-y-2">
          <Label htmlFor="tipoPreparacion" className="text-base font-medium">
            Preparación
          </Label>
          <Select value={tipoPreparacion} onValueChange={(value: 'VIVO' | 'LIMPIO') => setTipoPreparacion(value)}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VIVO">Vivo</SelectItem>
              <SelectItem value="LIMPIO">Limpio</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tipo de pago */}
        <div className="space-y-2">
          <Label htmlFor="tipoPago" className="text-base font-medium">
            Tipo de Pago
          </Label>
          <Select value={tipoPago} onValueChange={(value: 'EFECTIVO' | 'CREDITO') => setTipoPago(value)}>
            <SelectTrigger className="h-12 text-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EFECTIVO">Efectivo</SelectItem>
              <SelectItem value="CREDITO">Crédito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Pesajes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-medium">Pesajes (Canastas)</Label>
            <Button
              onClick={agregarPesaje}
              variant="outline"
              size="sm"
              className="h-10"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Canasta
            </Button>
          </div>

          {pesajes.map((pesaje, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">Canasta {index + 1}</span>
                <Button
                  onClick={() => eliminarPesaje(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Peso (lbs)</Label>
                <div className="flex items-center space-x-3">
                  <Input
                    type="number"
                    step="0.1"
                    value={pesaje.pesoLibras}
                    onChange={(e) => actualizarPesaje(index, 'pesoLibras', e.target.value)}
                    placeholder="0.0"
                    className="flex-1 h-12 text-lg"
                    inputMode="decimal"
                  />
                  <Button
                    onClick={() => decrementarPeso(index)}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                  >
                    <Minus className="h-6 w-6" />
                  </Button>
                  <Button
                    onClick={() => incrementarPeso(index)}
                    variant="outline"
                    size="icon"
                    className="h-12 w-12"
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Notas (opcional)</Label>
                <Input
                  value={pesaje.notas}
                  onChange={(e) => actualizarPesaje(index, 'notas', e.target.value)}
                  placeholder="Notas de esta canasta..."
                  className="h-10"
                />
              </div>
            </div>
          ))}

          {pesajes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No hay pesajes agregados</p>
              <p className="text-sm">Agrega al menos una canasta para continuar</p>
            </div>
          )}
        </div>

        {/* Notas generales */}
        <div className="space-y-2">
          <Label htmlFor="notas" className="text-base font-medium">
            Nota General
          </Label>
          <Textarea
            id="notas"
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            placeholder="Notas adicionales..."
            className="min-h-24 text-base"
          />
        </div>

        {/* Botón registrar */}
        <Button
          onClick={handleRegistrarVenta}
          disabled={pesajes.length === 0}
          className="w-full h-14 text-lg font-semibold bg-green-600 hover:bg-green-700"
        >
          Registrar Venta
        </Button>
      </div>
    </div>
  )
} 