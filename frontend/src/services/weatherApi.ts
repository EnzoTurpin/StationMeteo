import axios from "axios";

// Utiliser la clé API depuis les variables d'environnement
const API_KEY = process.env.REACT_APP_OPENWEATHERMAP_API_KEY;

// Base URLs
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_BASE_URL = "https://api.openweathermap.org/geo/1.0";
const HISTORY_BASE_URL = "https://history.openweathermap.org/data/2.5";

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

export interface HistoricalWeatherData {
  date: Date;
  temperature: number;
  humidity: number;
}

export interface ForecastDay {
  day: string;
  icon: string;
  temperature: number;
  conditions: string;
  date: Date;
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

  // Obtenir les prévisions météo sur 5 jours
  getForecast: async (cityName: string): Promise<ForecastDay[]> => {
    if (!API_KEY) {
      console.error("Clé API OpenWeatherMap manquante");
      throw new Error("Configuration API manquante");
    }

    try {
      // D'abord, obtenir les coordonnées de la ville
      const cities = await weatherService.searchCities(cityName);
      if (cities.length === 0) {
        throw new Error(`Ville "${cityName}" non trouvée`);
      }

      const city = cities[0];
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          lat: city.lat,
          lon: city.lon,
          units: "metric",
          lang: "fr",
          appid: API_KEY,
        },
      });

      // Traiter les données pour obtenir des prévisions journalières
      const forecastData = response.data.list;
      const dailyForecasts: ForecastDay[] = [];

      // Regrouper par jour et prendre les prévisions à midi
      const forecastsByDay = forecastData.reduce((acc: any, forecast: any) => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toDateString();

        if (!acc[day]) {
          acc[day] = [];
        }

        acc[day].push(forecast);
        return acc;
      }, {});

      // Pour chaque jour, prendre la prévision la plus proche de midi
      Object.keys(forecastsByDay).forEach((day) => {
        const forecasts = forecastsByDay[day];
        // Trouver la prévision la plus proche de midi
        let middayForecast = forecasts[0];
        let minTimeDiff = Infinity;

        forecasts.forEach((forecast: any) => {
          const date = new Date(forecast.dt * 1000);
          const timeDiff = Math.abs(date.getHours() - 12);
          if (timeDiff < minTimeDiff) {
            minTimeDiff = timeDiff;
            middayForecast = forecast;
          }
        });

        const date = new Date(middayForecast.dt * 1000);
        const dayOfWeek = new Intl.DateTimeFormat("fr-FR", {
          weekday: "long",
        }).format(date);

        dailyForecasts.push({
          day: dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1),
          temperature: Math.round(middayForecast.main.temp),
          conditions: middayForecast.weather[0].description,
          icon: weatherService.getWeatherIcon(middayForecast.weather[0].id),
          date: date,
        });
      });

      return dailyForecasts.slice(0, 6); // Prendre les 6 premiers jours
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des prévisions pour ${cityName}:`,
        error
      );
      throw error;
    }
  },

  // Obtenir l'historique météo pour une ville
  getHistoricalWeather: async (
    cityName: string,
    days: number = 7
  ): Promise<HistoricalWeatherData[]> => {
    // Note: L'API Historical Weather d'OpenWeatherMap est payante
    // Pour contourner cette limitation, nous allons utiliser l'API gratuite OneCall avec des timestamps passés

    if (!API_KEY) {
      console.error("Clé API OpenWeatherMap manquante");
      throw new Error("Configuration API manquante");
    }

    try {
      // D'abord, obtenir les coordonnées de la ville
      const cities = await weatherService.searchCities(cityName);
      if (cities.length === 0) {
        throw new Error(`Ville "${cityName}" non trouvée`);
      }

      const city = cities[0];
      const historicalData: HistoricalWeatherData[] = [];

      // En utilisant l'API gratuite, nous pouvons simuler des données historiques
      // L'API 5 Day Forecast donne des prévisions toutes les 3 heures, on peut l'utiliser pour des graphiques
      const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
        params: {
          lat: city.lat,
          lon: city.lon,
          units: "metric",
          appid: API_KEY,
        },
      });

      // Traiter les données pour obtenir un point toutes les 6 heures
      const forecastData = response.data.list;
      for (let i = 0; i < Math.min(forecastData.length, days * 4); i += 2) {
        const item = forecastData[i];
        historicalData.push({
          date: new Date(item.dt * 1000),
          temperature: Math.round(item.main.temp),
          humidity: item.main.humidity,
        });
      }

      return historicalData;
    } catch (error) {
      console.error(
        `Erreur lors de la récupération de l'historique météo:`,
        error
      );
      throw error;
    }
  },

  // Convertir les codes météo en icônes emoji
  getWeatherIcon: (weatherId: number): string => {
    // Conversion des codes météo en icônes emoji
    if (weatherId >= 200 && weatherId < 300) return "⛈️"; // Orage
    if (weatherId >= 300 && weatherId < 400) return "🌧️"; // Bruine
    if (weatherId >= 500 && weatherId < 600) return "🌧️"; // Pluie
    if (weatherId >= 600 && weatherId < 700) return "❄️"; // Neige
    if (weatherId >= 700 && weatherId < 800) return "🌫️"; // Brouillard
    if (weatherId === 800) return "☀️"; // Ciel dégagé
    if (weatherId > 800) return "⛅"; // Nuageux
    return "🌡️"; // Par défaut
  },
};

export default weatherService;
