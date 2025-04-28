import React, { useState } from "react";
import styled from "styled-components";
import CityPage from "./pages/CityPage";
import Profile from "./pages/Profil";
import WeatherCard from "./components/WeatherCard";
import WeatherChart from "./components/WeatherChart";
import DailyForecast from "./components/DailyForecast";
import { WeatherData } from "./services/api";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "cities" | "profile">(
    "home"
  );
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [weatherHistory, setWeatherHistory] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);

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

  const navigateTo = (page: "home" | "cities" | "profile") => {
    setCurrentPage(page);
  };

  const renderHeader = () => (
    <Header>
      <Logo>Ynov Météo</Logo>
      <Navigation>
        <NavButton
          onClick={() => navigateTo("home")}
          active={currentPage === "home"}
        >
          Accueil
        </NavButton>
        <NavButton
          onClick={() => navigateTo("cities")}
          active={currentPage === "cities"}
        >
          Villes
        </NavButton>
        <NavButton
          onClick={() => navigateTo("profile")}
          active={currentPage === "profile"}
        >
          Profil
        </NavButton>
      </Navigation>
    </Header>
  );

  const renderHomePage = () => (
    <>
      <MainContent>
        <div>
          <WeatherCard
            city="Rennes"
            temperature={mockWeather.temperature}
            humidity={mockWeather.humidity}
          />
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
    </>
  );

  return (
    <AppContainer>
      {renderHeader()}
      {currentPage === "home" && renderHomePage()}
      {currentPage === "cities" && <CityPage />}
      {currentPage === "profile" && <Profile />}
    </AppContainer>
  );
}

// Styled Components
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

const NavButton = styled.button<{ active?: boolean }>`
  background: none;
  border: none;
  color: white;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};
  cursor: pointer;
  font-size: 1rem;

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

export default App;
