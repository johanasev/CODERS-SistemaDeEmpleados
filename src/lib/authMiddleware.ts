import { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'

export function requireAuth(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!)
      // Puedes adjuntar info del usuario al request si lo necesitas:
      // req.user = decoded
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ error: 'Token inválido o expirado' })
    }
  }
}
