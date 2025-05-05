import React from "react";
import styled from "styled-components";

interface WeatherCardProps {
  city: string;
  temperature: number;
  humidity: number;
  customTitle?: string;
  customIcon?: string;
  customDescription?: string;
}

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
`;

const CityName = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
  color: #333;
`;

const Temperature = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  color: #333;
  margin: 15px 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherIcon = styled.span`
  font-size: 3rem;
  margin-right: 15px;
`;

const HumidityInfo = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HumidityIcon = styled.span`
  margin-right: 8px;
`;

const CardDetails = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #eee;
`;

const DetailItem = styled.div`
  text-align: center;
  flex: 1;
`;

const DetailLabel = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 5px;
  text-transform: uppercase;
`;

const DetailValue = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
`;

const getWeatherIcon = (temperature: number) => {
  if (temperature > 25) return "☀️"; // Hot
  if (temperature > 15) return "🌤️"; // Warm
  if (temperature > 5) return "☁️"; // Cool
  return "❄️"; // Cold
};

const WeatherCard: React.FC<WeatherCardProps> = ({
  city,
  temperature,
  humidity,
  customTitle,
  customIcon,
  customDescription,
}) => {
  // Obtenir l'heure locale
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const currentTime = `${hours}:${minutes}`;

  // Obtenir la date
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const currentDate = now.toLocaleDateString("fr-FR", options);

  return (
    <Card>
      <CityName>{customTitle || city}</CityName>

      <Temperature>
        <WeatherIcon>{customIcon || getWeatherIcon(temperature)}</WeatherIcon>
        {temperature}°C
      </Temperature>

      <HumidityInfo>
        {customDescription ? (
          customDescription
        ) : (
          <>
            <HumidityIcon>💧</HumidityIcon> {humidity}% d'humidité
          </>
        )}
      </HumidityInfo>

      <CardDetails>
        <DetailItem>
          <DetailLabel>DATE</DetailLabel>
          <DetailValue>{currentDate}</DetailValue>
        </DetailItem>
        <DetailItem>
          <DetailLabel>HEURE</DetailLabel>
          <DetailValue>{currentTime}</DetailValue>
        </DetailItem>
      </CardDetails>
    </Card>
  );
};

export default WeatherCard;
