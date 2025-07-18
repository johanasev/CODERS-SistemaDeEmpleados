// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
// import Sidebar from '../components/Sidebar'; // Ya no se importa aquí directamente
import { AuthProvider } from '../context/AuthContext'; // Importa AuthProvider
import AppContent from '../components/AppContent'; // <-- NUEVO: Importa AppContent

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CODERS - Sistema de Gestión de Empleados',
  description: 'Aplicación para la gestión de recursos humanos y empleados.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider> {/* Envuelve toda la aplicación con el AuthProvider */}
          <AppContent>{children}</AppContent> {/* Usa el componente AppContent */}
        </AuthProvider>
      </body>
    </html>
  )
}

// Ya no necesitas la función AppContent aquí, la hemos movido a un archivo separado