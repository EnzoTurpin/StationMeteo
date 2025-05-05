import React, { useEffect, useState } from "react";
import styled from "styled-components";
import useMqtt from "../hooks/useMqtt";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { getMqttTopics } from "../config/mqtt-config";

interface SensorData {
  temperature?: number;
  humidity?: number;
  light?: number;
  motion?: boolean;
  timestamp?: string;
}

interface MqttDeviceStatusProps {
  deviceId: string;
}

const StatusCard = styled(Card)`
  padding: 20px;
  margin-bottom: 20px;
`;

const DeviceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const DeviceTitle = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const StatusBadge = styled(Badge)<{ status: "online" | "offline" }>`
  background-color: ${(props) =>
    props.status === "online" ? "#10b981" : "#ef4444"};
`;

const SensorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
`;

const SensorItem = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  padding: 12px;
  border-radius: 8px;
`;

const SensorLabel = styled.div`
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 5px;
`;

const SensorValue = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
`;

const LastUpdated = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 15px;
  text-align: right;
`;

const MqttDeviceStatus: React.FC<MqttDeviceStatusProps> = ({ deviceId }) => {
  const [sensorData, setSensorData] = useState<SensorData>({});
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [deviceStatus, setDeviceStatus] = useState<"online" | "offline">(
    "offline"
  );

  // Topics MQTT pour ce périphérique
  const topics = getMqttTopics(deviceId);
  const dataTopic = topics.data;
  const statusTopic = topics.status;

  console.log("Abonnement aux topics:", dataTopic, statusTopic);

  // Connexion MQTT et abonnement aux topics
  const { messages, isConnected } = useMqtt({
    topics: [dataTopic, statusTopic],
  });

  // Traiter les messages reçus
  useEffect(() => {
    // Traiter les données des capteurs
    if (messages[dataTopic]) {
      try {
        const data =
          typeof messages[dataTopic] === "string"
            ? JSON.parse(messages[dataTopic])
            : messages[dataTopic];

        setSensorData(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Erreur lors du traitement des données capteur:", error);
      }
    }

    // Traiter l'état du périphérique
    if (messages[statusTopic]) {
      const status = messages[statusTopic];
      if (typeof status === "string") {
        setDeviceStatus(status === "online" ? "online" : "offline");
      } else if (typeof status === "object" && status.status) {
        setDeviceStatus(status.status === "online" ? "online" : "offline");
      }
    }
  }, [messages, dataTopic, statusTopic]);

  // Formater l'heure de dernière mise à jour
  const formatLastUpdate = () => {
    if (!lastUpdate) return "Jamais";
    return lastUpdate.toLocaleTimeString();
  };

  return (
    <StatusCard>
      <DeviceHeader>
        <DeviceTitle>Capteur {deviceId}</DeviceTitle>
        <StatusBadge status={deviceStatus}>
          {deviceStatus === "online" ? "En ligne" : "Hors ligne"}
        </StatusBadge>
      </DeviceHeader>

      <SensorGrid>
        {sensorData.temperature !== undefined && (
          <SensorItem>
            <SensorLabel>Température</SensorLabel>
            <SensorValue>{sensorData.temperature}°C</SensorValue>
          </SensorItem>
        )}

        {sensorData.humidity !== undefined && (
          <SensorItem>
            <SensorLabel>Humidité</SensorLabel>
            <SensorValue>{sensorData.humidity}%</SensorValue>
          </SensorItem>
        )}

        {sensorData.light !== undefined && (
          <SensorItem>
            <SensorLabel>Luminosité</SensorLabel>
            <SensorValue>{sensorData.light} lux</SensorValue>
          </SensorItem>
        )}

        {sensorData.motion !== undefined && (
          <SensorItem>
            <SensorLabel>Mouvement</SensorLabel>
            <SensorValue>{sensorData.motion ? "Détecté" : "Aucun"}</SensorValue>
          </SensorItem>
        )}
      </SensorGrid>

      <LastUpdated>Dernière mise à jour: {formatLastUpdate()}</LastUpdated>
    </StatusCard>
  );
};

export default MqttDeviceStatus;
