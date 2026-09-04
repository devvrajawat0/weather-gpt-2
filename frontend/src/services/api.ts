import { ForecastResponse, LocationItem, SevereAlert, ChatMessage } from '../types';

const API_BASE = '/api';

export async function fetchForecast(lat: number, lon: number, locationId?: string): Promise<ForecastResponse> {
  const params = new URLSearchParams({
    lat: lat.toString(),
    lon: lon.toString(),
  });
  if (locationId) params.append('locationId', locationId);

  const res = await fetch(`${API_BASE}/weather/forecast?${params.toString()}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.statusText}`);
  }
  return res.json();
}

export async function searchLocations(query: string): Promise<LocationItem[]> {
  if (!query.trim()) return [];
  const res = await fetch(`${API_BASE}/locations/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

export async function fetchDistricts(): Promise<{ statesCount: number; districtsByState: Record<string, LocationItem[]>; allDistricts: LocationItem[] }> {
  const res = await fetch(`${API_BASE}/locations/districts`);
  if (!res.ok) throw new Error('Failed to fetch districts');
  return res.json();
}

export async function fetchCapitals(): Promise<{ totalCapitals: number; capitalsByContinent: Record<string, LocationItem[]>; allCapitals: LocationItem[] }> {
  const res = await fetch(`${API_BASE}/locations/capitals`);
  if (!res.ok) throw new Error('Failed to fetch capitals');
  return res.json();
}

export async function fetchAlerts(state?: string, country?: string): Promise<{ success: boolean; alerts: SevereAlert[] }> {
  const params = new URLSearchParams();
  if (state) params.append('state', state);
  if (country) params.append('country', country);

  const res = await fetch(`${API_BASE}/weather/alerts?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function sendChatMessage(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  currentLocation?: LocationItem | null
): Promise<{ reply: string; locations?: LocationItem[]; weatherData?: any[] }> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, currentLocation })
  });
  if (!res.ok) {
    throw new Error('Failed to communicate with WeatherGPT AI');
  }
  const data = await res.json();
  return {
    reply: data.reply,
    locations: data.locations,
    weatherData: data.weatherData
  };
}
