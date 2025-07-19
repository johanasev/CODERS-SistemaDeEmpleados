'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
export interface User {
  id: string; // <-- ¡Asegúrate de que esta línea esté presente!
  nombre: string;
  correo: string;
  rol: 'ADMIN' | 'USER';
  position: string;
  profilePic?: string;
  idCreationDate?: string; // Opcional, si lo usas
}
export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedRole, setSelectedRole] = useState<'ADMIN' | 'USER'>('USER');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { user: currentUser, token } = useAuth();
  const router = useRouter();

  // Redirige si no es ADMIN
  useEffect(() => {
    if (currentUser && currentUser.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/usuarios');
        if (!res.ok) throw new Error('Error al obtener usuarios');
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEditClick = (userToEdit: User) => {
    setSelectedUser(userToEdit);
    setSelectedRole(userToEdit.rol);
    setSaveStatus('idle');
    setIsModalOpen(true);
  };

  const handleSaveRole = async () => {
    if (!selectedUser) return;
    setSaveStatus('loading');

    try {
      const res = await fetch('/api/usuarios', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: selectedUser.id, rol: selectedRole }),
      });

      if (!res.ok) throw new Error('Error en la actualización');

      const updatedUser = await res.json();

      const updatedUsers = users.map((u) =>
        u.id === updatedUser.id ? { ...u, role: updatedUser.rol } : u
      );

      setUsers(updatedUsers);
      setSaveStatus('success');

      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setSaveStatus('idle');
      }, 1000);
    } catch (error) {
      console.error('Error al actualizar el rol:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  if (!currentUser || currentUser.role !== 'ADMIN') {
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
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Correo</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((userItem) => (
                <tr key={userItem.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{userItem.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{userItem.correo}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{userItem.rol}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">
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

      {/* Modal de edición */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Editar Usuario</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo:</label>
              <p className="px-3 py-2 border rounded-md bg-gray-100 text-gray-800">{selectedUser.correo}</p>
            </div>
            <div className="mb-6">
              <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">Rol:</label>
              <select
                id="userRole"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as 'ADMIN' | 'USER')}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedUser(null);
                  setSaveStatus('idle');
                }}
                className="px-4 py-2 border rounded-md text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveRole}
                className={`px-4 py-2 rounded-md text-white font-semibold
                  ${saveStatus === 'loading'
                    ? 'bg-blue-400 cursor-not-allowed'
                    : saveStatus === 'success'
                    ? 'bg-green-500'
                    : 'bg-blue-600 hover:bg-blue-700'}
                `}
                disabled={saveStatus === 'loading' || saveStatus === 'success'}
              >
                {saveStatus === 'loading' ? 'Guardando...' : saveStatus === 'success' ? 'Guardado' : 'Guardar'}
              </button>
            </div>

            {saveStatus === 'success' && <p className="mt-4 text-green-600 text-center">Rol actualizado con éxito.</p>}
            {saveStatus === 'error' && <p className="mt-4 text-red-600 text-center">Error al actualizar el rol.</p>}
          </div>
        </div>
      )}
    </>
  );
}
