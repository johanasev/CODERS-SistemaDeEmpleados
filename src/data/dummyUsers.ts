// src/data/dummyUsers.ts

import { User } from '../context/AuthContext'; // Importa la interfaz User

export const dummySystemUsers: User[] = [
  {
    id: 'user001',
    name: 'Usuario Normal',
    email: 'user@coders.com',
    role: 'USER',
    position: 'Empleado',
    profilePic: '/user-profile.jpg',
  },
  {
    id: 'admin001',
    name: 'Administrador Principal',
    email: 'admin@coders.com',
    role: 'ADMIN',
    position: 'Gerente',
    idCreationDate: '2023-01-15', // Nueva propiedad para la fecha de creación
    profilePic: '/admin-profile.jpg',
  },
  {
    id: 'user002',
    name: 'Empleado Regular',
    email: 'employee@coders.com',
    role: 'USER',
    position: 'Desarrollador',
    idCreationDate: '2023-03-20', // Nueva propiedad para la fecha de creación
    profilePic: '/user-profile.jpg',
  },
  {
    id: 'user003',
    name: 'Soporte Técnico',
    email: 'support@coders.com',
    role: 'USER',
    position: 'Soporte',
    idCreationDate: '2024-06-01', // Nueva propiedad para la fecha de creación
    profilePic: '/user-profile.jpg',
  },
];

// Opcional: Extender la interfaz User si aún no tiene idCreationDate
// Si la interfaz User en AuthContext.tsx ya tiene 'idCreationDate', no necesitas esto.
// Pero si no la tiene y la quieres en la tabla, aquí la añadimos.
declare module '../context/AuthContext' {
  interface User {
    idCreationDate?: string; // Fecha de creación del usuario
  }
}