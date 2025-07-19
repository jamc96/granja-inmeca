'use server'

import { prisma } from './prisma'
import { revalidatePath } from 'next/cache'
import type { Cliente, Configuracion } from '@prisma/client'

export async function createVentaMayoreo(data: {
  clienteId?: string
  tipoPreparacion: 'VIVO' | 'LIMPIO'
  precioPorLibra: number
  tipoPago: 'EFECTIVO' | 'CREDITO'
  notas?: string
  pesajes: Array<{ pesoLibras: number; notas?: string }>
}): Promise<{ success: boolean; ventaId?: number; error?: string }> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Obtener o crear registro diario
    let registroDiario = await prisma.registroDiario.findUnique({
      where: { fecha: today }
    })

    if (!registroDiario) {
      registroDiario = await prisma.registroDiario.create({
        data: {
          fecha: today,
          totalMayoreoLibras: 0,
          totalMayoreoPrecio: 0,
          totalDetalleLibras: 0,
          totalDetallePrecio: 0,
          totalPagosPendientes: 0,
        }
      })
    }

    // Calcular totales
    const totalLibras = data.pesajes.reduce((sum, pesaje) => sum + pesaje.pesoLibras, 0)
    const totalPrecio = totalLibras * data.precioPorLibra

    // Crear la venta
    const venta = await prisma.venta.create({
      data: {
        tipoVenta: 'MAYOREO',
        clienteId: data.clienteId ? parseInt(data.clienteId) : null,
        usuarioId: 1, // Usuario por defecto
        puntoVenta: 'GRANJA',
        tipoPreparacion: data.tipoPreparacion,
        precioPorLibra: data.precioPorLibra,
        totalLibras,
        totalPrecio,
        tipoPago: data.tipoPago,
        pagoPendiente: data.tipoPago === 'CREDITO',
        notas: data.notas,
        registroDiarioId: registroDiario.id,
      }
    })

    // Crear detalle mayoreo con pesajes
    await prisma.detalleMayoreo.create({
      data: {
        ventaId: venta.id,
        pesajes: {
          create: data.pesajes.map(pesaje => ({
            pesoLibras: pesaje.pesoLibras,
            notas: pesaje.notas,
          }))
        }
      }
    })

    // Actualizar registro diario
    await prisma.registroDiario.update({
      where: { id: registroDiario.id },
      data: {
        totalMayoreoLibras: registroDiario.totalMayoreoLibras + totalLibras,
        totalMayoreoPrecio: registroDiario.totalMayoreoPrecio + totalPrecio,
        totalPagosPendientes: data.tipoPago === 'CREDITO' 
          ? registroDiario.totalPagosPendientes + totalPrecio
          : registroDiario.totalPagosPendientes,
      }
    })

    revalidatePath('/')
    revalidatePath('/reportes')
    
    return { success: true, ventaId: venta.id }
  } catch (error) {
    console.error('Error al crear venta mayoreo:', error)
    return { success: false, error: 'Error al registrar la venta' }
  }
}

export async function createVentaDetalle(data: {
  clienteId?: string
  tipoPreparacion: 'VIVO' | 'LIMPIO'
  cantidadPescados: number
  pesoTotalLibras: number
  precioPorLibra: number
  tipoPago: 'EFECTIVO' | 'CREDITO'
  notas?: string
}): Promise<{ success: boolean; ventaId?: number; error?: string }> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Obtener o crear registro diario
    let registroDiario = await prisma.registroDiario.findUnique({
      where: { fecha: today }
    })

    if (!registroDiario) {
      registroDiario = await prisma.registroDiario.create({
        data: {
          fecha: today,
          totalMayoreoLibras: 0,
          totalMayoreoPrecio: 0,
          totalDetalleLibras: 0,
          totalDetallePrecio: 0,
          totalPagosPendientes: 0,
        }
      })
    }

    // Calcular total
    const totalPrecio = data.pesoTotalLibras * data.precioPorLibra

    // Crear la venta
    const venta = await prisma.venta.create({
      data: {
        tipoVenta: 'DETALLE',
        clienteId: data.clienteId ? parseInt(data.clienteId) : null,
        usuarioId: 1, // Usuario por defecto
        puntoVenta: 'CIUDAD',
        tipoPreparacion: data.tipoPreparacion,
        precioPorLibra: data.precioPorLibra,
        totalLibras: data.pesoTotalLibras,
        totalPrecio,
        tipoPago: data.tipoPago,
        pagoPendiente: data.tipoPago === 'CREDITO',
        notas: data.notas,
        registroDiarioId: registroDiario.id,
      }
    })

    // Crear detalle venta
    await prisma.detalleVenta.create({
      data: {
        ventaId: venta.id,
        cantidadPescados: data.cantidadPescados,
        pesoTotalLibras: data.pesoTotalLibras,
      }
    })

    // Actualizar stock
    const stockActual = await prisma.stockDetalle.findFirst({
      where: {
        fecha: today,
        puntoVenta: 'CIUDAD'
      }
    })

    if (stockActual) {
      await prisma.stockDetalle.update({
        where: { id: stockActual.id },
        data: {
          cantidadPescados: stockActual.cantidadPescados - data.cantidadPescados,
          pesoTotalLibras: stockActual.pesoTotalLibras ? stockActual.pesoTotalLibras - data.pesoTotalLibras : 0,
        }
      })
    }

    // Actualizar registro diario
    await prisma.registroDiario.update({
      where: { id: registroDiario.id },
      data: {
        totalDetalleLibras: registroDiario.totalDetalleLibras + data.pesoTotalLibras,
        totalDetallePrecio: registroDiario.totalDetallePrecio + totalPrecio,
        totalPagosPendientes: data.tipoPago === 'CREDITO' 
          ? registroDiario.totalPagosPendientes + totalPrecio
          : registroDiario.totalPagosPendientes,
      }
    })

    revalidatePath('/')
    revalidatePath('/reportes')
    revalidatePath('/stock')
    
    return { success: true, ventaId: venta.id }
  } catch (error) {
    console.error('Error al crear venta detalle:', error)
    return { success: false, error: 'Error al registrar la venta' }
  }
}

export async function getClientes(): Promise<Cliente[]> {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: { nombre: 'asc' }
    })
    return clientes
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    return []
  }
}

export async function getConfiguraciones(): Promise<Configuracion[]> {
  try {
    const configs = await prisma.configuracion.findMany({
      orderBy: { clave: 'asc' }
    })
    return configs
  } catch (error) {
    console.error('Error al obtener configuraciones:', error)
    return []
  }
}

export async function getPrecioPorTipo(tipo: 'VIVO' | 'LIMPIO', esMayoreo: boolean): Promise<number> {
  try {
    const clave = esMayoreo 
      ? (tipo === 'VIVO' ? 'precioVivoDefault' : 'precioLimpioDefault')
      : (tipo === 'VIVO' ? 'precioVivoDetalle' : 'precioLimpioDetalle')
    
    const config = await prisma.configuracion.findUnique({
      where: { clave }
    })
    
    return config ? parseFloat(config.valor) : 0
  } catch (error) {
    console.error('Error al obtener precio:', error)
    return 0
  }
} 