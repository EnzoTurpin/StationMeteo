import { useState, useEffect, useCallback } from "react";
import mqttService, { MqttConnectionOptions } from "../services/mqttService";

interface UseMqttOptions extends MqttConnectionOptions {
  topics?: string[];
}

interface UseMqttReturn {
  isConnected: boolean;
  messages: Record<string, any>;
  connect: () => void;
  disconnect: () => void;
  publish: (topic: string, message: any) => boolean;
  subscribe: (topic: string, callback?: (message: any) => void) => boolean;
  unsubscribe: (topic: string, callback?: (message: any) => void) => boolean;
}

const useMqtt = (options: UseMqttOptions = {}): UseMqttReturn => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<Record<string, any>>({});

  // Fonction de connexion
  const connect = useCallback(() => {
    const { topics, ...connectionOptions } = options;

    // Définir les callbacks
    const onConnect = () => {
      setIsConnected(true);

      // S'abonner aux topics spécifiés
      if (topics && topics.length > 0) {
        topics.forEach((topic) => {
          mqttService.subscribe(topic, (message) => {
            setMessages((prev) => ({ ...prev, [topic]: message }));
          });
        });
      }

      // Appeler le callback onConnect original si fourni
      if (options.onConnect) {
        options.onConnect();
      }
    };

    const onError = (error: Error) => {
      setIsConnected(false);
      if (options.onError) {
        options.onError(error);
      }
    };

    // Se connecter au broker
    mqttService.connect({
      ...connectionOptions,
      onConnect,
      onError,
    });
  }, [options]);

  // Fonction de déconnexion
  const disconnect = useCallback(() => {
    mqttService.disconnect();
    setIsConnected(false);
    setMessages({});
  }, []);

  // Fonction de publication
  const publish = useCallback((topic: string, message: any) => {
    return mqttService.publish(topic, message);
  }, []);

  // Fonction d'abonnement
  const subscribe = useCallback(
    (topic: string, callback?: (message: any) => void) => {
      const wrappedCallback =
        callback ||
        ((message: any) => {
          setMessages((prev) => ({ ...prev, [topic]: message }));
        });

      return mqttService.subscribe(topic, wrappedCallback);
    },
    []
  );

  // Fonction de désabonnement
  const unsubscribe = useCallback(
    (topic: string, callback?: (message: any) => void) => {
      return mqttService.unsubscribe(topic, callback);
    },
    []
  );

  // Connexion automatique au montage et déconnexion au démontage
  useEffect(() => {
    // Vérifier si on doit se connecter automatiquement
    if (!mqttService.isConnected()) {
      connect();
    } else {
      setIsConnected(true);
    }

    // Nettoyage lors du démontage
    return () => {
      // Ne déconnecter que si aucun autre composant n'utilise MQTT
      // Cette logique peut être affinée selon vos besoins
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    messages,
    connect,
    disconnect,
    publish,
    subscribe,
    unsubscribe,
  };
};

export default useMqtt;
