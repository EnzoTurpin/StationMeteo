import React from "react";
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
} from "chart.js";
import { Line } from "react-chartjs-2";
import styled from "styled-components";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeatherData {
  temperature: number;
  humidity: number;
  timestamp: string;
}

interface WeatherChartProps {
  data: WeatherData[];
}

const ChartContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
`;

const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  // Format data for chart
  const formatData = () => {
    const labels = data.map((entry) => {
      const date = new Date(entry.timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    return {
      labels,
      datasets: [
        {
          label: "Temperature (°C)",
          data: data.map((entry) => entry.temperature),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.3,
        },
        {
          label: "Humidity (%)",
          data: data.map((entry) => entry.humidity),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.3,
        },
      ],
    };
  };

  // Forcer le type pour éviter les erreurs TypeScript
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          // @ts-ignore - Ignorer les erreurs de type pour ce callback
          callback: function (value) {
            const numValue = Number(value);
            return `${value}${numValue < 100 ? "°C" : "%"}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Temperature & Humidity",
      },
    },
  };

  return (
    <ChartContainer>
      {data.length > 0 ? (
        <Line options={chartOptions} data={formatData()} />
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <p>No data available</p>
        </div>
      )}
    </ChartContainer>
  );
};

export default WeatherChart;
