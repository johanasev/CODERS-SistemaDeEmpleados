// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from './verifyToken'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Solo proteger rutas que comienzan con /api/
  if (pathname.startsWith('/api/pagos')) {
    const authHeader = req.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido o expirado' }, { status: 401 })
    }

    // Si quieres, puedes pasar el payload a la request
    // No se puede modificar la request directamente, pero puedes usar cookies o headers en `req.nextUrl`
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*'],
}
