import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/verifyToken'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const empleados = await prisma.empleado.findMany({
      include: {
        creador: true,
      },
    })

    // Convertimos los campos BigInt
    const empleadosSerializados = empleados.map((empleado) => ({
      ...empleado,
      salario: empleado.salario?.toString() ?? null,
      horas_trabajadas: empleado.horas_trabajadas?.toString() ?? null,
    }))

    return NextResponse.json(empleadosSerializados)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al obtener empleados' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const {
    nombre,
    correo,
    cargo,
    salario,
    fecha_ingreso,
    horas_trabajadas,
    evaluacion_desempeno,
    creado_por,
  } = body

  try {
    const empleado = await prisma.empleado.create({
      data: {
        nombre,
        correo,
        cargo,
        salario,
        fecha_ingreso: fecha_ingreso ? new Date(fecha_ingreso) : undefined,
        horas_trabajadas,
        evaluacion_desempeno,
        creado_por,
      },
    })

    return NextResponse.json({
  ...empleado,
  salario: empleado.salario?.toString(),
  horas_trabajadas: empleado.horas_trabajadas?.toString()
}, { status: 201 });
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al crear empleado' }, { status: 500 })
  }
}
