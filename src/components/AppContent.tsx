// src/components/AppContent.tsx
'use client'; // <-- MUY IMPORTANTE: Marca este componente como Cliente

import React from 'react';
import Sidebar from './Sidebar'; // Asegúrate que esta ruta sea correcta
import { useAuth } from '../context/AuthContext'; // Asegúrate que esta ruta sea correcta

export default function AppContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // Ahora useAuth se llama desde un componente cliente

  return (
    <>
      {user ? ( // Si hay usuario logueado, muestra el layout con Sidebar
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      ) : (
        // Si no hay usuario logueado, renderizar solo el contenido de la página (ej. Landing, Login)
        <main>{children}</main>
      )}
    </>
  );
}