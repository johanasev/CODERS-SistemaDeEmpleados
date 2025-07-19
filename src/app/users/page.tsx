// src/app/users/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { dummySystemUsers } from '../../data/dummyUsers'; // Importa los usuarios dummy
import { useAuth, User } from '../../context/AuthContext'; // Importa useAuth y User
import { useRouter } from 'next/navigation'; // Para posible redirección si no es ADMIN

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(dummySystemUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER'>('USER'); // Para el dropdown del rol
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { user: currentUser } = useAuth(); // El usuario que está logueado
  const router = useRouter();

  // Redirigir si el usuario no es ADMIN (opcional, pero buena práctica para páginas sensibles)
  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      router.push('/dashboard'); // O a una página de "acceso denegado"
    }
  }, [currentUser, router]);

  // Si quieres que los usuarios persistan, podrías guardarlos/cargarlos de localStorage
  useEffect(() => {
    // const storedUsers = localStorage.getItem('systemUsers');
    // if (storedUsers) {
    //   setUsers(JSON.parse(storedUsers));
    // } else {
      setUsers(dummySystemUsers); // Cargar usuarios dummy al inicio
    // }
  }, []);

  // Función para manejar la apertura del modal de edición
  const handleEditClick = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    setSelectedRole(userToEdit.role); // Establece el rol actual del usuario como predeterminado
    setSaveStatus('idle'); // Restablecer estado del guardado
    setIsModalOpen(true);
  };

  // Función para manejar el guardado de la edición del rol
  const handleSaveRole = () => {
    if (!selectedUser) return;

    setSaveStatus('loading');

    // Simular una llamada a API para actualizar el usuario
    setTimeout(() => {
      try {
        const updatedUsers = users.map((u) =>
          u.id === selectedUser.id ? { ...u, role: selectedRole } : u
        );
        setUsers(updatedUsers);
        // localStorage.setItem('systemUsers', JSON.stringify(updatedUsers)); // Guardar en localStorage si lo habilitas
        setSaveStatus('success');

        setTimeout(() => {
          setIsModalOpen(false); // Cerrar modal
          setSelectedUser(null); // Limpiar usuario seleccionado
          setSaveStatus('idle'); // Restablecer estado de guardado
        }, 1000); // Muestra éxito por 1 segundo antes de cerrar
      } catch (error) {
        setSaveStatus('error');
        console.error('Error al actualizar rol (simulado):', error);
        setTimeout(() => setSaveStatus('idle'), 2000); // Restablece estado después de error
      }
    }, 1500); // Simula un retraso de red
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
    // Opcional: Mostrar un mensaje o un spinner mientras redirige
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-2xl font-bold text-gray-700">Acceso Denegado</h2>
            <p className="text-gray-500">Solo los administradores pueden ver esta página.</p>
        </div>
    );
  }

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Sistema de Gestión de Empleados</span>
          <span className="font-extrabold text-lg text-gray-700">CODERS</span>
        </div>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Lista de Usuarios</h2>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Creación</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => ( // Renombrado a userItem para evitar conflicto con currentUser
                <tr key={userItem.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{userItem.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{userItem.idCreationDate || 'N/A'}</td> {/* Muestra la fecha de creación */}
                  <td className="px-4 py-3 text-sm text-gray-800">{userItem.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{userItem.role}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {/* El botón de editar solo aparece si el usuario logueado es ADMIN */}
                    {currentUser && currentUser.role === 'ADMIN' && (
                        <button
                            onClick={() => handleEditClick(userItem)}
                            className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-200"
                        >
                            Editar
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal para editar usuario */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Editar Usuario</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo del Usuario:</label>
              <p className="px-3 py-2 border rounded-md bg-gray-100 text-gray-800">
                {selectedUser.email}
              </p>
            </div>
            <div className="mb-6">
              <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
              <select
                id="userRole"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'ADMIN' | 'USER')}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                  setSaveStatus('idle');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-200"
                disabled={saveStatus === 'loading'}
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRole}
                className={`px-4 py-2 rounded-md text-white font-semibold transition duration-200
                  ${saveStatus === 'loading' ? 'bg-blue-400 cursor-not-allowed' : saveStatus === 'success' ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                `}
                disabled={saveStatus === 'loading' || saveStatus === 'success'}
              >
                {saveStatus === 'loading' ? 'Guardando...' : saveStatus === 'success' ? 'Guardado!' : 'Guardar Cambios'}
              </button>
            </div>
            {saveStatus === 'success' && (
              <p className="mt-4 text-center text-green-600">Rol actualizado con éxito.</p>
            )}
            {saveStatus === 'error' && (
              <p className="mt-4 text-center text-red-600">Error al actualizar el rol.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}