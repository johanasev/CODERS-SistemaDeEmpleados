// src/app/masters/page.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import { dummyMaestros, Maestro } from '../../data/maestros';
import { useAuth } from '../../context/AuthContext';

export default function MastersPage() {
  const [maestros, setMaestros] = useState<Maestro[]>(dummyMaestros);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMaestroName, setNewMaestroName] = useState('');
  const [newMaestroBalance, setNewMaestroBalance] = useState<number>(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { user } = useAuth();

  useEffect(() => {
    setMaestros(dummyMaestros); // Cargar los maestros dummy por defecto
  }, []);

  const handleCreateMaestro = () => {
    if (!newMaestroName.trim()) {
      alert('El nombre del Maestro no puede estar vacío.');
      return;
    }
    if (newMaestroBalance < 0) {
      alert('El saldo inicial no puede ser negativo.');
      return;
    }

    setSaveStatus('loading');

    setTimeout(() => {
      try {
        const newMaestro: Maestro = {
          id: `M${String(maestros.length + 1).padStart(3, '0')}`,
          nombre: newMaestroName.trim(),
          saldo: newMaestroBalance,
          creadoPor: user ? user.id : 'desconocido',
        };

        setMaestros((prevMaestros) => {
          const updatedMaestros = [...prevMaestros, newMaestro];
          return updatedMaestros;
        });
        
        setSaveStatus('success');
        
        setTimeout(() => {
          setNewMaestroName('');
          setNewMaestroBalance(0);
          setIsModalOpen(false); 
          setSaveStatus('idle'); 
        }, 1000); 
        
      } catch (error) {
        setSaveStatus('error');
        console.error('Error al crear Maestro (simulado):', error);
        setTimeout(() => setSaveStatus('idle'), 2000); 
      }
    }, 1500); 
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Maestros</h1>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">Sistema de Gestión de Empleados</span>
          <span className="font-extrabold text-lg text-gray-700">CODERS</span>
        </div>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Lista de Maestros</h2>
        {user && user.role === 'ADMIN' && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setNewMaestroName('');
              setNewMaestroBalance(0);
              setSaveStatus('idle');
            }}
            className="mb-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Agregar Maestro
          </button>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nombre del Maestro</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Saldo</th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Creado Por</th>
              </tr>
            </thead>
            <tbody>
              {maestros.map((maestro) => (
                <tr key={maestro.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-800">{maestro.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{maestro.nombre}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">${maestro.saldo.toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-800">{maestro.creadoPor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal para agregar nuevo maestro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Agregar Nuevo Maestro</h3>
            <div className="mb-4">
              <label htmlFor="maestroName" className="block text-sm font-medium text-gray-700 mb-1">Nombre del Maestro</label>
              <input
                type="text"
                id="maestroName"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500" // Corregido: clases de texto dentro del string
                value={newMaestroName}
                onChange={(e) => setNewMaestroName(e.target.value)}
                placeholder="Ej. Diseño Gráfico"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-700 mb-1">Saldo Inicial</label>
              <input
                type="number"
                id="initialBalance"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-800 placeholder-gray-500" // Corregido: clases de texto dentro del string
                value={newMaestroBalance}
                onChange={(e) => setNewMaestroBalance(parseFloat(e.target.value))}
                min="0"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setNewMaestroName('');
                  setNewMaestroBalance(0);
                  setSaveStatus('idle');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-200"
                disabled={saveStatus === 'loading'}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateMaestro}
                className={`px-4 py-2 rounded-md text-white font-semibold transition duration-200
                  ${saveStatus === 'loading' ? 'bg-blue-400 cursor-not-allowed' : saveStatus === 'success' ? 'bg-green-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                `} // Ajustado color del botón en 'success'
                disabled={saveStatus === 'loading' || saveStatus === 'success'}
              >
                {saveStatus === 'loading' ? 'Creando...' : saveStatus === 'success' ? 'Creado!' : 'Crear Maestro'}
              </button>
            </div>
            {saveStatus === 'success' && (
              <p className="mt-4 text-center text-green-600">Maestro creado con éxito.</p>
            )}
            {saveStatus === 'error' && (
              <p className="mt-4 text-center text-red-600">Error al crear Maestro.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}