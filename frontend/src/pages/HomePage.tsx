import React, { useState, useEffect } from "react";
import styled from "styled-components";
import WeatherCard from "../components/WeatherCard";
import WeatherChart from "../components/WeatherChart";
import DailyForecast from "../components/DailyForecast";
import weatherService, {
  WeatherData,
  HistoricalWeatherData,
  ForecastDay,
} from "../services/weatherApi";
import { Header } from "../components/ui/header";

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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #333;
  font-size: 1.2rem;
`;

const ErrorContainer = styled.div`
  background-color: rgba(255, 100, 100, 0.2);
  border-radius: 10px;
  padding: 20px;
  color: #333;
  text-align: center;
  margin: 20px 0;
`;

const ChartTitle = styled.h2`
  color: #333;
  margin-bottom: 15px;
  font-size: 1.3rem;
`;

const SelectedDayCard = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const SelectedDayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const DayTitle = styled.h2`
  color: #333;
  margin: 0;
  text-transform: capitalize;
  font-size: 1.5rem;
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const DetailLabel = styled.span`
  color: #666;
  margin-right: 10px;
  font-size: 0.9rem;
`;

const DetailValue = styled.span`
  color: #333;
  font-weight: bold;
  font-size: 1.1rem;
`;

const ForecastIcon = styled.div`
  font-size: 3rem;
  margin-left: 15px;
`;

const BackButton = styled.button`
  padding: 8px 16px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 15px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e0e0e0;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 100, 255, 0.3);
  }
`;

const ButtonIcon = styled.span`
  margin-right: 8px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 20px;
  background-color: rgba(240, 240, 240, 0.8);
  border-radius: 8px;
  color: #666;
`;

const HomePage: React.FC<{
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
  hideHeader?: boolean;
}> = ({ onNavigate, hideHeader }) => {
  const [currentPage, setCurrentPage] = useState<
    "home" | "cities" | "profile" | "france-map"
  >("home");
  const [weatherHistory, setWeatherHistory] = useState<HistoricalWeatherData[]>(
    []
  );
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<ForecastDay | null>(null);

  // Charger les données météo réelles au chargement de la page
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Ville par défaut
        const cityName = "Rennes";

        // Récupérer les données météo actuelles
        const weatherData = await weatherService.getWeatherByCity(cityName);
        setCurrentWeather(weatherData);

        // Récupérer les prévisions
        const forecastData = await weatherService.getForecast(cityName);
        setForecast(forecastData);

        // Récupérer l'historique météo
        const historyData = await weatherService.getHistoricalWeather(cityName);

        // Filtrer pour n'avoir que les données du jour actuel
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Début de la journée actuelle

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Début de la journée suivante

        const todayData = historyData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= today && itemDate < tomorrow;
        });

        setWeatherHistory(todayData);
      } catch (err) {
        console.error("Erreur lors du chargement des données météo:", err);
        setError(
          "Impossible de charger les données météo. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigateTo = (page: "home" | "cities" | "profile" | "france-map") => {
    setCurrentPage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleSelectDay = (day: ForecastDay) => {
    // Si on clique sur le jour déjà sélectionné, on le désélectionne
    if (selectedDay && selectedDay.day === day.day) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  };

  // Générer des données horaires fictives pour le jour sélectionné
  const generateHourlyDataForSelectedDay = (
    day: ForecastDay
  ): HistoricalWeatherData[] => {
    const date = day.date;
    const data: HistoricalWeatherData[] = [];

    // Générer des données pour chaque heure de la journée (de 0h à 23h)
    for (let hour = 0; hour < 24; hour += 2) {
      const hourDate = new Date(date);
      hourDate.setHours(hour, 0, 0, 0);

      // Varier la température légèrement autour de la valeur de base
      const hourTemp = day.temperature + Math.sin(hour / 3) * 3;

      // Varier l'humidité entre 40% et 70%
      const hourHumidity = 55 + Math.cos(hour / 3) * 15;

      data.push({
        date: hourDate,
        temperature: Math.round(hourTemp),
        humidity: Math.round(hourHumidity),
      });
    }

    return data;
  };

  // Rendu du contenu principal en fonction de l'état
  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer>Chargement des données météo...</LoadingContainer>
      );
    }

    if (error) {
      return <ErrorContainer>{error}</ErrorContainer>;
    }

    // Générer des données horaires si un jour futur est sélectionné
    const chartData = selectedDay
      ? generateHourlyDataForSelectedDay(selectedDay)
      : weatherHistory;

    return (
      <>
        {selectedDay && (
          <BackButton onClick={() => setSelectedDay(null)}>
            <ButtonIcon>←</ButtonIcon> Retour à aujourd'hui
          </BackButton>
        )}

        <MainContent>
          <div>
            <WeatherCard
              city={currentWeather?.city || ""}
              temperature={
                selectedDay
                  ? selectedDay.temperature
                  : currentWeather?.temperature || 0
              }
              humidity={selectedDay ? 50 : currentWeather?.humidity || 0}
              customTitle={selectedDay ? selectedDay.day : undefined}
              customIcon={selectedDay ? selectedDay.icon : undefined}
              customDescription={
                selectedDay ? selectedDay.conditions : undefined
              }
            />
          </div>
          <div>
            <ChartTitle>
              {selectedDay
                ? `Simulation température et humidité (${selectedDay.day})`
                : "Évolution température et humidité (aujourd'hui)"}
            </ChartTitle>
            <WeatherChart data={chartData} />
          </div>
        </MainContent>

        <DailyForecast
          forecast={forecast}
          onSelectDay={handleSelectDay}
          selectedDay={selectedDay}
        />
      </>
    );
  };

  return (
    <PageContainer>
      {!hideHeader && (
        <Header currentPage={currentPage} onNavigate={navigateTo} />
      )}

      {renderContent()}
    </PageContainer>
  );
};

export default HomePage;
