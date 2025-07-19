// src/context/AuthContext.tsx
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Asegúrate de que 'User' esté EXPORTADA
export interface User {
  id: string; // <-- ¡Asegúrate de que esta línea esté presente!
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  position: string;
  profilePic?: string;
  idCreationDate?: string; // Opcional, si lo usas
}

// ... (el resto de tu AuthContext.tsx)

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Intentar cargar el usuario desde localStorage al inicio
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Guardar en localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Limpiar de localStorage
  };

  return (
    <AuthContext.Provider value={{ user,token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};