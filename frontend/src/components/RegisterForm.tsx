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

const PasswordRequirements = styled.div`
  margin-top: 5px;
  font-size: 0.8rem;
  color: #aaa;
`;

const RequirementItem = styled.div<{ fulfilled: boolean }>`
  color: ${(props) => (props.fulfilled ? "#4caf50" : "#aaa")};
  margin: 2px 0;
`;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { register, loading } = useAuth();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateUsername = (username: string) => {
    // Username should be 3-20 characters and contain only letters, numbers, and underscores
    const re = /^[a-zA-Z0-9_]{3,20}$/;
    return re.test(username);
  };

  const validatePassword = (password: string) => {
    // Check minimum length
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caractères";
    }

    // Check for uppercase letter
    if (!/[A-Z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une lettre majuscule";
    }

    // Check for lowercase letter
    if (!/[a-z]/.test(password)) {
      return "Le mot de passe doit contenir au moins une lettre minuscule";
    }

    // Check for number
    if (!/[0-9]/.test(password)) {
      return "Le mot de passe doit contenir au moins un chiffre";
    }

    // Check for special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Le mot de passe doit contenir au moins un caractère spécial";
    }

    return null; // Password is valid
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setFormError("Tous les champs sont requis");
      return;
    }

    // Username validation
    if (!validateUsername(username)) {
      setFormError(
        "Le nom d'utilisateur doit contenir entre 3 et 20 caractères et ne peut contenir que des lettres, chiffres et underscores"
      );
      return;
    }

    // Email validation
    if (!validateEmail(email)) {
      setFormError("Format d'email invalide");
      return;
    }

    // Password validation
    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      await register(username, email, password);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Échec de l'inscription"
      );
    }
  };

  return (
    <FormContainer>
      <Title>Inscription</Title>
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <Label>Nom d'utilisateur</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="votre_nom_d'utilisateur"
          />
          <small>
            Entre 3 et 20 caractères (lettres, chiffres, et underscore
            uniquement)
          </small>
        </InputGroup>

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
          <PasswordRequirements>
            <RequirementItem fulfilled={password.length >= 8}>
              ✓ Au moins 8 caractères
            </RequirementItem>
            <RequirementItem fulfilled={/[A-Z]/.test(password)}>
              ✓ Au moins une majuscule
            </RequirementItem>
            <RequirementItem fulfilled={/[a-z]/.test(password)}>
              ✓ Au moins une minuscule
            </RequirementItem>
            <RequirementItem fulfilled={/[0-9]/.test(password)}>
              ✓ Au moins un chiffre
            </RequirementItem>
            <RequirementItem
              fulfilled={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
            >
              ✓ Au moins un caractère spécial
              (!@#$%^&amp;*(),.?":&#123;&#125;|&lt;&gt;)
            </RequirementItem>
          </PasswordRequirements>
        </InputGroup>

        <InputGroup>
          <Label>Confirmer le mot de passe</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="********"
          />
        </InputGroup>

        {formError && <ErrorMessage>{formError}</ErrorMessage>}

        <SubmitButton type="submit" disabled={loading}>
          {loading ? "Inscription..." : "S'inscrire"}
        </SubmitButton>
      </Form>

      <SwitchLink>
        Déjà un compte ?<span onClick={onSwitchToLogin}>Se connecter</span>
      </SwitchLink>
    </FormContainer>
  );
};

export default RegisterForm;
