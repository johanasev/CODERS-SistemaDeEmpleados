import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: NextRequest,
  context: any // ← sí, aquí usamos `any` para evitar el error de tipos conflictivos de Next.js
) {
  const { id } = context.params;

  try {
    const pagos = await prisma.pago.findMany({
      where: { empleado_id: id },
      include: {
        empleado: true,
        registrador: true,
      },
    });

    const json = JSON.stringify(pagos, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );

    return new Response(json, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Error al obtener los pagos' },
      { status: 500 }
    );
  }
}
