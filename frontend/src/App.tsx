import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import WeatherCard from "./components/WeatherCard";
import WeatherChart from "./components/WeatherChart";
import DailyForecast from "./components/DailyForecast";
import weatherApi, { WeatherData } from "./services/api";

// Socket.io connection
const socket = io(process.env.REACT_APP_API_URL || "http://localhost:3001");

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: white;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
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

function App() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample forecast data
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

  // Fetch latest weather data
  const fetchLatestWeather = async () => {
    try {
      const data = await weatherApi.getLatest();
      setCurrentWeather(data);
    } catch (error) {
      console.error("Error fetching latest weather:", error);
    }
  };

  // Fetch weather history for today
  const fetchTodayWeatherHistory = async () => {
    try {
      const data = await weatherApi.getToday();
      setWeatherHistory(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching weather history:", error);
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchLatestWeather();
    fetchTodayWeatherHistory();

    // Listen for real-time updates
    socket.on("newWeatherData", (data: WeatherData) => {
      setCurrentWeather(data);
      setWeatherHistory((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <AppContainer>
      <Header>
        <Logo>Ynov Météo</Logo>
        <Navigation>
          <NavLink href="#">Accueil</NavLink>
          <NavLink href="#">Villes</NavLink>
          <NavLink href="#">Profil</NavLink>
        </Navigation>
      </Header>

      <MainContent>
        <div>
          {currentWeather && (
            <WeatherCard
              city="Rennes"
              temperature={currentWeather.temperature}
              humidity={currentWeather.humidity}
            />
          )}
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
    </AppContainer>
  );
}

export default App;
