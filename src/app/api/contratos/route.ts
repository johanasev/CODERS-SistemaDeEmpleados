import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/verifyToken';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Token requerido' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 403 });

    const contratos = await prisma.contrato.findMany({
      include: {
        empleado: true, // Si quieres incluir datos del empleado
      },
    });

    return NextResponse.json(contratos);
  } catch (error) {
    console.error('[GET contratos]', error);
    return NextResponse.json({ error: 'Error al obtener contratos' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) return NextResponse.json({ error: 'Token requerido' }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 403 });

    const body = await req.json();
    const {
      empleado_id,
      tipo,
      fecha_inicio,
      fecha_fin,
      salario,
      estado,
      observaciones,
      registrado_por,
    } = body;

    const contrato = await prisma.contrato.create({
      data: {
        empleado_id,
        tipo,
        fecha_inicio: new Date(fecha_inicio),
        fecha_fin: fecha_fin ? new Date(fecha_fin) : undefined,
        salario,
        estado,
        observaciones,
        registrado_por,
      },
    });

    return NextResponse.json(contrato, { status: 201 });
  } catch (error) {
    console.error('[POST contratos]', error);
    return NextResponse.json({ error: 'Error al crear contrato' }, { status: 500 });
  }
}
