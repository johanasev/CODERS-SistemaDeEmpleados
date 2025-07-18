// src/context/AuthContext.tsx
'use client'; // Necesario para useContext y useState

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Definir el tipo para el usuario (puedes expandirlo con más propiedades si lo necesitas)
interface User {
  name: string;
  email: string;
  role: 'ADMIN' | 'USER'; // Roles específicos
  position?: string; // Opcional
  profilePic?: string; // Opcional
}

// Definir el tipo para el contexto (lo que proveerá)
interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

// Crear el contexto con valores por defecto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Componente Proveedor del Contexto
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Opcional: Cargar usuario desde localStorage al iniciar la aplicación
  useEffect(() => {
    if (typeof window !== 'undefined') { // Asegurarse de que estamos en el lado del cliente
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse user from localStorage", e);
          localStorage.removeItem('currentUser'); // Limpiar si está corrupto
        }
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(userData)); // Guardar en localStorage
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser'); // Eliminar de localStorage
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}