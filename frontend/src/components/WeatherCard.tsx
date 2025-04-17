import React from "react";
import styled from "styled-components";

interface WeatherCardProps {
  city: string;
  temperature: number;
  humidity: number;
}

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  text-align: center;
`;

const CityName = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const Temperature = styled.div`
  font-size: 4rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WeatherIcon = styled.span`
  font-size: 3.5rem;
  margin-right: 10px;
`;

const HumidityInfo = styled.div`
  font-size: 1.2rem;
  color: #666;
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
}) => {
  return (
    <Card>
      <CityName>{city}</CityName>
      <Temperature>
        <WeatherIcon>{getWeatherIcon(temperature)}</WeatherIcon>
        {temperature}°C
      </Temperature>
      <HumidityInfo>Humidity: {humidity}%</HumidityInfo>
    </Card>
  );
};

export default WeatherCard;
