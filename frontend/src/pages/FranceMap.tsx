import React, { useState } from "react";
import styled from "styled-components";
import { Header } from "../components/ui/header";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const MapContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 30px;
  margin-top: 20px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
`;

const MapTitle = styled.h2`
  margin-bottom: 20px;
  color: white;
  font-size: 1.8rem;
`;

const MapImage = styled.div`
  width: 80%;
  max-width: 800px;
  aspect-ratio: 1 / 1;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  margin: 20px 0;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.6);
`;

interface FranceMapProps {
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
  hideHeader?: boolean;
}

const FranceMap: React.FC<FranceMapProps> = ({
  onNavigate,
  hideHeader = false,
}) => {
  const [currentPage, setCurrentPage] = useState<
    "home" | "cities" | "profile" | "france-map"
  >("france-map");

  const navigateTo = (page: "home" | "cities" | "profile" | "france-map") => {
    setCurrentPage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <PageContainer>
      {!hideHeader && (
        <Header currentPage={currentPage} onNavigate={navigateTo} />
      )}

      <MapContainer>
        <MapTitle>Carte météorologique de la France</MapTitle>
        <MapImage>Carte de France en cours de développement 🗺️</MapImage>
        <p>Cette fonctionnalité sera bientôt disponible.</p>
      </MapContainer>
    </PageContainer>
  );
};

export default FranceMap;
