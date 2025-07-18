// src/app/login/page.tsx
'use client'; 

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '../../context/AuthContext'; 

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError(null);
    setPasswordError(null);
    setLoginMessage(null);

    let isValid = true;
    if (!email.trim()) {
      setEmailError('El correo electrónico es requerido.');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Formato de correo electrónico inválido.');
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError('La contraseña es requerida.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setLoginMessage('Iniciando sesión...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); 

      let userProfilePic;
      let userId: string; // Declara una variable para el ID

      if (email === 'admin@coders.com' && password === 'admin123') { // Asumiendo credenciales de admin
        userProfilePic = '/admin-profile.jpg';
        userId = 'admin001'; // Asigna un ID para el admin
      } else if (email === 'user@coders.com' && password === 'user123') { // Asumiendo credenciales de usuario
        userProfilePic = '/user-profile.jpg';
        userId = 'user001'; // Asigna un ID para el usuario
      } else {
        // Para cualquier otra combinación de email/password, puedes asignar un ID genérico
        // o lanzar un error si las credenciales no coinciden con ningún usuario conocido
        throw new Error('Credenciales inválidas.');
      }

      const simulatedUserData: User = {
        id: userId, // <<< ¡AÑADIDA LA PROPIEDAD 'ID' AQUÍ!
        name: email === 'admin@coders.com' ? 'Admin Maestro' : 'Usuario Prueba', // Nombre dinámico
        email: email,
        role: email === 'admin@coders.com' ? 'ADMIN' : 'USER',
        position: email === 'admin@coders.com' ? 'Gerente' : 'Empleado',
        profilePic: userProfilePic,
      };

      login(simulatedUserData); 

      setLoginMessage('¡Inicio de sesión exitoso! Redirigiendo...');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        router.push('/dashboard'); // Puedes cambiar esto a '/transactions' o '/masters'
      }, 1500);

    } catch (error: any) {
      setLoginMessage(`Error al iniciar sesión: ${error.message || 'Credenciales inválidas.'}`);
      console.error('Error de login:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    router.push('/'); 
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/bg.png" 
        alt="Background for login page"
        quality={100}
        fill 
        style={{ objectFit: 'cover', zIndex: -1 }} 
      />
      <div className="absolute inset-0 bg-white opacity-40 backdrop-filter backdrop-blur-lg z-0"></div>

      <div className="relative z-10 flex flex-col items-center p-8 bg-white bg-opacity-90 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-5xl font-bold text-yellow-500 mb-2 tracking-widest">
          CODERS
        </h1>
        <p className="text-xl text-gray-800 mb-8">
          Sistema de Gestión de Empleados
        </p>

        <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError(null); 
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                emailError ? 'border-red-500' : ''
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError(null); 
              }}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${
                passwordError ? 'border-red-500' : ''
              }`}
              placeholder="Tu contraseña"
              required
            />
            {passwordError && <p className="text-red-500 text-xs italic mt-1">{passwordError}</p>}
          </div>

          {loginMessage && (
            <p className={`text-center text-sm ${
              loginMessage.includes('exitoso') ? 'text-green-500' : 'text-red-500'
            }`}>
              {loginMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>
        <button
          onClick={handleCancelClick}
          disabled={isLoading}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
      </div>

      <footer className="absolute bottom-4 z-10 text-gray-800 text-sm">
        © Created By.CODERS - 2025
      </footer>
    </div>
  );
}