import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/authMiddleware' // Ajusta esta ruta si está en otro lugar

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const incapacidades = await prisma.incapacidad.findMany({
        include: {
          empleado: true,
          registrador: true,
        },
      })
      return res.status(200).json(incapacidades)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al obtener incapacidades' })
    }
  }

  if (req.method === 'POST') {
    const {
      empleado_id,
      tipo,
      motivo,
      fecha_inicio,
      fecha_fin,
      dias_incapacidad,
      registrado_por,
    } = req.body

    if (!empleado_id || !tipo || !motivo || !fecha_inicio || !fecha_fin || !dias_incapacidad || !registrado_por) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' })
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

      return res.status(201).json(incapacidad)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al crear incapacidad' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Método ${req.method} no permitido`)
}

export default requireAuth(handler)
