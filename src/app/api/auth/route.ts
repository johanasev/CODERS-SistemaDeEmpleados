// src/app/api/login/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { correo, contrasena } = body

    if (!correo || !contrasena) {
      return NextResponse.json({ error: 'Correo y contraseña son obligatorios' }, { status: 400 })
    }

    const usuario = await prisma.usuario.findFirst({ where: { correo } })

    if (!usuario) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena)

    if (!contrasenaValida) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET!,
      { expiresIn: '2h' }
    )

    return NextResponse.json({ token }, { status: 200 })
  } catch (error) {
    console.error('Error en login:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
