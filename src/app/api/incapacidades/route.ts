import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/verifyToken'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const incapacidades = await prisma.incapacidad.findMany({
      include: {
        empleado: true,
        registrador: true,
      },
    })
    return NextResponse.json(incapacidades)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al obtener incapacidades' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const {
    empleado_id,
    tipo,
    motivo,
    fecha_inicio,
    fecha_fin,
    dias_incapacidad,
    registrado_por,
  } = body

  if (!empleado_id || !tipo || !motivo || !fecha_inicio || !fecha_fin || !dias_incapacidad || !registrado_por) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  try {
    const incapacidad = await prisma.incapacidad.create({
      data: {
        empleado_id,
        tipo,
        motivo,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: new Date(fecha_fin),
        dias_incapacidad,
        registrado_por,
      },
    })

    return NextResponse.json(incapacidad, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear incapacidad' }, { status: 500 })
  }
}
