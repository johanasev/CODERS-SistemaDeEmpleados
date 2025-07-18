import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' })
  }

  const { correo } = req.body

  if (!correo) return res.status(400).json({ error: 'Correo es obligatorio' })

  const usuario = await prisma.usuario.findFirst({ where: { correo } });

  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' })

  const token = jwt.sign(
    { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
    process.env.JWT_SECRET!,
    { expiresIn: '2h' }
  )

  return res.status(200).json({ token })
}
