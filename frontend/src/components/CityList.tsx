import React from "react";
import styled from "styled-components";
import { Button } from "../components/ui/button";

interface CityListProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
  onDeleteCity?: (city: string) => void;
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
}

const ListContainer = styled.div`
  margin-top: 20px;
  height: 300px;
  overflow-y: auto;
  padding-right: 10px;

  /* Styliser la barre de défilement */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }
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
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    text-decoration: underline;
  }
`;

const CityName = styled.span`
  flex-grow: 1;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4d4d;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.7;
  padding: 5px;
  margin-left: 10px;
  transition: opacity 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }

  &:focus {
    outline: none;
  }
`;

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#ff4d4d"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </svg>
);

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
  onDeleteCity,
  onNavigate,
}) => {
  const handleMapButtonClick = () => {
    // Navigation vers la carte de France
    if (onNavigate) {
      onNavigate("france-map");
    }
  };

  const handleDeleteCity = (
    city: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation(); // Empêcher la sélection de la ville
    if (onDeleteCity) {
      onDeleteCity(city);
    }
  };

  return (
    <>
      <ListContainer>
        <List>
          {cities.map((city) => (
            <ListItem
              key={city}
              isSelected={city === selectedCity}
              onClick={() => onSelectCity(city)}
            >
              <CityName>{city}</CityName>
              {onDeleteCity && (
                <DeleteButton
                  onClick={(e) => handleDeleteCity(city, e)}
                  aria-label={`Supprimer ${city}`}
                >
                  <TrashIcon />
                </DeleteButton>
              )}
            </ListItem>
          ))}
        </List>
      </ListContainer>
      <MapButton onClick={handleMapButtonClick}>
        <span>🗺️</span> Voir la carte de France
      </MapButton>
    </>
  );
};

export default CityList;
