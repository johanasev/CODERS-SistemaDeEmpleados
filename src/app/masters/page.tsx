"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface Maestro {
  id: string;
  nombre: string;
  correo: string;
  cargo: string;
  salario: number;
  fecha_ingreso: string;
  horas_trabajadas: number;
  evaluacion_desempeno: string;
  creado_por: string;
  creador?: {
    nombre: string;
  };
}

interface MaestroFormData {
  nombre: string;
  correo: string;
  cargo: string;
  fecha_ingreso: string;
  evaluacion_desempeno: string;
  salario: number;
  horas_trabajadas: number;
}

export default function MastersPage() {
  const [maestros, setMaestros] = useState<Maestro[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    cargo: "",
    salario: 0,
    fecha_ingreso: "",
    horas_trabajadas: 0,
    evaluacion_desempeno: "",
  });

  const [saveStatus, setSaveStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const { user, token } = useAuth();

  useEffect(() => {
    const fetchMaestros = async () => {
      try {
        const res = await fetch("/api/empleados", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener maestros");

        const data = await res.json();
        setMaestros(data);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchMaestros();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "salario" || name === "horas_trabajadas"
        ? parseFloat(value)
        : value,
    }));
  };

  const handleCreateMaestro = async () => {
    if (!form.nombre || !form.correo || !form.cargo) {
      alert("Por favor completa todos los campos requeridos.");
      return;
    }

    setSaveStatus("loading");

    try {
      const res = await fetch("/api/empleados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          creado_por: user?.id,
        }),
      });

      if (!res.ok) throw new Error("Error al crear maestro");

      const newMaestro = await res.json();
      setMaestros((prev) => [...prev, newMaestro]);

      setSaveStatus("success");
      setTimeout(() => {
        setForm({
          nombre: "",
          correo: "",
          cargo: "",
          salario: 0,
          fecha_ingreso: "",
          horas_trabajadas: 0,
          evaluacion_desempeno: "",
        });
        setIsModalOpen(false);
        setSaveStatus("idle");
      }, 1000);
    } catch (error) {
      console.error(error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }
  };

  return (
    <>
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Maestros</h1>
        <div className="flex items-center">
          <span className="mr-2 text-gray-600">
            Sistema de Gestión de Empleados
          </span>
          <span className="font-extrabold text-lg text-gray-700">CODERS</span>
        </div>
      </header>

      <section className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Lista de Empleados
        </h2>
        {user?.role === "ADMIN" && (
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSaveStatus("idle");
            }}
            className="mb-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Agregar Empleado
          </button>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Nombre
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Correo
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Cargo
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Salario
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600 uppercase">
                  Creador
                </th>
              </tr>
            </thead>
            <tbody>
              {maestros.map((m) => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-black">{m.nombre}</td>
                  <td className="px-4 py-3 text-sm text-black">{m.correo}</td>
                  <td className="px-4 py-3 text-sm text-black">{m.cargo}</td>
                  <td className="px-4 py-3 text-sm text-black">${m.salario}</td>
                  <td className="px-4 py-3 text-sm text-black">
                    {m.creador?.nombre || m.creado_por}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Agregar Nuevo Empleado
            </h3>

            {([
              "nombre",
              "correo",
              "cargo",
              "fecha_ingreso",
              "evaluacion_desempeno",
            ] as (keyof MaestroFormData)[]).map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field.replace("_", " ")}
                </label>
                <input
                  type={field === "fecha_ingreso" ? "date" : "text"}
                  name={field}
                  value={form[field]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800"
                />
              </div>
            ))}

            {(["salario", "horas_trabajadas"] as (keyof MaestroFormData)[]).map(
              (field) => (
                <div className="mb-4" key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type="number"
                    name={field}
                    value={form[field]}
                    onChange={handleInputChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-800"
                  />
                </div>
              )
            )}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSaveStatus("idle");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                disabled={saveStatus === "loading"}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateMaestro}
                className={`px-4 py-2 rounded-md text-white font-semibold
                  ${
                  saveStatus === "loading"
                    ? "bg-blue-400"
                    : saveStatus === "success"
                    ? "bg-green-500"
                    : "bg-blue-600 hover:bg-blue-700"
                }
                `}
                disabled={saveStatus === "loading" || saveStatus === "success"}
              >
                {saveStatus === "loading"
                  ? "Creando..."
                  : saveStatus === "success"
                  ? "Creado!"
                  : "Crear"}
              </button>
            </div>

            {saveStatus === "success" && (
              <p className="mt-4 text-green-600 text-center">
                Empleado creado con éxito.
              </p>
            )}
            {saveStatus === "error" && (
              <p className="mt-4 text-red-600 text-center">
                Error al crear empleado.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
