import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MqttDeviceStatus from "../components/MqttDeviceStatus";
import { Card } from "../components/ui/card";

const PageContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 30px;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.1rem;
`;

const DevicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const AddDeviceCard = styled(Card)`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  min-height: 200px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  }
`;

const AddDeviceIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 10px;
`;

const AddDeviceText = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
`;

const AddDeviceForm = styled.div`
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: white;
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  background-color: ${(props) =>
    props.variant === "primary" ? "#3b82f6" : "rgba(255, 255, 255, 0.1)"};
  color: white;

  &:hover {
    background-color: ${(props) =>
      props.variant === "primary" ? "#2563eb" : "rgba(255, 255, 255, 0.15)"};
  }
`;

const IoTDevicesPage: React.FC = () => {
  const [devices, setDevices] = useState<string[]>([]);
  const [isAddingDevice, setIsAddingDevice] = useState(false);
  const [newDeviceId, setNewDeviceId] = useState("");

  // Charger les appareils depuis le stockage local au chargement
  useEffect(() => {
    const savedDevices = localStorage.getItem("iotDevices");
    if (savedDevices) {
      try {
        setDevices(JSON.parse(savedDevices));
      } catch (error) {
        console.error("Erreur lors du chargement des appareils:", error);
      }
    }
  }, []);

  // Enregistrer les appareils dans le stockage local lorsqu'ils changent
  useEffect(() => {
    localStorage.setItem("iotDevices", JSON.stringify(devices));
  }, [devices]);

  const handleAddDevice = () => {
    if (newDeviceId.trim() === "") return;

    if (!devices.includes(newDeviceId)) {
      setDevices([...devices, newDeviceId]);
      setNewDeviceId("");
      setIsAddingDevice(false);
    }
  };

  const removeDevice = (deviceId: string) => {
    setDevices(devices.filter((id) => id !== deviceId));
  };

  return (
    <PageContainer>
      <PageHeader>
        <Title>Appareils IoT</Title>
        <Subtitle>Surveillez vos capteurs en temps réel via MQTT</Subtitle>
      </PageHeader>

      <DevicesGrid>
        {devices.map((deviceId) => (
          <MqttDeviceStatus key={deviceId} deviceId={deviceId} />
        ))}

        {/* Carte d'ajout d'appareil */}
        <AddDeviceCard
          onClick={() => !isAddingDevice && setIsAddingDevice(true)}
        >
          {isAddingDevice ? (
            <AddDeviceForm onClick={(e) => e.stopPropagation()}>
              <Input
                type="text"
                placeholder="ID de l'appareil"
                value={newDeviceId}
                onChange={(e) => setNewDeviceId(e.target.value)}
                autoFocus
              />
              <ButtonGroup>
                <Button variant="primary" onClick={handleAddDevice}>
                  Ajouter
                </Button>
                <Button onClick={() => setIsAddingDevice(false)}>
                  Annuler
                </Button>
              </ButtonGroup>
            </AddDeviceForm>
          ) : (
            <>
              <AddDeviceIcon>+</AddDeviceIcon>
              <AddDeviceText>Ajouter un appareil</AddDeviceText>
            </>
          )}
        </AddDeviceCard>
      </DevicesGrid>
    </PageContainer>
  );
};

export default IoTDevicesPage;
