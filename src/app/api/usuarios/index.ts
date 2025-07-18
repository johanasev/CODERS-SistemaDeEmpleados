import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const usuarios = await prisma.usuario.findMany()
      return res.status(200).json(usuarios)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al obtener usuarios' })
    }
  }

  if (req.method === 'POST') {
    const { nombre, correo, rol } = req.body

    if (!rol) return res.status(400).json({ error: 'El rol es obligatorio' })

    try {
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          nombre,
          correo,
          rol,
        },
      })

      return res.status(201).json(nuevoUsuario)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Error al crear usuario' })
    }
  }

  res.setHeader('Allow', ['GET', 'POST'])
  res.status(405).end(`Método ${req.method} no permitido`)
}
