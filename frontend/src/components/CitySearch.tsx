import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import weatherService, { CityData } from "../services/weatherApi";

interface CitySearchProps {
  onSelectCity: (city: string) => void;
}

const SearchContainer = styled.div`
  margin-bottom: 20px;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 40px;
  border-radius: 30px;
  border: none;
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
  font-size: 14px;
  outline: none;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
`;

const SearchIcon = styled.span`
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 16px;
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 5px;
  padding: 0;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  list-style: none;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
`;

const SuggestionItem = styled.li`
  padding: 10px 15px;
  cursor: pointer;
  color: #333;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &:first-child {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  &:last-child {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
`;

const CountryCode = styled.span`
  color: #777;
  font-size: 12px;
  margin-left: 5px;
`;

const LoadingIndicator = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  font-size: 12px;
`;

const CitySearch: React.FC<CitySearchProps> = ({ onSelectCity }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Ajouter un écouteur pour fermer les suggestions quand on clique ailleurs
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Recherche de suggestions avec debounce
    if (searchTerm.trim().length >= 2) {
      setLoading(true);

      // Nettoyer le timeout précédent
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }

      searchTimeout.current = setTimeout(async () => {
        try {
          const cities = await weatherService.searchCities(searchTerm);
          setSuggestions(cities);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Erreur lors de la recherche:", error);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 500); // Délai de 500ms pour éviter trop de requêtes
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      onSelectCity(searchTerm.trim());
      setSearchTerm("");
      setShowSuggestions(false);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (cityName: string) => {
    onSelectCity(cityName);
    setSearchTerm("");
    setShowSuggestions(false);
  };

  return (
    <SearchContainer ref={containerRef}>
      <SearchWrapper>
        <SearchIcon>🔍</SearchIcon>
        <SearchInput
          type="text"
          placeholder="Rechercher une ville"
          value={searchTerm}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            searchTerm.length >= 2 &&
            setSuggestions.length > 0 &&
            setShowSuggestions(true)
          }
        />
        {loading && <LoadingIndicator>Chargement...</LoadingIndicator>}
      </SearchWrapper>

      {showSuggestions && suggestions.length > 0 && (
        <SuggestionsList>
          {suggestions.map((city, index) => (
            <SuggestionItem
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => handleSuggestionClick(city.name)}
            >
              {city.name} <CountryCode>({city.country})</CountryCode>
            </SuggestionItem>
          ))}
        </SuggestionsList>
      )}
    </SearchContainer>
  );
};

export default CitySearch;
