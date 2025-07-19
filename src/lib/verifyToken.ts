// src/lib/verifyToken.ts
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'clave_por_defecto'

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (err) {
  console.error("Error al verificar el token:", err);
  return null;
}

}
