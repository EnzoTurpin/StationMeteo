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
import { HistoricalWeatherData } from "../services/weatherApi";

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

interface WeatherChartProps {
  data: HistoricalWeatherData[];
}

const ChartContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  height: 400px;
`;

const EmptyStateContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #666;
  flex-direction: column;
`;

const EmptyStateIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 15px;
  opacity: 0.7;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
`;

const WeatherChart: React.FC<WeatherChartProps> = ({ data }) => {
  // Format data for chart
  const formatData = () => {
    const labels = data.map((entry) => {
      const date = entry.date;
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    });

    return {
      labels,
      datasets: [
        {
          label: "Température (°C)",
          data: data.map((entry) => entry.temperature),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
        {
          label: "Humidité (%)",
          data: data.map((entry) => entry.humidity),
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6,
        },
      ],
    };
  };

  // Options du graphique
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#666",
          font: {
            size: 11,
          },
          // @ts-ignore - Ignorer les erreurs de type pour ce callback
          callback: function (value) {
            const numValue = Number(value);
            return `${value}${numValue < 100 ? "°C" : "%"}`;
          },
        },
      },
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: "#666",
          font: {
            size: 11,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#333",
          font: {
            size: 12,
          },
          boxWidth: 12,
          padding: 15,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "white",
        bodyColor: "white",
        padding: 10,
        displayColors: true,
        usePointStyle: true,
      },
    },
  };

  return (
    <ChartContainer>
      {data.length > 0 ? (
        <Line options={chartOptions} data={formatData()} />
      ) : (
        <EmptyStateContainer>
          <EmptyStateIcon>📊</EmptyStateIcon>
          <EmptyStateText>
            Aucune donnée disponible pour aujourd'hui
          </EmptyStateText>
        </EmptyStateContainer>
      )}
    </ChartContainer>
  );
};

export default WeatherChart;
