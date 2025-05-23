import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CitySearch from "../components/CitySearch";
import CityList from "../components/CityList";
import CityWeather from "../components/CityWeather";
import weatherService, { WeatherData } from "../services/weatherApi";
import { Header } from "../components/ui/header";
import { Button } from "../components/ui/button";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const ContentContainer = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftSidebar = styled.div`
  position: relative;
  padding-right: 30px;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 1px;
    background-color: rgba(255, 255, 255, 0.3);
  }

  @media (max-width: 768px) {
    padding-right: 0;
    padding-bottom: 20px;

    &::after {
      top: auto;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
    }
  }
`;

const MapButton = styled(Button)`
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MainContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: white;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  background-color: rgba(255, 100, 100, 0.2);
  border-radius: 10px;
  padding: 20px;
  color: white;
  text-align: center;
  margin: 20px 0;
`;

// Liste de villes par défaut
const DEFAULT_CITIES = [
  "Rennes",
  "Paris",
  "Strasbourg",
  "Marseille",
  "Lille",
  "Clermont-Ferrand",
];

interface CityPageProps {
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
  hideHeader?: boolean;
}

const CityPage: React.FC<CityPageProps> = ({
  onNavigate,
  hideHeader = false,
}) => {
  // État pour les villes sauvegardées
  const [savedCities, setSavedCities] = useState<string[]>(() => {
    const saved = localStorage.getItem("savedCities");
    return saved ? JSON.parse(saved) : DEFAULT_CITIES;
  });

  // État pour la ville sélectionnée
  const [selectedCity, setSelectedCity] = useState<string>(
    savedCities[0] || "Rennes"
  );

  // État pour les données météo
  const [weatherDataMap, setWeatherDataMap] = useState<{
    [city: string]: WeatherData;
  }>({});

  // États pour le chargement et les erreurs
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Ajout d'un état pour la page actuelle
  const [currentPage, setCurrentPage] = useState<
    "home" | "cities" | "profile" | "france-map"
  >("cities");

  // Sauvegarder les villes dans le localStorage quand elles changent
  useEffect(() => {
    localStorage.setItem("savedCities", JSON.stringify(savedCities));
  }, [savedCities]);

  // Charger les données météo pour toutes les villes sauvegardées
  useEffect(() => {
    const fetchAllCitiesData = async () => {
      setLoading(true);
      setError(null);

      try {
        const promises = savedCities.map((city) =>
          weatherService
            .getWeatherByCity(city)
            .then((data) => ({ city, data }))
            .catch((err) => {
              console.error(`Erreur pour ${city}:`, err);
              return { city, error: err };
            })
        );

        const results = await Promise.all(promises);

        const newWeatherMap: { [city: string]: WeatherData } = {};

        results.forEach((result) => {
          if ("data" in result) {
            newWeatherMap[result.city] = result.data;
          }
        });

        setWeatherDataMap(newWeatherMap);
      } catch (err) {
        console.error("Erreur lors du chargement des données météo:", err);
        setError(
          "Impossible de charger les données météo. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    if (savedCities.length > 0) {
      fetchAllCitiesData();
    } else {
      setLoading(false);
    }
  }, []);

  // Fonction pour gérer la sélection d'une ville
  const handleSelectCity = async (city: string) => {
    try {
      setLoading(true);

      // Vérifier si nous avons déjà les données pour cette ville
      if (!weatherDataMap[city]) {
        const weatherData = await weatherService.getWeatherByCity(city);
        setWeatherDataMap((prev) => ({
          ...prev,
          [city]: weatherData,
        }));
      }

      setSelectedCity(city);

      // Ajouter la ville aux sauvegardées si elle n'y est pas déjà
      if (!savedCities.includes(city)) {
        setSavedCities((prev) => [...prev, city]);
      }

      setError(null);
    } catch (err) {
      console.error(
        `Erreur lors de la récupération des données pour ${city}:`,
        err
      );
      setError(
        `Impossible de trouver les données météo pour "${city}". Veuillez vérifier l'orthographe ou essayer une autre ville.`
      );
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour gérer la suppression d'une ville
  const handleDeleteCity = (city: string) => {
    // Ne pas permettre de supprimer la ville sélectionnée
    if (city === selectedCity) {
      setError("Impossible de supprimer la ville actuellement sélectionnée");
      // Effacer le message d'erreur après 3 secondes
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Supprimer la ville de la liste
    setSavedCities((prev) => prev.filter((c) => c !== city));

    // Supprimer également les données météo associées
    setWeatherDataMap((prev) => {
      const newMap = { ...prev };
      delete newMap[city];
      return newMap;
    });
  };

  const handleNavigate = (
    page: "home" | "cities" | "profile" | "france-map"
  ) => {
    setCurrentPage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Rendu du contenu principal en fonction de l'état
  const renderMainContent = () => {
    if (loading && Object.keys(weatherDataMap).length === 0) {
      return (
        <LoadingContainer>Chargement des données météo...</LoadingContainer>
      );
    }

    if (error && Object.keys(weatherDataMap).length === 0) {
      return <ErrorContainer>{error}</ErrorContainer>;
    }

    const weatherData = weatherDataMap[selectedCity];

    if (!weatherData) {
      return (
        <LoadingContainer>Chargement des données météo...</LoadingContainer>
      );
    }

    return (
      <CityWeather
        city={selectedCity}
        temperature={weatherData.temperature}
        feelsLike={weatherData.feelsLike}
        humidity={weatherData.humidity}
        description={weatherData.description}
        icon={weatherData.icon}
        country={weatherData.country}
      />
    );
  };

  return (
    <PageContainer>
      {!hideHeader && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {error && <ErrorContainer>{error}</ErrorContainer>}

      <ContentContainer>
        <LeftSidebar>
          <CitySearch onSelectCity={handleSelectCity} />
          <CityList
            cities={savedCities}
            selectedCity={selectedCity}
            onSelectCity={handleSelectCity}
            onDeleteCity={handleDeleteCity}
            onNavigate={onNavigate}
          />
        </LeftSidebar>
        <MainContent>{renderMainContent()}</MainContent>
      </ContentContainer>
    </PageContainer>
  );
};

export default CityPage;
