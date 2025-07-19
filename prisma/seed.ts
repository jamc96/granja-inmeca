import { PrismaClient, TipoPreparacion, RolUsuario } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear preparaciones
  console.log('📦 Creando preparaciones...')
  await prisma.preparacion.upsert({
    where: { tipo: TipoPreparacion.VIVO },
    update: {},
    create: {
      tipo: TipoPreparacion.VIVO,
      multiplicador: 1.0,
    },
  })

  await prisma.preparacion.upsert({
    where: { tipo: TipoPreparacion.LIMPIO },
    update: {},
    create: {
      tipo: TipoPreparacion.LIMPIO,
      multiplicador: 1.2, // 20% más caro
    },
  })

  // Crear usuarios
  console.log('👥 Creando usuarios...')
  await prisma.usuario.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      nombre: 'Administrador',
      rol: RolUsuario.ADMIN,
    },
  })

  await prisma.usuario.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      nombre: 'Vendedor',
      rol: RolUsuario.VENDEDOR,
    },
  })

  // Crear configuraciones por defecto
  console.log('⚙️ Creando configuraciones...')
  const configs = [
    {
      clave: 'precioVivoDefault',
      valor: '38',
      descripcion: 'Precio por libra para pescado vivo (mayoreo) - Lps',
    },
    {
      clave: 'precioLimpioDefault',
      valor: '38',
      descripcion: 'Precio por libra para pescado limpio (mayoreo) - Lps',
    },
    {
      clave: 'precioVivoDetalle',
      valor: '45',
      descripcion: 'Precio por libra para pescado vivo (detalle) - Lps',
    },
    {
      clave: 'precioLimpioDetalle',
      valor: '50',
      descripcion: 'Precio por libra para pescado limpio (detalle) - Lps',
    },
  ]

  for (const config of configs) {
    await prisma.configuracion.upsert({
      where: { clave: config.clave },
      update: { valor: config.valor },
      create: config,
    })
  }

  // Crear clientes de ejemplo
  console.log('👥 Creando clientes...')
  const clientes = [
    { nombre: 'Nolvin', contacto: 'Cliente frecuente' },
    { nombre: 'Roberto', contacto: 'Cliente frecuente' },
    { nombre: 'Parya de Cinuano', contacto: 'Cliente frecuente' },
    { nombre: 'Lumala Dinora', contacto: 'Cliente frecuente' },
    { nombre: 'Hijo Salvita', contacto: 'Cliente ocasional' },
    { nombre: 'Hijo de Daysi Romero', contacto: 'Cliente ocasional' },
    { nombre: 'Norma Cardena', contacto: 'Cliente frecuente' },
  ]

  for (const cliente of clientes) {
    const existingCliente = await prisma.cliente.findFirst({
      where: { nombre: cliente.nombre }
    })

    if (!existingCliente) {
      await prisma.cliente.create({
        data: {
          nombre: cliente.nombre,
          contacto: cliente.contacto,
          esFrecuente: cliente.contacto.includes('frecuente'),
        },
      })
    }
  }

  // Crear registro diario para hoy
  console.log('📅 Creando registro diario...')
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.registroDiario.upsert({
    where: { fecha: today },
    update: {},
    create: {
      fecha: today,
      totalMayoreoLibras: 0,
      totalMayoreoPrecio: 0,
      totalDetalleLibras: 37.47, // Basado en la tabla proporcionada
      totalDetallePrecio: 1800, // Aproximado basado en los valores de la tabla
      totalPagosPendientes: 0,
    },
  })

  // Crear stock inicial
  console.log('🐟 Creando stock inicial...')
  const existingStock = await prisma.stockDetalle.findFirst({
    where: {
      fecha: today,
      puntoVenta: 'CIUDAD'
    }
  })

  if (!existingStock) {
    await prisma.stockDetalle.create({
      data: {
        fecha: today,
        cantidadPescados: 100,
        pesoTotalLibras: 250.0,
        puntoVenta: 'CIUDAD',
      },
    })
  }

  console.log('✅ Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 