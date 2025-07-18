// src/components/AddMovementDialog.tsx
'use client';

import React, { useState, useEffect } from 'react';

interface AddMovementDialogProps {
  isOpen: boolean;
  onClose: () => void;
  maestroName: string;
  onSave: (type: 'Ingreso' | 'Egreso', quantity: number) => Promise<void>;
  saveStatus: 'idle' | 'loading' | 'success' | 'error';
}

const AddMovementDialog: React.FC<AddMovementDialogProps> = ({ isOpen, onClose, maestroName, onSave, saveStatus }) => {
  const [movementType, setMovementType] = useState<'Ingreso' | 'Egreso'>('Ingreso');
  const [quantity, setQuantity] = useState<number>(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Calcula el estado de "deshabilitado" para el formulario y los botones.
  // Se hace aquí, fuera de los bloques de renderizado condicional,
  // para que TypeScript no "estreche" el tipo de 'saveStatus' y evite el error 2367.
  const isFormDisabled = saveStatus === 'loading';

  // Efecto para restablecer el formulario y el mensaje de éxito cuando se abre el diálogo
  useEffect(() => {
    if (isOpen) {
      setMovementType('Ingreso');
      setQuantity(0);
      setShowSuccessMessage(false);
    }
  }, [isOpen]);

  // Efecto para manejar el estado de éxito y quizás cerrar automáticamente
  useEffect(() => {
    if (saveStatus === 'success') {
      setShowSuccessMessage(true);
      // Opcional: Cerrar el diálogo automáticamente después de un tiempo
      // const timer = setTimeout(() => {
      //   onClose();
      // }, 2000);
      // return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (quantity <= 0) {
      alert('La cantidad debe ser mayor que 0.');
      return;
    }
    await onSave(movementType, quantity);
  };

  const handleClose = () => {
    setShowSuccessMessage(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Agregar Movimiento para "{maestroName}"
        </h2>

        {/* Mensajes de estado de guardado */}
        {saveStatus === 'loading' && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4" role="alert">
            Cargando... Guardando movimiento.
          </div>
        )}
        {showSuccessMessage && saveStatus === 'success' && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
            ¡Movimiento creado con éxito!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            Error al crear el movimiento. Intenta de nuevo.
          </div>
        )}

        {/* Ocultar formulario mientras se guarda o muestra éxito.
            La condición ha sido ajustada para ser (saveStatus !== 'loading' && saveStatus !== 'success')
            o (saveStatus === 'idle' || saveStatus === 'error') como lo tenías.
            Mantengo la condición original que presentaste, pero el punto clave para los errores
            es la variable 'isFormDisabled'. */}
        {(saveStatus === 'idle' || saveStatus === 'error') && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tipo de Movimiento:
              </label>
              <div className="flex items-center">
                <label className="inline-flex items-center mr-6">
                  <input
                    type="radio"
                    className="form-radio text-yellow-500"
                    name="movementType"
                    value="Ingreso"
                    checked={movementType === 'Ingreso'}
                    onChange={() => setMovementType('Ingreso')}
                    disabled={isFormDisabled} // ¡USANDO LA NUEVA VARIABLE!
                  />
                  <span className="ml-2 text-gray-800">Entrada (Ingreso)</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-yellow-500"
                    name="movementType"
                    value="Egreso"
                    checked={movementType === 'Egreso'}
                    onChange={() => setMovementType('Egreso')}
                    disabled={isFormDisabled} // ¡USANDO LA NUEVA VARIABLE!
                  />
                  <span className="ml-2 text-gray-800">Salida (Egreso)</span>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="quantity" className="block text-gray-700 text-sm font-bold mb-2">
                Cantidad de elementos:
              </label>
              <input
                type="number"
                id="quantity"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-yellow-500"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                min="1"
                disabled={isFormDisabled} // ¡USANDO LA NUEVA VARIABLE!
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-4">
          {/* Mostrar solo el botón de "Ok" si el guardado fue exitoso */}
          {saveStatus === 'success' ? (
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleClose}
            >
              Ok
            </button>
          ) : (
            // Mostrar botones de cancelar/crear en otros estados
            <>
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                onClick={handleClose}
                disabled={isFormDisabled} // ¡USANDO LA NUEVA VARIABLE!
              >
                Cancelar
              </button>
              <button
                type="button"
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
                onClick={handleSave}
                disabled={isFormDisabled} // ¡USANDO LA NUEVA VARIABLE!
              >
                {saveStatus === 'loading' ? 'Guardando...' : 'Crear Movimiento'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMovementDialog;