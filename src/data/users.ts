// src/data/users.ts
import { User } from '../context/AuthContext'; // <-- Importa User desde AuthContext

export const dummyUsers: User[] = [
  {
    id: 'user001', // Asegúrate de que los dummy users también tengan un ID
    name: 'Usuario Prueba',
    email: 'user@example.com',
    role: 'USER',
    position: 'Estudiante',
    profilePic: '/profile-placeholder.jpg',
  },
  {
    id: 'admin001', // Y el admin
    name: 'Admin Maestro',
    email: 'admin@example.com',
    role: 'ADMIN',
    position: 'Gerente',
    profilePic: '/profile-placeholder.jpg',
  },
];