// src/app/api/usuarios/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, correo, rol, contrasena } = await request.json();

    if (!rol) {
      return NextResponse.json({ error: 'El rol es obligatorio' }, { status: 400 });
    }
    if (!contrasena) {
      return NextResponse.json({ error: 'La contraseña es obligatoria' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        rol,
        contrasena: hashedPassword,
      },
    });

    return NextResponse.json(nuevoUsuario, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, rol } = await request.json();

    if (!id || !rol) {
      return NextResponse.json({ error: 'El id y el rol son obligatorios' }, { status: 400 });
    }

    // Verifica si el usuario existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Solo actualiza el rol
    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: { rol },
    });

    return NextResponse.json(usuarioActualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al actualizar el rol del usuario' }, { status: 500 });
  }
}
