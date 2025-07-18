import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/authMiddleware' // Ajusta la ruta si es necesario

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const {
      empleado_id,
      tipo,
      fecha_inicio,
      fecha_fin,
      salario,
      estado,
      observaciones,
      registrado_por,
    } = req.body

    try {
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
      })

      return res.status(201).json(contrato)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al crear contrato' })
    }
  }

  res.setHeader('Allow', ['POST'])
  res.status(405).end(`Método ${req.method} no permitido`)
}

export default requireAuth(handler)
