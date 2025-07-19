// src/app/api/pagos/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/verifyToken'
import { JwtPayload } from 'jsonwebtoken'

interface MyTokenPayload extends JwtPayload {
  id: string;
  rol: string;
}
function serializeBigInt<T>(obj: T): T {
  return JSON.parse(
    JSON.stringify(obj, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    )
  );
}
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token) as MyTokenPayload

    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }

    const pagos = await prisma.pago.findMany({
      include: {
        empleado: true,
        registrador: true,
      },
    })

    return NextResponse.json(serializeBigInt(pagos))
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token) as MyTokenPayload;

    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 });
    }

    const body = await req.json();
    const {
      empleado_id,
      mes,
      anio,
      fecha_pago,
      monto_pagado,
      metodo_pago,
      horas_pagadas,
      observaciones,
    } = body;

    if (!empleado_id || !horas_pagadas) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const empleado = await prisma.empleado.findUnique({
      where: { id: empleado_id },
    });

    if (!empleado) {
      return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 });
    }

    if (empleado.horas_trabajadas === null || empleado.horas_trabajadas < horas_pagadas) {
      return NextResponse.json({ error: 'Horas a pagar exceden las horas trabajadas' }, { status: 400 });
    }

    const nuevasHoras = empleado.horas_trabajadas - BigInt(horas_pagadas);

const pago = await prisma.$transaction(async (tx) => {
  await tx.empleado.update({
    where: { id: empleado_id },
    data: { horas_trabajadas: nuevasHoras },
  });

  return await tx.pago.create({
    data: {
      empleado_id,
      mes,
      anio,
      fecha_pago: fecha_pago ? new Date(fecha_pago) : undefined,
      monto_pagado,
      metodo_pago,
      horas_pagadas,
      observaciones,
      registrado_por_id: decoded.id,
    },
  });
});




    return NextResponse.json(serializeBigInt(pago), { status: 201 });

  } catch (error) {
    console.error('Error al crear pago:', error);
    return NextResponse.json({ error: 'Error al crear el pago' }, { status: 500 });
  }
}
