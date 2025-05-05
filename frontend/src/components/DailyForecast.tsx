import React from "react";
import styled from "styled-components";
import { ForecastDay } from "../services/weatherApi";

interface DailyForecastProps {
  forecast: ForecastDay[];
  onSelectDay: (day: ForecastDay) => void;
  selectedDay?: ForecastDay | null;
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

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const ForecastItem = styled.div<{ isSelected?: boolean }>`
  background-color: ${(props) =>
    props.isSelected
      ? "rgba(230, 247, 255, 0.95)"
      : "rgba(255, 255, 255, 0.9)"};
  border-radius: 10px;
  padding: 15px;
  width: calc(16.666% - 10px);
  min-width: 140px;
  height: 180px;
  text-align: center;
  margin-right: 12px;
  box-shadow: ${(props) =>
    props.isSelected
      ? "0 5px 15px rgba(0, 120, 255, 0.15)"
      : "0 2px 4px rgba(0, 0, 0, 0.1)"};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  border: ${(props) =>
    props.isSelected ? "2px solid #4facfe" : "2px solid transparent"};

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  &:last-child {
    margin-right: 0;
  }
`;

const DayName = styled.div`
  font-weight: bold;
  margin-bottom: 5px;
  color: #333;
  text-transform: capitalize;
  font-size: 1.1rem;
`;

const WeatherIcon = styled.div`
  font-size: 2rem;
  margin: 5px 0;
`;

const Temperature = styled.div`
  font-size: 1.4rem;
  font-weight: bold;
  margin: 5px 0;
  color: #333;
`;

const Conditions = styled.div`
  font-size: 0.85rem;
  color: #666;
  margin-top: 5px;
  height: 32px; /* Hauteur fixe pour les conditions */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h2`
  color: #333;
  margin-top: 30px;
  margin-bottom: 15px;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
`;

const TipText = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin-left: 15px;
  font-weight: normal;
`;

const DailyForecast: React.FC<DailyForecastProps> = ({
  forecast,
  onSelectDay,
  selectedDay,
}) => {
  return (
    <>
      <Title>
        Prévisions sur 6 jours
        <TipText>Cliquez sur un jour pour voir ses détails</TipText>
      </Title>
      <ForecastContainer>
        {forecast.map((day, index) => (
          <ForecastItem
            key={index}
            onClick={() => onSelectDay(day)}
            isSelected={selectedDay?.day === day.day}
          >
            <DayName>{day.day}</DayName>
            <WeatherIcon>{day.icon}</WeatherIcon>
            <Temperature>{day.temperature}°C</Temperature>
            <Conditions>{day.conditions}</Conditions>
          </ForecastItem>
        ))}
      </ForecastContainer>
    </>
  );
};

export default DailyForecast;
