import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WeatherCard from "../components/WeatherCard";
import WeatherChart from "../components/WeatherChart";
import DailyForecast from "../components/DailyForecast";
import { WeatherData } from "../services/weatherApi";
import { Header } from "../components/ui/header";
import { Button } from "../components/ui/button";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

const MainContent = styled.main`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MapButton = styled(Button)`
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HomePage: React.FC<{
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
}> = ({ onNavigate }) => {
  const [currentPage, setCurrentPage] = useState<
    "home" | "cities" | "profile" | "france-map"
  >("home");
  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  // Données d'exemple pour la page d'accueil
  const mockWeather = {
    temperature: 24,
    humidity: 20,
  };

  const forecastData = [
    { day: "Mercredi", icon: "☁️", temperature: 6, conditions: "Nuageux" },
    {
      day: "Jeudi",
      icon: "⛅",
      temperature: 8,
      conditions: "Partiellement nuageux",
    },
    { day: "Vendredi", icon: "☁️", temperature: 7, conditions: "Nuageux" },
    { day: "Samedi", icon: "☀️", temperature: 6, conditions: "Ensoleillé" },
    { day: "Dimanche", icon: "☁️", temperature: 9, conditions: "Nuageux" },
    { day: "Lundi", icon: "☀️", temperature: 10, conditions: "Ensoleillé" },
  ];

  const navigateTo = (page: "home" | "cities" | "profile" | "france-map") => {
    setCurrentPage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleMapButtonClick = () => {
    // Navigation vers la carte de France
    if (onNavigate) {
      onNavigate("france-map");
    }
  };

  return (
    <PageContainer>
      <Header currentPage={currentPage} onNavigate={navigateTo} />

      <MainContent>
        <div>
          <WeatherCard
            city="Rennes"
            temperature={mockWeather.temperature}
            humidity={mockWeather.humidity}
          />

          <MapButton onClick={handleMapButtonClick}>
            <span>🗺️</span> Voir la carte de France
          </MapButton>
        </div>
        <div>
          {loading ? (
            <div>Loading chart data...</div>
          ) : (
            <WeatherChart data={weatherHistory} />
          )}
        </div>
      </MainContent>

      <DailyForecast forecast={forecastData} />
    </PageContainer>
  );
};

export default HomePage;
