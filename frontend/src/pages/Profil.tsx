// src/pages/Profile.tsx
import React, { useState } from "react";
import styled from "styled-components";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  color: white;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const Navigation = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.a<{ active?: boolean }>`
  color: white;
  text-decoration: none;
  font-weight: ${(props) => (props.active ? "bold" : "normal")};

  &:hover {
    text-decoration: underline;
  }
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 30px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  background-color: #ccc;
  border-radius: 50%;
  margin: 0 auto 20px;
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
  padding: 8px;
  border-radius: 5px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: white;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.3);
  }
`;

const SaveButton = styled.button`
  margin-top: 20px;
  padding: 10px;
  background-color: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const Profile: React.FC = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [password, setPassword] = useState("");

  const handleSave = () => {
    alert("Informations enregistrées !");
    // ici tu pourras ajouter des requêtes pour envoyer au serveur plus tard
  };

  return (
    <PageContainer>
      <ProfileCard>
        <Avatar />
        <InputGroup>
          <Label>Nom</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </InputGroup>

        <InputGroup>
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </InputGroup>

        <InputGroup>
          <Label>Mot de passe</Label>
          <Input
            type="password"
            value={password}
            placeholder="Nouveau mot de passe"
            onChange={(e) => setPassword(e.target.value)}
          />
        </InputGroup>

        <SaveButton onClick={handleSave}>Enregistrer</SaveButton>
      </ProfileCard>
    </PageContainer>
  );
};

export default Profile;
