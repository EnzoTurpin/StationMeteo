import React, { useState, useRef, useCallback, useEffect } from "react";
import weatherService from "../services/weatherApi";
import {
  MapContainer,
  TileLayer,
  Popup,
  useMapEvents,
  CircleMarker,
  Marker,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import { Button } from "../components/ui/button";
import { BackButton } from "../components/ui/back-button";
import { Header } from "../components/ui/header";
import { TbCurrentLocation } from "react-icons/tb";

// Correction des icônes Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Définition des caches pour les données
interface CacheEntry {
  data: any;
  timestamp: number;
}

interface LocationCache {
  [key: string]: string; // format: "lat,lng" => "cityName"
}

interface WeatherCache {
  [key: string]: { temperature: number; timestamp: number }; // cityName => { temperature, timestamp }
}

// Temps d'expiration du cache en ms (15 minutes)
const CACHE_EXPIRATION = 15 * 60 * 1000;

// Caches globaux
const locationCache: LocationCache = {};
const weatherCache: WeatherCache = {};

// Villes françaises de secours au cas où le géocodage échoue
const fallbackCities = [
  { name: "Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Lyon", lat: 45.764, lng: 4.8357 },
  { name: "Marseille", lat: 43.2965, lng: 5.3698 },
  { name: "Toulouse", lat: 43.6047, lng: 1.4442 },
  { name: "Nice", lat: 43.7102, lng: 7.262 },
  { name: "Nantes", lat: 47.2184, lng: -1.5536 },
  { name: "Strasbourg", lat: 48.5734, lng: 7.7521 },
  { name: "Bordeaux", lat: 44.8378, lng: -0.5792 },
  { name: "Lille", lat: 50.6292, lng: 3.0573 },
  { name: "Rennes", lat: 48.1173, lng: -1.6778 },
  { name: "Reims", lat: 49.2583, lng: 4.0317 },
  { name: "Le Havre", lat: 49.4944, lng: 0.1079 },
  { name: "Dijon", lat: 47.322, lng: 5.0415 },
  { name: "Angers", lat: 47.4784, lng: -0.5632 },
  { name: "Grenoble", lat: 45.1885, lng: 5.7245 },
  { name: "Tours", lat: 47.3941, lng: 0.6848 },
  { name: "Limoges", lat: 45.8315, lng: 1.2578 },
  { name: "Clermont-Ferrand", lat: 45.7772, lng: 3.087 },
  { name: "Amiens", lat: 49.8942, lng: 2.2957 },
  { name: "Metz", lat: 49.1193, lng: 6.1757 },
];

interface FranceMapPageProps {
  onNavigate?: (page: "home" | "cities" | "profile" | "france-map") => void;
  hideHeader?: boolean;
}

interface MapClickHandlerProps {
  onMapClick: (lat: number, lng: number) => void;
}

// Composant pour gérer les clics sur la carte
const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
};

// Interface pour le géocodage inverse
interface GeocodingResult {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    hamlet?: string;
    county?: string;
    state?: string;
  };
}

// Styles personnalisés pour la carte Leaflet
const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Styles spécifiques pour Leaflet
const leafletStyle = `
  .leaflet-container {
    width: 100%;
    height: 100%;
    z-index: 0;
  }
`;

