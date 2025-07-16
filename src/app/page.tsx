// src/app/page.tsx
'use client'; 

import Image from 'next/image';
import backgroundImage from '../public/bg.png'; // Ajusta la ruta a tu imagen de fondo
import { useRouter } from 'next/navigation'; // Importa useRouter

export default function Home() {

  const router = useRouter(); // Inicializa el hook useRouter

  const handleLoginClick = () => {
    router.push('/login'); // Redirige a la ruta /login
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      {/* Overlay para el blur y la opacidad */}
      <div className="absolute inset-0 bg-opacity-10 backdrop-filter backdrop-blur-sm"></div>

      {/* Contenido principal (superpuesto al overlay) */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-6xl font-bold text-yellow-500 mb-4 tracking-widest">
          CODERS
        </h1>
        <p className="text-2xl text-gray-800 mb-8">
          Sistema de Gestión de Empleados
        </p>
        <button
          onClick={handleLoginClick} // Agrega el evento onClick
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
          Iniciar Sesión
        </button>
      </div>

      {/* Footer (superpuesto al overlay, pero en la parte inferior) */}
      <footer className="absolute bottom-4 z-10 text-gray-800 text-sm">
        © Created By.CODERS - 2025
      </footer>
    </div>
  );
}