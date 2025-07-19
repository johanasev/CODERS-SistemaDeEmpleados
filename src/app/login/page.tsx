"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, User } from "../../context/AuthContext";
import { jwtDecode } from "jwt-decode";
interface DecodedToken {
  id: string;
  correo: string;
  rol: string;
  // Agrega más propiedades si tu token incluye otras
}
export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setEmailError(null);
    setPasswordError(null);
    setLoginMessage(null);

    let isValid = true;
    if (!email.trim()) {
      setEmailError("El correo electrónico es requerido.");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Formato de correo electrónico inválido.");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("La contraseña es requerida.");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      isValid = false;
    }

    if (!isValid) return;

    setIsLoading(true);
    setLoginMessage("Iniciando sesión...");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
      }

      const token = data.token;
      localStorage.setItem("token", token);

      // Decodificar el token para obtener info del usuario
      const decoded: DecodedToken = jwtDecode<DecodedToken>(token);

      const simulatedUserData: User = {
        id: decoded.id,
        name: decoded.correo.split("@")[0],
        email: decoded.correo,
        role:  "USER",
        position: decoded.rol === "ADMIN" ? "Gerente" : "Empleado",
        profilePic: decoded.rol === "ADMIN"
          ? "/admin-profile.jpg"
          : "/user-profile.jpg",
      };

      login(simulatedUserData);

      setLoginMessage("¡Inicio de sesión exitoso! Redirigiendo...");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error: any) {
      setLoginMessage(
        `Error al iniciar sesión: ${
          error.message || "Credenciales inválidas."
        }`,
      );
      console.error("Error de login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => router.push("/");

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <Image
        src="/bg.png"
        alt="Background for login page"
        quality={100}
        fill
        style={{ objectFit: "cover", zIndex: -1 }}
      />
      <div className="absolute inset-0 bg-white opacity-40 backdrop-filter backdrop-blur-lg z-0">
      </div>

      <div className="relative z-10 flex flex-col items-center p-8 bg-white bg-opacity-90 rounded-lg shadow-xl max-w-md w-full">
        <h1 className="text-5xl font-bold text-yellow-500 mb-2 tracking-widest">
          CODERS
        </h1>
        <p className="text-xl text-gray-800 mb-8">
          Sistema de Gestión de Empleados
        </p>

        <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
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
                emailError ? "border-red-500" : ""
              }`}
              placeholder="Tu correo electrónico"
              required
            />
            {emailError && (
              <p className="text-red-500 text-xs italic mt-1">{emailError}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
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
                passwordError ? "border-red-500" : ""
              }`}
              placeholder="Tu contraseña"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-xs italic mt-1">
                {passwordError}
              </p>
            )}
          </div>

          {loginMessage && (
            <p
              className={`text-center text-sm ${
                loginMessage.includes("exitoso")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {loginMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </form>

        <button
          onClick={handleCancelClick}
          disabled={isLoading}
          className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={() => router.push("/register")}
          className="mt-4 text-blue-600 hover:underline"
        >
          ¿No tienes cuenta? Regístrate aquí
        </button>
      </div>

      <footer className="absolute bottom-4 z-10 text-gray-800 text-sm">
        © Created By.CODERS - 2025
      </footer>
    </div>
  );
}