const FranceMapPage: React.FC<FranceMapPageProps> = ({
  onNavigate,
  hideHeader,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);
  const [cityName, setCityName] = useState<string>("");
  const [temperature, setTemperature] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<
    "home" | "cities" | "profile" | "france-map"
  >("france-map");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showTemperatureCard, setShowTemperatureCard] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const lastRequestTime = useRef<number>(0);

  // Force le rafraîchissement de la carte après son montage
  useEffect(() => {
    // Injecter les styles CSS spécifiques à Leaflet
    if (!document.getElementById("leaflet-style")) {
      const styleElement = document.createElement("style");
      styleElement.id = "leaflet-style";
      styleElement.innerHTML = leafletStyle;
      document.head.appendChild(styleElement);
    }

    // Forcer un rafraîchissement de la carte
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }

    return () => {
      // Nettoyer le style lors du démontage du composant
      const styleElement = document.getElementById("leaflet-style");
      if (styleElement) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  // Fonction pour trouver la ville la plus proche dans nos données de secours
  const findNearestFallbackCity = (lat: number, lng: number) => {
    let nearestCity = fallbackCities[0];
    let minDistance = calculateDistance(
      lat,
      lng,
      fallbackCities[0].lat,
      fallbackCities[0].lng
    );

    fallbackCities.forEach((city) => {
      const distance = calculateDistance(lat, lng, city.lat, city.lng);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return nearestCity;
  };

  // Calcul de distance entre deux points (formule de Haversine)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Fonction pour obtenir le nom de la ville à partir des coordonnées avec cache
  const getCityNameFromCoordinates = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      // Arrondir les coordonnées pour améliorer les chances de cache
      const roundedLat = Math.round(lat * 100) / 100;
      const roundedLng = Math.round(lng * 100) / 100;
      const cacheKey = `${roundedLat},${roundedLng}`;

      // Vérifier si nous avons cette position dans le cache
      if (locationCache[cacheKey]) {
        return locationCache[cacheKey];
      }

      // Limiter le taux de requêtes (1 par seconde maximum)
      const now = Date.now();
      const timeElapsed = now - lastRequestTime.current;
      if (timeElapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - timeElapsed));
      }

      try {
        lastRequestTime.current = Date.now();
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
          {
            headers: {
              "Accept-Language": "fr", // Pour obtenir les noms en français
              "User-Agent": "YnovMeteoApp/1.0", // Identification pour l'API
            },
          }
        );

        if (!response.ok) {
          // Si l'API rejette la demande (429 Too Many Requests ou autre), utilisez une ville de secours
          const fallbackCity = findNearestFallbackCity(lat, lng);
          locationCache[cacheKey] = fallbackCity.name;
          return fallbackCity.name;
        }

        const data: GeocodingResult = await response.json();

        // Essaie différents niveaux de lieu, du plus spécifique au plus général
        const placeName =
          data.address.city ||
          data.address.town ||
          data.address.village ||
          data.address.municipality ||
          data.address.hamlet ||
          data.address.county ||
          data.address.state;

        if (placeName) {
          // Stocker dans le cache
          locationCache[cacheKey] = placeName;
          return placeName;
        } else {
          // Si aucun nom de lieu n'est trouvé, utilisez une ville de secours
          const fallbackCity = findNearestFallbackCity(lat, lng);
          locationCache[cacheKey] = fallbackCity.name;
          return fallbackCity.name;
        }
      } catch (error) {
        console.error("Erreur lors du géocodage inverse:", error);

        // En cas d'erreur, utilisez une ville de secours
        const fallbackCity = findNearestFallbackCity(lat, lng);
        locationCache[cacheKey] = fallbackCity.name;
        return fallbackCity.name;
      }
    },
    []
  );

  // Fonction pour obtenir la température avec cache
  const getTemperature = useCallback(
    async (cityName: string): Promise<number | null> => {
      // Vérifier si nous avons cette ville dans le cache et si les données sont encore valides
      if (
        weatherCache[cityName] &&
        Date.now() - weatherCache[cityName].timestamp < CACHE_EXPIRATION
      ) {
        return weatherCache[cityName].temperature;
      }

      try {
        const weatherData = await weatherService.getWeatherByCity(cityName);

        // Mettre en cache
        weatherCache[cityName] = {
          temperature: weatherData.temperature,
          timestamp: Date.now(),
        };

        return weatherData.temperature;
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des données météo pour ${cityName}:`,
          error
        );
        return null;
      }
    },
    []
  );

  const handleMapClick = async (lat: number, lng: number) => {
    setLoading(true);
    setErrorMessage(null);
    setSelectedPosition([lat, lng]);
    setShowTemperatureCard(false);

    try {
      // 1. Obtenir le nom de la ville à partir des coordonnées
      const locationName = await getCityNameFromCoordinates(lat, lng);
      setCityName(locationName);

      // 2. Récupérer les données météo pour cette ville
      const temp = await getTemperature(locationName);
      setTemperature(temp);
      setShowTemperatureCard(true);

      if (temp === null) {
        setErrorMessage(`Données météo non disponibles pour ${locationName}`);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      setCityName("Lieu inconnu");
      setTemperature(null);
      setShowTemperatureCard(true);
      setErrorMessage(
        "Impossible de récupérer les informations météorologiques. Veuillez réessayer plus tard."
      );
    } finally {
      setLoading(false);
    }
  };

  const navigateTo = (page: "home" | "cities" | "profile" | "france-map") => {
    setCurrentPage(page);
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-5">
      {/* Header */}
      {!hideHeader && (
        <Header currentPage={currentPage} onNavigate={navigateTo} />
      )}

      {/* Back Button */}
      <BackButton onClick={() => navigateTo("home")} />

      {/* Page Title */}
      <h1 className="text-white text-center text-3xl mb-5">
        Carte météorologique de la France
      </h1>

      {/* Instructions */}
      <div className="text-white text-center bg-black bg-opacity-20 rounded-lg p-2.5 mb-5">
        Cliquez n'importe où sur la carte pour voir la température de la ville
        correspondante
      </div>

      {/* Temperature Card */}
      {showTemperatureCard && (
        <div
          className={`bg-gradient-to-r from-primary to-primary-light text-white p-4 rounded-lg mx-auto mb-5 text-center max-w-sm shadow-lg flex flex-col items-center transition-all transform ${
            showTemperatureCard
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-5"
          }`}
        >
          <div className="font-bold text-xl mb-1">{cityName}</div>
          <div className="text-3xl font-bold my-1">
            {temperature !== null
              ? `${temperature}°C`
              : "Données non disponibles"}
          </div>
          {selectedPosition && (
            <div className="text-xs opacity-80 mt-1">
              {selectedPosition[0].toFixed(4)}, {selectedPosition[1].toFixed(4)}
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="text-white text-center bg-red-500 bg-opacity-30 rounded-lg p-2.5 my-5">
          {errorMessage}
        </div>
      )}

      {/* Map Container */}
      <div className="relative w-full max-w-4xl h-[600px] mx-auto overflow-hidden rounded-lg shadow-lg">
        <MapContainer
          key="france-map"
          center={[46.603354, 1.8883335]}
          zoom={6}
          scrollWheelZoom={true}
          ref={mapRef}
          className="w-full h-full"
          style={{ width: "100%", height: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Marqueur pour la position sélectionnée */}
          {selectedPosition && (
            <CircleMarker
              center={selectedPosition}
              radius={8}
              pathOptions={{
                color: "#4facfe",
                fillColor: "#4facfe",
                fillOpacity: 0.7,
              }}
            >
              <Popup>
                <strong>{cityName}</strong>
                <br />
                {temperature !== null
                  ? `${temperature}°C`
                  : "Données non disponibles"}
              </Popup>
            </CircleMarker>
          )}

          {/* Gestionnaire de clic sur la carte */}
          <MapClickHandler onMapClick={handleMapClick} />
        </MapContainer>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-lg text-white text-xl font-bold">
            Chargement des données météo...
          </div>
        )}
      </div>
    </div>
  );
};

export default FranceMapPage;
