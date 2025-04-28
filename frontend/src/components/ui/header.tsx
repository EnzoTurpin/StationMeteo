import React from "react";
import styled from "styled-components";
import { NavButton } from "./nav-button";

interface HeaderProps {
  currentPage: "home" | "cities" | "profile" | "france-map";
  onNavigate: (page: "home" | "cities" | "profile" | "france-map") => void;
}

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  color: white;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 1.25rem;
`;

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  return (
    <HeaderContainer>
      <Logo>Ynov Météo</Logo>
      <Navigation>
        <NavButton
          onClick={() => onNavigate("home")}
          label="Accueil"
          isActive={currentPage === "home"}
        />
        <NavButton
          onClick={() => onNavigate("cities")}
          label="Villes"
          isActive={currentPage === "cities"}
        />
        <NavButton
          onClick={() => onNavigate("profile")}
          label="Profil"
          isActive={currentPage === "profile"}
        />
      </Navigation>
    </HeaderContainer>
  );
};
