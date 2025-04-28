import * as React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg";
  children: React.ReactNode;
}

const StyledButton = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  /* Size variants */
  padding: ${(props) =>
    props.size === "sm"
      ? "0.375rem 0.75rem"
      : props.size === "lg"
      ? "0.75rem 1.5rem"
      : "0.5rem 1rem"};
  font-size: ${(props) =>
    props.size === "sm"
      ? "0.875rem"
      : props.size === "lg"
      ? "1.125rem"
      : "1rem"};

  /* Variant styles */
  background-color: ${(props) =>
    props.variant === "outline" ||
    props.variant === "ghost" ||
    props.variant === "link"
      ? "transparent"
      : "rgba(79, 172, 254, 1)"};
  color: ${(props) =>
    props.variant === "outline" ||
    props.variant === "ghost" ||
    props.variant === "link"
      ? "white"
      : "white"};
  border: ${(props) =>
    props.variant === "outline" ? "1px solid white" : "none"};

  &:hover {
    background-color: ${(props) =>
      props.variant === "outline"
        ? "rgba(255, 255, 255, 0.1)"
        : props.variant === "ghost" || props.variant === "link"
        ? "rgba(255, 255, 255, 0.05)"
        : "rgba(79, 172, 254, 0.8)"};
    text-decoration: ${(props) =>
      props.variant === "link" ? "underline" : "none"};
  }

  &:focus {
    outline: 2px solid rgba(79, 172, 254, 0.5);
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <StyledButton
        className={className}
        ref={ref}
        variant={variant}
        size={size}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
