// src/components/TransactionsChart.tsx
'use client'; // Marcar como componente de cliente

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// ¡MUY IMPORTANTE!: Registrar los componentes necesarios de Chart.js
// Esto permite que Chart.js funcione correctamente con los tipos de gráficos que usarás.
ChartJS.register(
  CategoryScale,    // Para el eje X (categorías)
  LinearScale,      // Para el eje Y (valores numéricos)
  BarElement,       // Para los gráficos de barras
  Title,            // Para el título del gráfico
  Tooltip,          // Para la información que aparece al pasar el ratón
  Legend            // Para la leyenda del gráfico
);

// Interfaz para la estructura de los datos que espera el gráfico
interface ChartData {
  labels: string[]; // Etiquetas para el eje X (ej. 'Ingresos', 'Egresos')
  datasets: {
    label: string;      // Etiqueta para el conjunto de datos (ej. 'Monto Total')
    data: number[];     // Los valores numéricos para las barras
    backgroundColor: string[]; // Colores de fondo de las barras
    borderColor: string[];   // Colores del borde de las barras
    borderWidth: number; // Ancho del borde
  }[];
}

interface TransactionsChartProps {
  data: ChartData; // Propiedad que recibirá los datos ya preparados para el gráfico
}

const TransactionsChart: React.FC<TransactionsChartProps> = ({ data }) => {
  // Opciones de configuración para el gráfico (título, leyendas, etc.)
  const options = {
    responsive: true, // El gráfico se adaptará al tamaño de su contenedor
    plugins: {
      legend: {
        position: 'top' as const, // Posición de la leyenda
      },
      title: {
        display: true, // Mostrar título
        text: 'Resumen de Movimientos (Ingresos vs. Egresos)', // Texto del título
      },
    },
  };

  // Renderiza el componente Bar de react-chartjs-2
  return <Bar options={options} data={data} />;
};

export default TransactionsChart;