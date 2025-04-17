import React from "react";
import styled from "styled-components";

interface CityWeatherProps {
  city: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description?: string;
  icon?: string;
  country?: string;
}

const WeatherContainer = styled.div`
  padding: 30px;
  color: white;
  text-align: center;
  width: 100%;
  max-width: 500px;
`;

const CityName = styled.h1`
  font-size: 4rem;
  margin-bottom: 10px;
`;

const CountryName = styled.div`
  font-size: 1.2rem;
  margin-bottom: 20px;
  opacity: 0.8;
`;

const Temperature = styled.div`
  font-size: 6rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const WeatherIcon = styled.div`
  margin-right: 20px;
  img {
    width: 100px;
    height: 100px;
  }
`;

const WeatherDescription = styled.div`
  font-size: 1.8rem;
  margin-bottom: 20px;
  text-transform: capitalize;
`;

const AdditionalInfo = styled.div`
  font-size: 1.5rem;
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoValue = styled.div`
  font-weight: bold;
`;

const InfoLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const CityWeather: React.FC<CityWeatherProps> = ({
  city,
  temperature,
  feelsLike,
  humidity,
  description = "",
  icon = "",
  country = "",
}) => {
  // Obtenir l'URL de l'icône météo d'OpenWeatherMap
  const getIconUrl = (iconCode: string) => {
    return iconCode
      ? `http://openweathermap.org/img/wn/${iconCode}@2x.png`
      : "";
  };

  return (
    <WeatherContainer>
      <CityName>{city}</CityName>
      {country && <CountryName>{country}</CountryName>}

      <Temperature>
        <WeatherIcon>
          {icon ? (
            <img src={getIconUrl(icon)} alt={description || "weather"} />
          ) : (
            getDefaultWeatherEmoji(temperature)
          )}
        </WeatherIcon>
        {temperature}°C
      </Temperature>

      {description && <WeatherDescription>{description}</WeatherDescription>}

      <AdditionalInfo>
        <InfoItem>
          <InfoValue>{feelsLike}°</InfoValue>
          <InfoLabel>Ressenti</InfoLabel>
        </InfoItem>
        <InfoItem>
          <InfoValue>{humidity}%</InfoValue>
          <InfoLabel>Humidité</InfoLabel>
        </InfoItem>
      </AdditionalInfo>
    </WeatherContainer>
  );
};

// Emoji de secours si l'icône de l'API n'est pas disponible
const getDefaultWeatherEmoji = (temperature: number) => {
  if (temperature > 25) return "☀️"; // Hot
  if (temperature > 15) return "🌤️"; // Warm
  if (temperature > 5) return "☁️"; // Cool
  return "❄️"; // Cold
};

export default CityWeather;
