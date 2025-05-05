const mqtt = require("mqtt");

// Configuration pour le broker local existant
const BROKER_URL = "ws://localhost:8889"; // Utiliser WebSockets et le même port que dans App.tsx
const PUBLISH_INTERVAL = 5000; // milliseconds

// Connexion au broker MQTT
const client = mqtt.connect(BROKER_URL, {
  clientId: `mqtt-test-sensor-${Math.random().toString(16).substring(2, 10)}`,
});

// Utiliser les topics existants
const temperatureTopic = "meteo/temperature";
const humidityTopic = "meteo/humidity";

console.log(`Utilisation des topics existants:
- Température: ${temperatureTopic}
- Humidité: ${humidityTopic}`);

// État initial du dispositif
let isOnline = false;

// Gestion des événements
client.on("connect", () => {
  console.log("Connecté au broker MQTT local");
  isOnline = true;

  // Commencer à publier périodiquement les données
  startPublishingData();
});

client.on("error", (err) => {
  console.error("Erreur de connexion:", err);
  isOnline = false;
});

client.on("close", () => {
  console.log("Connexion fermée");
  isOnline = false;
});

// Fonction pour générer des données aléatoires
function generateRandomData() {
  return {
    temperature: +(20 + Math.random() * 10).toFixed(1), // Entre 20 et 30°C
    humidity: Math.floor(30 + Math.random() * 50), // Entre 30% et 80%
  };
}

// Fonction pour publier des données périodiquement
function startPublishingData() {
  console.log(
    `Publication des données toutes les ${PUBLISH_INTERVAL / 1000} secondes`
  );

  // Publication immédiate
  publishData();

  // Puis toutes les X secondes
  setInterval(publishData, PUBLISH_INTERVAL);
}

function publishData() {
  if (!isOnline) return;

  const data = generateRandomData();

  // Publier les données sur les topics existants
  client.publish(temperatureTopic, data.temperature.toString());
  client.publish(humidityTopic, data.humidity.toString());

  console.log(
    `Données publiées - Température: ${data.temperature}°C, Humidité: ${data.humidity}%`
  );
}

// Gestion de la fermeture propre
process.on("SIGINT", () => {
  console.log("Fermeture en cours...");
  client.end();
  process.exit();
});

console.log("Simulateur de capteur météo démarré");
