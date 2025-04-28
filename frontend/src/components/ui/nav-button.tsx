import React from "react";
import styled from "styled-components";

interface NavButtonProps {
  onClick: () => void;
  label: string;
  isActive?: boolean;
}

const StyledNavButton = styled.button<{ isActive?: boolean }>`
  background-color: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  padding: 0.5rem;
  cursor: pointer;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  transition: all 0.2s ease-in-out;
  position: relative;

  &:hover {
    text-decoration: underline;
  }

  ${(props) =>
    props.isActive &&
    `
    &:after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: rgba(79, 172, 254, 0.8);
    }
  `}
`;

export const NavButton: React.FC<NavButtonProps> = ({
  onClick,
  label,
  isActive = false,
}) => {
  return (
    <StyledNavButton onClick={onClick} isActive={isActive}>
      {label}
    </StyledNavButton>
  );
};
