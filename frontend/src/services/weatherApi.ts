import axios from "axios";

// Utiliser la clé API depuis les variables d'environnement
const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

// Base URLs
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";

// Types d'interfaces
export interface WeatherData {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  timestamp: string;
}

export interface CityData {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

// Service pour l'API météo
const weatherService = {
  // Rechercher des villes par nom
  searchCities: async (query: string): Promise<CityData[]> => {
    if (!API_KEY) {
      console.error("Clé API OpenWeatherMap manquante");
      throw new Error("Configuration API manquante");
    }

    try {
      const response = await axios.get(`${GEO_BASE_URL}/direct`, {
        params: {
          q: query,
          limit: 5,
          appid: API_KEY,
        },
      });

      return response.data.map((city: any) => ({
        name: city.name,
        country: city.country,
        lat: city.lat,
        lon: city.lon,
      }));
    } catch (error) {
      console.error("Erreur lors de la recherche de villes:", error);
      throw error;
    }
  },

  // Obtenir la météo actuelle par coordonnées
  getCurrentWeather: async (lat: number, lon: number): Promise<WeatherData> => {
    if (!API_KEY) {
      console.error("Clé API OpenWeatherMap manquante");
      throw new Error("Configuration API manquante");
    }

    try {
      const response = await axios.get(`${WEATHER_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          units: "metric", // Température en Celsius
          lang: "fr", // Descriptions en français
          appid: API_KEY,
        },
      });

      const data = response.data;
      return {
        city: data.name,
        country: data.sys.country,
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        icon: data.weather[0].icon,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des données météo:", error);
      throw error;
    }
  },

  // Obtenir la météo actuelle par nom de ville
  getWeatherByCity: async (cityName: string): Promise<WeatherData> => {
    try {
      // D'abord, obtenir les coordonnées de la ville
      const cities = await weatherService.searchCities(cityName);
      if (cities.length === 0) {
        throw new Error(`Ville "${cityName}" non trouvée`);
      }

      // Utiliser les coordonnées pour obtenir la météo
      const city = cities[0];
      const weather = await weatherService.getCurrentWeather(
        city.lat,
        city.lon
      );
      return weather;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des données météo pour ${cityName}:`,
        error
      );
      throw error;
    }
  },
};

export default weatherService;
