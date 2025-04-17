import React from "react";
import styled from "styled-components";

interface ForecastDay {
  day: string;
  icon: string;
  temperature: number;
  conditions: string;
}

interface DailyForecastProps {
  forecast: ForecastDay[];
}

const ForecastContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  overflow-x: auto;
  padding-bottom: 10px;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const ForecastItem = styled.div`
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 15px;
  min-width: 100px;
  text-align: center;
  margin-right: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:last-child {
    margin-right: 0;
  }
`;

const DayName = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const WeatherIcon = styled.div`
  font-size: 2rem;
  margin: 5px 0;
`;

const Temperature = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const Conditions = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const DailyForecast: React.FC<DailyForecastProps> = ({ forecast }) => {
  return (
    <ForecastContainer>
      {forecast.map((day, index) => (
        <ForecastItem key={index}>
          <DayName>{day.day}</DayName>
          <WeatherIcon>{day.icon}</WeatherIcon>
          <Temperature>{day.temperature}°C</Temperature>
          <Conditions>{day.conditions}</Conditions>
        </ForecastItem>
      ))}
    </ForecastContainer>
  );
};

export default DailyForecast;
