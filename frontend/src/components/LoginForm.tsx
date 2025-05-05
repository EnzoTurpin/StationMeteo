import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";

const FormContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 30px;
  color: white;
  max-width: 400px;
  margin: 0 auto;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.label`
  font-weight: bold;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 5px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SubmitButton = styled.button`
  margin-top: 10px;
  padding: 12px;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-top: 10px;
  text-align: center;
`;

const SwitchLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #bbbbbb;

  span {
    color: #4caf50;
    cursor: pointer;
    margin-left: 5px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SmallText = styled.small`
  color: #aaa;
  font-size: 0.8rem;
  margin-top: 2px;
`;

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { login, loading } = useAuth();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!email || !password) {
      setFormError("Tous les champs sont requis");
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setFormError("Format d'email invalide");
      return;
    }

    try {
      await login(email, password);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Échec de la connexion"
      );
    }
  };

  return (
    <FormContainer>
      <Title>Connexion</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </InputGroup>

        <InputGroup>
          <Label>Mot de passe</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </InputGroup>

        {formError && <ErrorMessage>{formError}</ErrorMessage>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Connexion..." : "Se connecter"}
        </SubmitButton>
      </Form>

      <SwitchLink>
        Pas encore de compte ?
        <span onClick={onSwitchToRegister}>S'inscrire</span>
      </SwitchLink>
    </FormContainer>
  );
};

export default LoginForm;
