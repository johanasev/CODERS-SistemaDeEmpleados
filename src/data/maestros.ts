// src/data/maestros.ts

export interface Maestro {
  id: string;
  nombre: string;
  saldo: number;
  creadoPor: string; // ID o nombre del usuario que lo creó
}

// Datos simulados iniciales de Maestros
export const dummyMaestros: Maestro[] = [
  {
    id: 'M001',
    nombre: 'Juan Pérez',
    saldo: 1500.00,
    creadoPor: 'admin', // Asumiendo que 'admin' lo creó
  },
  {
    id: 'M002',
    nombre: 'María Gómez',
    saldo: 2200.50,
    creadoPor: 'admin',
  },
  {
    id: 'M003',
    nombre: 'Pedro López',
    saldo: 800.75,
    creadoPor: 'user', // Asumiendo que 'user' lo creó
  },
];