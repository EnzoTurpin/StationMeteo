import axios from "axios";

// API base URL
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api";

// Weather data interface
export interface WeatherData {
  id?: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}

// API functions for weather data
const weatherApi = {
  // Get the latest weather data
  getLatest: async (): Promise<WeatherData> => {
    const response = await axios.get(`${API_URL}/weather/latest`);
    return response.data;
  },

  // Get today's weather data
  getToday: async (): Promise<WeatherData[]> => {
    const response = await axios.get(`${API_URL}/weather/today`);
    return response.data;
  },

  // Get weather data for a specific date
  getByDate: async (date: string): Promise<WeatherData[]> => {
    const response = await axios.get(`${API_URL}/weather/daily/${date}`);
    return response.data;
  },
};

export default weatherApi;
