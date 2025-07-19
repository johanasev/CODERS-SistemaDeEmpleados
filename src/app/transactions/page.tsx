'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import TransactionsChart from '../../components/TransactionsChart';

interface Empleado {
  id: string;
  nombre: string;
}

interface Pago {
  id: string;
  fecha_pago: string;
  monto_pagado: number;
  horas_pagadas: number;
  metodo_pago: string;
}

export default function TransactionsPage() {
  const { user, token } = useAuth();
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [selectedEmpleadoId, setSelectedEmpleadoId] = useState<string>('all');
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const [montoPagado, setMontoPagado] = useState<number>(0);
  const [horasPagadas, setHorasPagadas] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<string>('');

  useEffect(() => {
    if (!token) return;
    fetch('/api/empleados', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: Empleado[]) => {
        setEmpleados(data);
      })
      .catch(console.error);
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const url = selectedEmpleadoId === 'all'
      ? '/api/pagos'
      : `/api/pagos/${selectedEmpleadoId}`;

    setLoading(true);
    fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then((data: Pago[]) => {
        setPagos(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedEmpleadoId, token]);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Por favor, inicia sesión para acceder a los pagos.
      </div>
    );
  }

  const processChartData = () => {
  const pagosPorMes: { [mes: string]: number } = {};

  pagos.forEach(p => {
    const fecha = new Date(p.fecha_pago);
    const mes = fecha.toLocaleString('es-ES', { month: 'long' }); // Ej: "enero"
    pagosPorMes[mes] = (pagosPorMes[mes] || 0) + p.monto_pagado;
  });

  const labels = Object.keys(pagosPorMes);
  const data = Object.values(pagosPorMes);

  return {
    labels,
    datasets: [
      {
        label: 'Pagos por Mes',
        data,
        backgroundColor: new Array(data.length).fill('#36A2EB'),
        borderColor: new Array(data.length).fill('#2c84c7'),
        borderWidth: 1,
      },
    ],
  };
};


  const openDialog = () => {
    if (selectedEmpleadoId === 'all') {
      alert('Por favor, selecciona un empleado antes de agregar un pago.');
      return;
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSaveStatus('idle');
    setMontoPagado(0);
    setHorasPagadas(0);
    setMetodoPago('');
  };

  const handleSaveNewPayment = async (monto_pagado: number, horas_pagadas: number, metodo_pago: string) => {
    setSaveStatus('loading');
    try {
      const res = await fetch('/api/pagos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          empleado_id: selectedEmpleadoId,
          monto_pagado,
          horas_pagadas,
          metodo_pago,
          fecha_pago: new Date().toISOString(),
        }),
      });

      if (!res.ok) throw new Error('Error creando pago');
      const nuevoPago: Pago = await res.json();

      setPagos(prev => [...prev, nuevoPago]);
      setSaveStatus('success');
      closeDialog();
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Pagos</h1>

      <div className="mb-6 text-black">
        <label htmlFor="empleado-select" className="block text-gray-700 text-lg font-medium mb-2">
          Seleccionar Empleado:
        </label>
        <select
          id="empleado-select"
          className="block w-64 p-2 border border-gray-300 rounded-md"
          value={selectedEmpleadoId}
          onChange={(e) => setSelectedEmpleadoId(e.target.value)}
        >
          <option value="all">Todos los Empleados</option>
          {empleados.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.nombre}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Cargando pagos...</p>
      ) : pagos.length === 0 ? (
        <p className="text-gray-600">Sin pagos para mostrar.</p>
      ) : (
        <table className="min-w-full bg-white border rounded-lg mb-4 text-black">
          <thead className="bg-gray-50">
            <tr>
              <th>ID</th><th>Fecha</th><th>Monto</th><th>Horas</th><th>Método</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{new Date(p.fecha_pago).toLocaleDateString()}</td>
                <td>${p.monto_pagado.toFixed(2)}</td>
                <td>{p.horas_pagadas}</td>
                <td>{p.metodo_pago}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-6">
        <TransactionsChart data={processChartData()} />
      </div>

      <button
        className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg"
        onClick={openDialog}
      >
        Registrar Pago
      </button>

      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Registrar Pago</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSaveNewPayment(montoPagado, horasPagadas, metodoPago);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Monto pagado</label>
                <input
                  type="number"
                  value={montoPagado}
                  onChange={(e) => setMontoPagado(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Horas pagadas</label>
                <input
                  type="number"
                  value={horasPagadas}
                  onChange={(e) => setHorasPagadas(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Método de pago</label>
                <input
                  type="text"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeDialog}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md"
                >
                  Guardar
                </button>
              </div>
              {saveStatus === 'error' && (
                <p className="text-red-500 text-sm mt-2">Error al guardar el pago.</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
