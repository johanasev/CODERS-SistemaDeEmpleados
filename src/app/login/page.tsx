// src/app/login/page.tsx
'use client'; // Necesario para hooks de React como useState y useRouter

import Image from 'next/image';
import backgroundImage from '../../../public/bg.png'; // Ajusta la ruta a tu imagen de fondo
import { useRouter } from 'next/navigation'; // Para el botón de Cancelar

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario
    // Aquí irá la lógica para enviar el formulario (a la API de autenticación)
    console.log('Intento de inicio de sesión');
    // Por ahora, solo redirigimos a la página principal después de un "intento"
    // router.push('/dashboard'); // Descomentar y cambiar a la ruta del dashboard una vez exista
  };

  const handleCancelClick = () => {
    router.push('/'); // Redirige de vuelta a la página de landing
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      {/* Imagen de fondo usando next/image (la misma que en el landing) */}
      <Image
        src={backgroundImage}
        alt="Background for login page"
        quality={100}
        fill
        style={{ objectFit: 'cover', zIndex: -1 }}
      />

      {/* Overlay para el blur y la opacidad (más blur que en el landing) */}
      {/* Ajusta la opacidad y el blur según el diseño de Figma */}
      <div className="absolute inset-0 bg-white opacity-40 backdrop-filter backdrop-blur-lg z-0"></div>
      {/* ^^^^^^^^^^^^^^^^^^^^^^^^^^  Más opacidad y blur */}

      {/* Contenido principal: Título, Subtítulo y Formulario de Login */}
      <div className="relative z-10 flex flex-col items-center p-8 bg-white bg-opacity-90 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-5xl font-bold text-yellow-500 mb-2 tracking-widest">
          CODERS
        </h1>
        <p className="text-xl text-gray-800 mb-8">
          Sistema de Gestión de Empleados
        </p>

        {/* Formulario de Login */}
        <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Tu correo electrónico"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Tu contraseña"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Iniciar Sesión
          </button>
        </form>
        <button
          onClick={handleCancelClick}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Cancelar
        </button>
      </div>

      {/* Footer (superpuesto al overlay) */}
      <footer className="absolute bottom-4 z-10 text-gray-800 text-sm">
        © Created By.CODERS - 2025
      </footer>
    </div>
  );
}
