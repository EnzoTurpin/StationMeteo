// src/pages/Profile.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import { Header } from "../components/ui/header";

const PageContainer = styled.div`
  max-width: 850px;
  margin: 0 auto;
  padding: 30px;
`;

const ProfileCard = styled.div`
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.08),
    rgba(255, 255, 255, 0.03)
  );
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  padding: 40px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 25px;
  margin-top: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, #34c759, #30b7ff);
  border-radius: 50%;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3.5rem;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-weight: bold;
  border: 5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  transition: background 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
  }
`;

const UserDataDisplay = styled.div`
  font-size: 1.1rem;
  padding: 8px 0;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  flex-wrap: wrap;

  @media (max-width: 500px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  flex: 1;
  min-width: 120px;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background: linear-gradient(135deg, #5dbd61, #56b35a);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const LogoutButton = styled(Button)`
  background: linear-gradient(135deg, #f44336, #d32f2f);

  &:hover {
    background: linear-gradient(135deg, #f55a4e, #e33e32);
  }
`;

const CancelButton = styled(Button)`
  background: linear-gradient(135deg, #757575, #616161);

  &:hover {
    background: linear-gradient(135deg, #8a8a8a, #757575);
  }
`;

const Message = styled.div<{ isError?: boolean }>`
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  margin-top: 15px;
  background-color: ${(props) =>
    props.isError ? "rgba(244, 67, 54, 0.15)" : "rgba(76, 175, 80, 0.15)"};
  color: ${(props) => (props.isError ? "#ff6b6b" : "#4caf50")};
  border-left: 4px solid ${(props) => (props.isError ? "#ff6b6b" : "#4caf50")};
  font-weight: 500;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.3s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin: 40px auto;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 50px 0;
`;

interface ProfileProps {
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
  hideHeader?: boolean;
}

const Profile: React.FC<ProfileProps> = ({
  onNavigate,
  hideHeader = false,
}) => {
  const { user, loading, logout, updateProfile } = useAuth();
  const [currentPage, setCurrentPage] = useState<
    "home" | "cities" | "profile" | "france-map"
  >("profile");

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // Authentication view state
  const [authView, setAuthView] = useState<"login" | "register">("login");

  // Update form with user data when user changes
  React.useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    try {
      setMessage("");
      setIsError(false);

      await updateProfile({
        username,
        email,
        password: password ? password : undefined,
      });

      setPassword("");
      setIsEditMode(false);
      setMessage("Profil mis à jour avec succès !");
    } catch (err) {
      setIsError(true);
      setMessage(
        err instanceof Error
          ? err.message
          : "Erreur lors de la mise à jour du profil"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      setIsError(true);
      setMessage(
        err instanceof Error ? err.message : "Erreur lors de la déconnexion"
      );
    }
  };

  const navigateTo = (page: "home" | "cities" | "profile" | "france-map") => {
    setCurrentPage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  // Get first letter of username for avatar
  const getInitial = () => {
    return username ? username.charAt(0).toUpperCase() : "?";
  };

  // Render content based on authentication state
  const renderContent = () => {
    if (loading) {
      return (
        <LoadingContainer>
          <LoadingSpinner />
        </LoadingContainer>
      );
    }

    if (!user) {
      return authView === "login" ? (
        <LoginForm onSwitchToRegister={() => setAuthView("register")} />
      ) : (
        <RegisterForm onSwitchToLogin={() => setAuthView("login")} />
      );
    }

    return (
      <ProfileCard>
        <Avatar>{getInitial()}</Avatar>

        {!isEditMode ? (
          <>
            <ProfileSection>
              <Label>Nom d'utilisateur</Label>
              <UserDataDisplay>{username}</UserDataDisplay>
            </ProfileSection>

            <ProfileSection>
              <Label>Email</Label>
              <UserDataDisplay>{email}</UserDataDisplay>
            </ProfileSection>

            <ButtonsContainer>
              <Button onClick={() => setIsEditMode(true)}>
                Modifier le profil
              </Button>
              <LogoutButton onClick={handleLogout}>Se déconnecter</LogoutButton>
            </ButtonsContainer>
          </>
        ) : (
          <>
            <ProfileSection>
              <InputGroup>
                <Label>Nom d'utilisateur</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </InputGroup>
            </ProfileSection>

            <ProfileSection>
              <InputGroup>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </ProfileSection>

            <ProfileSection>
              <InputGroup>
                <Label>
                  Nouveau mot de passe (laisser vide pour ne pas changer)
                </Label>
                <Input
                  type="password"
                  value={password}
                  placeholder="Nouveau mot de passe"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </ProfileSection>

            <ButtonsContainer>
              <Button onClick={handleSave}>Enregistrer</Button>
              <CancelButton
                onClick={() => {
                  setIsEditMode(false);
                  setUsername(user.username);
                  setEmail(user.email);
                  setPassword("");
                }}
              >
                Annuler
              </CancelButton>
            </ButtonsContainer>
          </>
        )}

        {message && <Message isError={isError}>{message}</Message>}
      </ProfileCard>
    );
  };

  return (
    <PageContainer>
      {!hideHeader && (
        <Header currentPage={currentPage} onNavigate={navigateTo} />
      )}
      {renderContent()}
    </PageContainer>
  );
};

export default Profile;
