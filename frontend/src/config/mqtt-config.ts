// Configuration MQTT
export const MQTT_CONFIG = {
  // Utilisez le préfixe affiché dans votre terminal
  PREFIX: "iot_test_463644", // Préfixe du script test-mqtt-sensor.js
  DEVICE_ID: "sensor1",
};

// Fonction pour générer les topics avec le préfixe correct
export const getMqttTopics = (deviceId: string) => {
  return {
    data: `${MQTT_CONFIG.PREFIX}/iot/device/${deviceId}/data`,
    status: `${MQTT_CONFIG.PREFIX}/iot/device/${deviceId}/status`,
  };
};
