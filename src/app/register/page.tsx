"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegistroPage() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!nombre || !correo || !contrasena) {
      setError("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, correo, contrasena, rol: "USER" }), // Rol fijo
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar el usuario.");
      }

      setSuccess("Usuario registrado exitosamente.");
      setNombre("");
      setCorreo("");
      setContrasena("");

      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error al registrar el usuario.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-yellow-600 mb-4">
          Registro de Usuario
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <div>
          <label className="block text-sm font-medium text-black">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Correo</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">
            Contraseña
          </label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            className="mt-1 block w-full border border-gray-300 text-black rounded-md shadow-sm p-2"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-sm text-center mt-2">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-yellow-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
