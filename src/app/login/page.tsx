// src/app/login/page.tsx
'use client'; // Necesario para hooks de React como useState y useRouter

import { useState } from 'react'; // Importa useState
import Image from 'next/image';
import backgroundImage from '../../../public/bg.png'; // Ajusta la ruta a tu imagen de fondo
import { useRouter } from 'next/navigation'; // Para el botón de Cancelar

export default function LoginPage() {
  const router = useRouter();

  // Estados para los valores de los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados para los mensajes de error de validación
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Estados para el manejo de la UI durante el envío del formulario
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null); // Mensaje de éxito/error general

  // Función para validar el formato del email
  const validateEmail = (email: string) => {
    // Expresión regular simple para validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    // Resetear mensajes de error y loginMessage
    setEmailError(null);
    setPasswordError(null);
    setLoginMessage(null);

    // Validaciones
    let isValid = true;
    if (!email.trim()) { // .trim() para quitar espacios en blanco al inicio/fin
      setEmailError('El correo electrónico es requerido.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Formato de correo electrónico inválido.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('La contraseña es requerida.');
      isValid = false;
    } else if (password.length < 6) { // Ejemplo de validación de longitud mínima
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    }

    if (!isValid) {
      return; // Detener el envío si hay errores de validación
    }

    // Si todo es válido, simular envío a backend
    setIsLoading(true); // Activar estado de carga
    setLoginMessage('Iniciando sesión...'); // Mensaje de carga

    try {
      // ** Aquí iría la llamada a tu API de autenticación **
      // Ejemplo simulado con setTimeout:
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simula 2 segundos de carga

      // Suponemos que la autenticación fue exitosa
      setLoginMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      // Limpiar campos después de un login exitoso
      setEmail('');
      setPassword('');

      // Redirigir a la página principal (o dashboard) después de un breve retraso
      setTimeout(() => {
        router.push('/'); // Redirige a la página principal por ahora, cambiar a /dashboard si ya existe
      }, 1500);

    } catch (error) {
      // Manejo de errores de la API (ej: credenciales incorrectas)
      setLoginMessage('Error al iniciar sesión. Credenciales inválidas o problema del servidor.');
      console.error('Error de login:', error);
    } finally {
      setIsLoading(false); // Desactivar estado de carga
    }
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

      {/* Overlay para el blur y la opacidad (ajusta según tu diseño) */}
      <div className="absolute inset-0 bg-white opacity-40 backdrop-filter backdrop-blur-lg z-0"></div>

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
              value={email} // Conectar input con el estado
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null); // Limpiar error al escribir
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                emailError ? 'border-red-500' : '' // Borde rojo si hay error
              }`}
              placeholder="Tu correo electrónico"
              required
            />
            {emailError && <p className="text-red-500 text-xs italic mt-1">{emailError}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              value={password} // Conectar input con el estado
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null); // Limpiar error al escribir
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                passwordError ? 'border-red-500' : '' // Borde rojo si hay error
              }`}
              placeholder="Tu contraseña"
              required
            />
            {passwordError && <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>}
          </div>

          {/* Mensaje de carga/éxito/error */}
          {loginMessage && (
            <p className={`text-center text-sm ${
              loginMessage.includes('exitoso') ? 'text-green-500' : 'text-red-500'
            }`}>
              {loginMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading} // Deshabilitar botón si está cargando
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <button
          onClick={handleCancelClick}
          disabled={isLoading} // Deshabilitar botón si está cargando
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
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