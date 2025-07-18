// src/app/transactions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TransactionsChart from '../../components/TransactionsChart';
import AddMovementDialog from '../../components/AddMovementDialog';

interface Maestro {
  id: string;
  name: string;
}

const dummyMaestros: Maestro[] = [
  { id: 'M001', name: 'Materia Prima A' },
  { id: 'M002', name: 'Producto Terminado B' },
  { id: 'M003', name: 'Insumo C' },
];

interface Transaction {
  id: string;
  date: string;
  type: 'Ingreso' | 'Egreso';
  amount: number;
  description: string;
  user: string;
  maestroId: string;
}

// Datos simulados de transacciones
const initialDummyTransactions: Transaction[] = [ // Renombrado para diferenciar
  { id: 'TRN001', date: '2024-07-15', type: 'Ingreso', amount: 1500.00, description: 'Salario Julio', user: 'admin@coders.com', maestroId: 'M001' },
  { id: 'TRN002', date: '2024-07-16', type: 'Egreso', amount: 50.75, description: 'Material de oficina', user: 'admin@coders.com', maestroId: 'M001' },
  { id: 'TRN004', date: '2024-07-17', type: 'Ingreso', amount: 75.00, description: 'Venta de producto A', user: 'user@coders.com', maestroId: 'M002' },
  { id: 'TRN005', date: '2024-07-17', type: 'Egreso', amount: 120.50, description: 'Pago de servicios', user: 'admin@coders.com', maestroId: 'M003' },
  { id: 'TRN006', date: '2024-07-18', type: 'Ingreso', amount: 300.00, description: 'Recepción stock M. Prima', user: 'admin@coders.com', maestroId: 'M001' },
  { id: 'TRN007', date: '2024-07-18', type: 'Egreso', amount: 15.00, description: 'Despacho pequeño Insumo', user: 'user@coders.com', maestroId: 'M003' },
];

export default function TransactionsPage() {
  const { user } = useAuth();
  // Usamos initialDummyTransactions para el estado inicial
  const [allTransactions, setAllTransactions] = useState<Transaction[]>(initialDummyTransactions); 
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false); // No necesitamos cargar dummyTransactions con delay si ya están en el estado inicial
  const [selectedMaestroId, setSelectedMaestroId] = useState<string | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle'); // Nuevo estado para el guardado

  // Este useEffect ahora solo reacciona a los cambios en allTransactions y selectedMaestroId
  useEffect(() => {
    if (selectedMaestroId === 'all') {
      setFilteredTransactions(allTransactions);
    } else {
      const filtered = allTransactions.filter(
        (t) => t.maestroId === selectedMaestroId
      );
      setFilteredTransactions(filtered);
    }
  }, [selectedMaestroId, allTransactions]); // allTransactions es una dependencia crucial aquí

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Por favor, inicia sesión para acceder a las transacciones.
      </div>
    );
  }

  // Ya no es necesario este loading si los dummyTransactions están en el estado inicial
  // Pero lo mantengo por si más adelante se cargan desde una API real
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Cargando transacciones...
      </div>
    );
  }

  const processChartData = (transactions: Transaction[]) => {
    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(t => {
      if (t.type === 'Ingreso') {
        totalIncome += t.amount;
      } else if (t.type === 'Egreso') {
        totalExpense += t.amount;
      }
    });

    return {
      labels: ['Ingresos', 'Egresos'],
      datasets: [
        {
          label: 'Monto Total',
          data: [totalIncome, totalExpense],
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const chartData = processChartData(filteredTransactions);

  const openDialog = () => {
    if (selectedMaestroId === 'all') {
      alert('Por favor, selecciona un Maestro específico antes de agregar un movimiento.');
      return;
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSaveStatus('idle'); // Restablecer el estado de guardado al cerrar el diálogo
  };

  const handleSaveNewMovement = async (type: 'Ingreso' | 'Egreso', quantity: number) => {
    setSaveStatus('loading'); // Indicar que el guardado está en progreso

    // Simular una llamada a API
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula un retraso de red

    try {
      if (!user) {
        throw new Error('Usuario no autenticado.');
      }
      if (selectedMaestroId === 'all') {
        throw new Error('No se puede guardar sin un Maestro seleccionado.');
      }

      // Generar un ID único (simple para simulación)
      const newId = `TRN${String(allTransactions.length + 1).padStart(3, '0')}`;
      const today = new Date().toISOString().slice(0, 10); // Fecha actual YYYY-MM-DD

      const newTransaction: Transaction = {
        id: newId,
        date: today,
        type: type,
        amount: quantity,
        description: `Movimiento de ${type.toLowerCase()} de ${quantity} unidades`, // Descripción generada
        user: user.email, // Usuario logueado
        maestroId: selectedMaestroId, // Maestro seleccionado
      };

      // Actualizar el estado con la nueva transacción (simula el guardado en BD)
      setAllTransactions(prevTransactions => [...prevTransactions, newTransaction]);
      setSaveStatus('success'); // Indicar éxito
      
      // La tabla y la gráfica se actualizarán automáticamente gracias al useEffect que depende de allTransactions

      // No cerrar el diálogo inmediatamente para que el usuario vea el mensaje de éxito
      // Se cerrará al hacer clic en "Ok" o automáticamente después de un tiempo si se desea
      // closeDialog(); // Esto se ejecutará al hacer clic en el botón de confirmación en el diálogo
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      setSaveStatus('error'); // Indicar error
      // Podrías pasar el mensaje de error al diálogo para mostrarlo
    }
  };

  const currentMaestroName = selectedMaestroId === 'all'
    ? 'Ninguno Seleccionado'
    : dummyMaestros.find(m => m.id === selectedMaestroId)?.name || 'Maestro no encontrado';

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Transacciones</h1>
      
      <div className="mb-6">
        <label htmlFor="maestro-select" className="block text-gray-700 text-lg font-medium mb-2">
          Seleccionar Maestro:
        </label>
        <select
          id="maestro-select"
          className="block w-64 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm text-gray-900"
          value={selectedMaestroId}
          onChange={(e) => setSelectedMaestroId(e.target.value)}
        >
          <option value="all">Todos los Maestros</option>
          {dummyMaestros.map((maestro) => (
            <option key={maestro.id} value={maestro.id}>
              {maestro.name}
            </option>
          ))}
        </select>
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="text-gray-600">No hay transacciones para mostrar para el Maestro seleccionado.</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID del movimiento</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de unidades</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persona que ejecutó el movimiento</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      transaction.type === 'Ingreso' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">{transaction.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{transaction.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.user}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
        onClick={openDialog}
      >
        Agregar Movimiento
      </button>

      <div className="mt-8 p-6 bg-white shadow rounded-lg h-80 flex items-center justify-center">
        <TransactionsChart data={chartData} />
      </div>

      <AddMovementDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        maestroName={currentMaestroName}
        onSave={handleSaveNewMovement}
        saveStatus={saveStatus} // Pasar el estado de guardado al diálogo
      />
    </div>
  );
}