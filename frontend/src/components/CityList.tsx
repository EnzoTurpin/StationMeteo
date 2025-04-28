import React from "react";
import styled from "styled-components";
import { Button } from "../components/ui/button";

interface CityListProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
}

const ListContainer = styled.div`
  margin-top: 20px;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li<{ isSelected: boolean }>`
  padding: 10px 0;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: ${(props) => (props.isSelected ? "bold" : "normal")};
  text-decoration: ${(props) => (props.isSelected ? "underline" : "none")};

  &:hover {
    text-decoration: underline;
  }
`;

const MapButton = styled(Button)`
  margin: 20px 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CityList: React.FC<CityListProps> = ({
  cities,
  selectedCity,
  onSelectCity,
  onNavigate,
}) => {
  const handleMapButtonClick = () => {
    // Navigation vers la carte de France
    if (onNavigate) {
      onNavigate("france-map");
    }
  };

  return (
    <ListContainer>
      <List>
        {cities.map((city) => (
          <ListItem
            key={city}
            isSelected={city === selectedCity}
            onClick={() => onSelectCity(city)}
          >
            {city}
          </ListItem>
        ))}
      </List>
      <MapButton onClick={handleMapButtonClick}>
        <span>🗺️</span> Voir la carte de France
      </MapButton>
    </ListContainer>
  );
};

export default CityList;
