const mqtt = require("mqtt");

// Connexion au broker (adapter l'URL si besoin)
const client = mqtt.connect("ws://localhost:8888"); // ⚠️ Si ton broker WebSocket est ailleurs, modifie ici !

client.on("connect", () => {
  console.log("✅ Connecté au broker MQTT");

  // Envoi toutes les 5 secondes
  setInterval(() => {
    const temperature = (Math.random() * 10 + 20).toFixed(2); // Exemple : 20°C - 30°C
    const humidity = (Math.random() * 30 + 50).toFixed(2); // Exemple : 50% - 80%

    console.log(`📤 Envoi température: ${temperature} °C`);
    console.log(`📤 Envoi humidité: ${humidity} %`);

    client.publish("meteo/temperature", temperature);
    client.publish("meteo/humidity", humidity);
  }, 5000);
});

client.on("error", (err) => {
  console.error("❌ Erreur de connexion MQTT:", err);
});
