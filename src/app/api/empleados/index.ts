import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/authMiddleware' // Ajusta esta ruta si tu archivo está en otro lugar

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const empleados = await prisma.empleado.findMany({
      include: {
        creador: true,
      },
    })
    return res.status(200).json(empleados)
  }

  if (req.method === 'POST') {
    const { nombre, correo, cargo, salario, fecha_ingreso, horas_trabajadas, evaluacion_desempeno, creado_por } = req.body

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

      return res.status(201).json(empleado)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al crear empleado' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Método ${req.method} no permitido`)
}

export default requireAuth(handler)
