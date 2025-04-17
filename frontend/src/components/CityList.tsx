import React from "react";
import styled from "styled-components";

interface CityListProps {
  cities: string[];
  selectedCity: string;
  onSelectCity: (city: string) => void;
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

const MapLink = styled.div`
  margin-top: 30px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-style: italic;

  &:hover {
    text-decoration: underline;
  }
`;

const CityList: React.FC<CityListProps> = ({
  cities,
  selectedCity,
  onSelectCity,
}) => {
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
      <MapLink>Voir la carte de france</MapLink>
    </ListContainer>
  );
};

export default CityList;
