import React, { useState, useEffect } from "react";
import styled from "styled-components";
import mqtt, { MqttClient, IPublishPacket } from "mqtt"; // Update MQTT import
import CityPage from "./pages/CityPage";
import Profile from "./pages/Profil";
import HomePage from "./pages/HomePage";
import FranceMapPage from "./pages/FranceMapPage";
import { WeatherData } from "./services/api";

const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Arial", sans-serif;
`;

function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "cities" | "profile" | "france-map"
  >("home");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);

  useEffect(() => {
    // Connexion au broker MQTT
    const client = mqtt.connect("ws://localhost:8889");

    client.on("connect", () => {
      console.log("✅ Connecté au broker MQTT");
      client.subscribe("meteo/temperature");
      client.subscribe("meteo/humidity");
    });

    client.on("message", (topic: string, message: Buffer) => {
      const payload = message.toString();
      console.log(`📩 MQTT Message reçu - ${topic}: ${payload}`);

      if (topic === "meteo/temperature") {
        setTemperature(parseFloat(payload));
      }
      if (topic === "meteo/humidity") {
        setHumidity(parseFloat(payload));
      }
    });

    return () => {
      client.end();
    };
  }, []);

  const navigateTo = (page: "home" | "cities" | "profile" | "france-map") => {
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
        <NavButton
          onClick={() => navigateTo("france-map")}
          active={currentPage === "france-map"}
        >
          Carte
        </NavButton>
      </Navigation>
    </Header>
  );

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigateTo} hideHeader={true} />;
      case "cities":
        return <CityPage onNavigate={navigateTo} hideHeader={true} />;
      case "profile":
        return <Profile onNavigate={navigateTo} hideHeader={true} />;
      case "france-map":
        return <FranceMapPage onNavigate={navigateTo} hideHeader={true} />;
      default:
        return <HomePage onNavigate={navigateTo} hideHeader={true} />;
    }
  };

  return (
    <AppContainer>
      {renderHeader()}
      {renderContent()}
    </AppContainer>
  );
}

// Styled Components (Header, Logo, Navigation, NavButton, MainContent)
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

export default App;
