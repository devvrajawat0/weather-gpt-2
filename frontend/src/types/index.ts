export interface LocationItem {
  id: string;
  name: string;
  state?: string;
  country?: string;
  continent?: string;
  lat: number;
  lon: number;
  type: 'district' | 'capital' | 'custom';
}

export interface CurrentWeather {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  windGusts?: number;
  pressure: number;
  precipitation: number;
  isDay: boolean;
  weatherCode: number;
  condition: string;
  category: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'foggy' | 'stormy';
  uvIndex: number;
  sunrise?: string;
  sunset?: string;
}

export interface AirQuality {
  usAqi: number;
  europeanAqi?: number;
  label: string;
  severity: 'green' | 'yellow' | 'orange' | 'red' | 'purple';
  pm2_5?: number;
  pm10?: number;
  no2?: number;
  so2?: number;
  o3?: number;
  co?: number;
}

export interface DailyForecastItem {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  condition: string;
  precipitationSum: number;
  precipProbability: number;
  uvMax: number;
  sunrise?: string;
  sunset?: string;
}

export interface HourlyForecastItem {
  time: string;
  temp: number;
  humidity: number;
  precipProb: number;
  uv: number;
  weatherCode: number;
  condition: string;
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  elevation?: number;
  timezone: string;
  current: CurrentWeather;
  aqi: AirQuality;
  daily: DailyForecastItem[];
  hourly: HourlyForecastItem[];
  fetchedAt: string;
  cached?: boolean;
}

export interface SevereAlert {
  id: string;
  title: string;
  severity: 'green' | 'yellow' | 'orange' | 'red';
  category: string;
  source: string;
  issuedAt: string;
  location: string;
  headline: string;
  description: string;
  instructions: string[];
}

export interface ForecastResponse {
  success: boolean;
  location: LocationItem;
  weather: WeatherData;
  alerts: SevereAlert[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  locations?: LocationItem[];
  weatherData?: any[];
}
