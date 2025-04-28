import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const MqttClient = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const client = mqtt.connect("ws://localhost:8888");

    client.on("connect", () => {
      console.log("✅ Connecté au broker MQTT");
      setIsConnected(true);
      client.subscribe("meteo/temperature");
      client.subscribe("meteo/humidity");
    });

    client.on("error", (err) => {
      console.error("❌ Erreur de connexion MQTT:", err);
    });

    client.on("message", (topic, message) => {
      const payload = message.toString();
      console.log(`📩 Reçu sur ${topic}: ${payload}`);

      if (topic === "meteo/temperature") {
        setTemperature(parseFloat(payload));
      }
      if (topic === "meteo/humidity") {
        setHumidity(parseFloat(payload));
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Données météo temps réel 🌤️</h2>
      <p>
        <strong>Statut :</strong>{" "}
        {isConnected ? "Connecté ✅" : "Déconnecté ❌"}
      </p>
      <p>
        <strong>Température :</strong>{" "}
        {temperature !== null ? `${temperature} °C` : "---"}
      </p>
      <p>
        <strong>Humidité :</strong>{" "}
        {humidity !== null ? `${humidity} %` : "---"}
      </p>
    </div>
  );
};

export default MqttClient;
