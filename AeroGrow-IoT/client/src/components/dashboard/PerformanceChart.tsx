import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { SensorData } from '@shared/schema';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface PerformanceChartProps {
  data: SensorData[];
  className?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, className }) => {
  const isDark = document.documentElement.classList.contains('dark');
  
  const chartData = {
    labels: data.map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: data.map(d => parseFloat(d.temperature)),
        borderColor: isDark ? '#ffffff' : 'rgb(16, 185, 129)',
        backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(16, 185, 129, 0.1)',
        borderWidth: isDark ? 3 : 2,
        tension: 0.4,
      },
      {
        label: 'Humidity (%)',
        data: data.map(d => parseFloat(d.humidity)),
        borderColor: isDark ? '#e5e7eb' : 'rgb(59, 130, 246)',
        backgroundColor: isDark ? 'rgba(229, 231, 235, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        borderWidth: isDark ? 3 : 2,
        tension: 0.4,
      },
      {
        label: 'Water Level (%)',
        data: data.map(d => parseFloat(d.waterLevel)),
        borderColor: isDark ? '#d1d5db' : 'rgb(245, 158, 11)',
        backgroundColor: isDark ? 'rgba(209, 213, 219, 0.1)' : 'rgba(245, 158, 11, 0.1)',
        borderWidth: isDark ? 3 : 2,
        tension: 0.4,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#ffffff' : '#374151',
          usePointStyle: true,
          padding: 20,
        }
      },
      tooltip: {
        backgroundColor: isDark ? 'rgba(0, 0, 0, 0.9)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#fff' : '#000',
        bodyColor: isDark ? '#fff' : '#000',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
        }
      },
    },
  };

  return (
    <div className={`h-80 ${className}`}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default PerformanceChart;