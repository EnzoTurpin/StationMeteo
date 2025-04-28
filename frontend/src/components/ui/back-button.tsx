import React from "react";
import styled from "styled-components";

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const StyledBackButton = styled.button`
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  margin-bottom: 1.25rem;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Retour à l'accueil",
}) => {
  return (
    <StyledBackButton onClick={onClick}>
      <span>←</span> {label}
    </StyledBackButton>
  );
};
