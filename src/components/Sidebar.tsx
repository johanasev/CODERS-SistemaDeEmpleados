// src/components/Sidebar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // <-- ¡Asegúrate de importar useRouter aquí!
import { useAuth } from '../context/AuthContext'; 

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter(); // <-- ¡Inicializa useRouter aquí!
  const { user, logout } = useAuth();

  if (!user) {
    // Si no hay usuario, este componente no debería mostrarse,
    // pero es un buen "fallback" en caso de que ocurra.
    return null; 
  }

  const navigationLinks = [
    { name: 'Transacciones', href: '/transactions', roles: ['ADMIN', 'USER'] },
    { name: 'Maestros', href: '/masters', roles: ['ADMIN', 'USER'] },
    { name: 'Usuarios', href: '/users', roles: ['ADMIN'] },
  ];

  // ¡NUEVA FUNCIÓN para manejar el cierre de sesión y la redirección!
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto para limpiar los datos del usuario
    router.push('/login'); // <-- ¡Redirige explícitamente a la página de login!
  };

  return (
    <aside className="w-64 bg-white shadow-lg p-6 flex flex-col items-center border-r border-gray-200">
      {/* Sección de Información Personal */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-yellow-500">
          <Image
            src={user.profilePic || '/profile-placeholder.jpg'} // Usa la foto del usuario o una placeholder
            alt="Foto de perfil"
            layout="fill"
            objectFit="cover"
            className="rounded-full"
          />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 text-center relative flex items-center">
          {user.name}
          <span className="ml-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        </h2>
        <p className="text-sm text-gray-600 text-center">{user.position}</p>
        <span className={`text-xs font-bold px-2 py-1 rounded-full mt-2 ${
          user.role === 'ADMIN' ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'
        }`}>
          {user.role}
        </span>
      </div>

      {/* Enlaces de Navegación */}
      <nav className="w-full space-y-4">
        {navigationLinks.map((link) => (
          user.role && link.roles.includes(user.role) && (
            <Link key={link.name} href={link.href} passHref>
              <button
                className={`w-full py-3 px-4 rounded-lg text-lg font-bold transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-md
                  ${pathname === link.href ? 'bg-yellow-600 text-white shadow-md' : 'bg-yellow-500 text-white'}
                `}
              >
                {link.name}
              </button>
            </Link>
          )
        ))}
      </nav>

      {/* Botón de Logout */}
      <button
        onClick={handleLogout} // <--- ¡AQUÍ LLAMAMOS A LA NUEVA FUNCIÓN!
        className="mt-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
      >
        Cerrar Sesión
      </button>
    </aside>
  );
}