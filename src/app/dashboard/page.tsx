// src/app/dashboard/page.tsx
'use client'; // Necesario para usar useAuth

import { useAuth } from '../../context/AuthContext'; // Importa useAuth

export default function DashboardPage() {
  const { user } = useAuth(); // Obtiene el usuario del contexto

  // Este bloque es un "fallback" si por alguna razón no hay usuario (aunque AppContent ya lo maneja)
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Cargando información del usuario o redirigiendo...
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center justify-between h-full text-center p-4">
      {/* Contenido principal del Dashboard */}
      <div className="flex flex-col items-center justify-center flex-grow"> {/* flex-grow empuja el footer hacia abajo */}
       <h1 className="text-5xl font-bold text-yellow-500 mb-4 tracking-widest">
          CODERS
        </h1>
        <p className="text-xl text-gray-800 mb-8">
          Sistema de Gestión de Empleados
        </p>
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Bienvenido {user.name}</h2>
        <p className="text-sm text-gray-600 max-auto">
          EN ESTE SISTEMA PODRÁS GESTIONAR TRANSACCIONES DE USUARIOS DEPENDIENDO DE TU PERFIL
        </p>
      </div>

      {/* Pie de página para el Dashboard */}
      <footer className="w-full text-center text-gray-800 text-sm mt-8"> {/* mt-8 para separar del contenido */}
        © Created By.CODERS - 2025
      </footer>
    </div>
  );
}