import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/authMiddleware' // Ajusta si está en otro lugar

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pagos = await prisma.pago.findMany({
        include: {
          empleado: true,
          registrador: true,
        },
      })

      return res.status(200).json(pagos)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al obtener pagos' })
    }
  }

  res.setHeader('Allow', ['GET'])
  res.status(405).end(`Método ${req.method} no permitido`)
}

export default requireAuth(handler)
