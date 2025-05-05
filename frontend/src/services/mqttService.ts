import mqtt, { MqttClient } from "mqtt";

// Configuration par défaut
const DEFAULT_HOST = "ws://localhost:8889"; // Broker local que l'application utilise déjà
const DEFAULT_OPTIONS = {
  keepalive: 30,
  clientId: `mqttjs_${Math.random().toString(16).substr(2, 8)}`,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
};

// Types d'interfaces
export interface MqttConnectionOptions {
  host?: string;
  options?: mqtt.IClientOptions;
  onConnect?: () => void;
  onError?: (error: Error) => void;
  onMessage?: (topic: string, message: Buffer) => void;
}

// Service MQTT
class MqttService {
  private client: MqttClient | null = null;
  private subscriptions: Map<string, Array<(message: any) => void>> = new Map();

  // Connexion au broker MQTT
  connect({
    host = DEFAULT_HOST,
    options = DEFAULT_OPTIONS,
    onConnect,
    onError,
    onMessage,
  }: MqttConnectionOptions = {}) {
    if (this.client && this.client.connected) {
      console.log("Client MQTT déjà connecté");
      return;
    }

    // Création du client MQTT
    this.client = mqtt.connect(host, options);

    // Gestion des événements de connexion
    this.client.on("connect", () => {
      console.log("Connecté au broker MQTT");
      if (onConnect) onConnect();
    });

    // Gestion des erreurs
    this.client.on("error", (err) => {
      console.error("Erreur de connexion MQTT:", err);
      if (onError) onError(err);
    });

    // Gestion des messages
    this.client.on("message", (topic, message) => {
      console.log(`Message reçu sur ${topic}: ${message.toString()}`);

      // Appel du callback global (si fourni)
      if (onMessage) onMessage(topic, message);

      // Appel des callbacks spécifiques au topic
      const handlers = this.subscriptions.get(topic);
      if (handlers) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          handlers.forEach((handler) => handler(parsedMessage));
        } catch (error) {
          // Si le message n'est pas du JSON, on passe le message brut
          handlers.forEach((handler) => handler(message.toString()));
        }
      }
    });

    // Gestion de la reconnexion
    this.client.on("reconnect", () => {
      console.log("Tentative de reconnexion au broker MQTT");
    });

    // Gestion de la déconnexion
    this.client.on("close", () => {
      console.log("Déconnecté du broker MQTT");
    });

    // Gestion des offline events
    this.client.on("offline", () => {
      console.log("Client MQTT hors ligne");
    });

    return this.client;
  }

  // S'abonner à un topic
  subscribe(topic: string, callback?: (message: any) => void) {
    if (!this.client || !this.client.connected) {
      console.error("Client MQTT non connecté");
      return false;
    }

    this.client.subscribe(topic, (err) => {
      if (err) {
        console.error(`Erreur lors de l'abonnement au topic ${topic}:`, err);
        return;
      }
      console.log(`Abonné au topic: ${topic}`);
    });

    if (callback) {
      // Ajouter le callback à la liste des souscriptions
      if (!this.subscriptions.has(topic)) {
        this.subscriptions.set(topic, []);
      }
      this.subscriptions.get(topic)?.push(callback);
    }

    return true;
  }

  // Se désabonner d'un topic
  unsubscribe(topic: string, callback?: (message: any) => void) {
    if (!this.client || !this.client.connected) {
      console.error("Client MQTT non connecté");
      return false;
    }

    // Se désabonner du topic
    this.client.unsubscribe(topic, (err) => {
      if (err) {
        console.error(`Erreur lors du désabonnement du topic ${topic}:`, err);
        return;
      }
      console.log(`Désabonné du topic: ${topic}`);
    });

    // Si un callback est fourni, ne supprimer que ce callback
    if (callback && this.subscriptions.has(topic)) {
      const handlers = this.subscriptions.get(topic);
      if (handlers) {
        const index = handlers.indexOf(callback);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
        // Si plus de handlers, supprimer le topic
        if (handlers.length === 0) {
          this.subscriptions.delete(topic);
        }
      }
    } else {
      // Sinon, supprimer tous les callbacks
      this.subscriptions.delete(topic);
    }

    return true;
  }

  // Publier un message sur un topic
  publish(topic: string, message: any) {
    if (!this.client || !this.client.connected) {
      console.error("Client MQTT non connecté");
      return false;
    }

    // Convertir le message en string s'il s'agit d'un objet
    const messageToSend =
      typeof message === "object"
        ? JSON.stringify(message)
        : message.toString();

    this.client.publish(topic, messageToSend, (err) => {
      if (err) {
        console.error(`Erreur lors de la publication sur ${topic}:`, err);
        return;
      }
      console.log(`Message publié sur ${topic}: ${messageToSend}`);
    });

    return true;
  }

  // Déconnexion du broker
  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.subscriptions.clear();
      console.log("Déconnecté du broker MQTT");
    }
  }

  // Vérifier si le client est connecté
  isConnected() {
    return this.client?.connected || false;
  }
}

// Export d'une instance unique du service
const mqttService = new MqttService();
export default mqttService;
