import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSensorHistory } from '@/hooks/useSensorData';
import { useChartColors, useTheme } from '@/hooks/useTheme';
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
  TimeScale,
  ChartOptions
} from 'chart.js';
import 'chart.js/auto';
import { format } from 'date-fns';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface HistoryChartProps {
  title?: string;
  dataType?: 'temperature' | 'humidity' | 'waterLevel' | 'nutrientLevel' | 'all';
}

const HistoryChart: React.FC<HistoryChartProps> = ({ 
  title = 'Temperature History', 
  dataType = 'temperature' 
}) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
  
  // Map period to hours
  const periodHours = {
    day: 24,
    week: 7 * 24,
    month: 30 * 24
  };
  
  const { chartData, loading } = useSensorHistory(periodHours[period]);
  const chartColors = useChartColors();

  // Prepare data for Chart.js
  const prepareChartData = () => {
    if (loading || !chartData.temperature.length) {
      return {
        labels: [],
        datasets: []
      };
    }

    const labels = chartData.temperature.map(d => 
      format(new Date(d.x), period === 'day' ? 'HH:mm' : 'MMM dd')
    );

    const datasets = [];
    
    if (dataType === 'temperature' || dataType === 'all') {
      datasets.push({
        label: 'Temperature (°C)',
        data: chartData.temperature.map(d => d.y),
        borderColor: chartColors[0],
        backgroundColor: chartColors[0],
        tension: 0.4,
        fill: false
      });
    }
    
    if (dataType === 'humidity' || dataType === 'all') {
      datasets.push({
        label: 'Humidity (%)',
        data: chartData.humidity.map(d => d.y),
        borderColor: chartColors[1],
        backgroundColor: chartColors[1],
        tension: 0.4,
        fill: false
      });
    }
    
    if (dataType === 'waterLevel' || dataType === 'all') {
      datasets.push({
        label: 'Water Level (%)',
        data: chartData.waterLevel.map(d => d.y),
        borderColor: chartColors[2],
        backgroundColor: chartColors[2],
        tension: 0.4,
        fill: false
      });
    }
    
    if (dataType === 'nutrientLevel' || dataType === 'all') {
      datasets.push({
        label: 'Nutrient Level (%)',
        data: chartData.nutrientLevel.map(d => d.y),
        borderColor: chartColors[3],
        backgroundColor: chartColors[3],
        tension: 0.4,
        fill: false
      });
    }

    return {
      labels,
      datasets
    };
  };

  // Use theme context to determine colors
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          // Adjust color based on theme
          color: isDarkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgb(107, 114, 128)'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: isDarkMode ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        titleColor: isDarkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgb(17, 24, 39)',
        bodyColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgb(55, 65, 81)',
        borderColor: isDarkMode ? 'rgba(71, 85, 105, 0.5)' : 'rgba(203, 213, 225, 0.5)',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(203, 213, 225, 0.3)'
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107, 114, 128)'
        }
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(148, 163, 184, 0.15)' : 'rgba(203, 213, 225, 0.3)'
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgb(107, 114, 128)'
        },
        beginAtZero: true
      }
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium text-gray-900 dark:text-white">
          {title}
        </CardTitle>
        <Select
          value={period}
          onValueChange={(value) => setPeriod(value as 'day' | 'week' | 'month')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500">Loading data...</p>
            </div>
          ) : chartData.temperature.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 dark:text-gray-500">No data available</p>
            </div>
          ) : (
            <Line data={prepareChartData()} options={chartOptions} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryChart;
