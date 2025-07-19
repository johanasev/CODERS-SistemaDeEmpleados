import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _req: Request,
  context: { params: { id: string } }
) {
  // ✅ Si estás viendo el error "params.id should be awaited", usa esta línea:
  const { id } = context.params; // 👈 Esto es lo que elimina el error

  try {
    const pagos = await prisma.pago.findMany({
      where: { empleado_id: id }, // <- o `id` si es único
      include: {
        empleado: true,
        registrador: true,
      },
    });
function replacerBigInt(_key: string, value: any) {
  return typeof value === 'bigint' ? value.toString() : value;
}
   return new Response(JSON.stringify(pagos, replacerBigInt), {
  status: 200,
  headers: { 'Content-Type': 'application/json' },
});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener los pagos' }, { status: 500 });
  }
}
