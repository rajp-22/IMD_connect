export interface ICityWeatherLocation {
  id: string;
  name: string;
  state: string;
  region: 'NORTH' | 'WEST' | 'CENTRAL' | 'SOUTH' | 'EAST' | 'NORTHEAST';
  lat: number;
  lng: number;
  x: number; // percentage coordinates on India Geographic projection (0-100)
  y: number;
  isKeyStation?: boolean; // prominent label
}

export interface ICityWeatherData {
  id: string;
  name: string;
  state: string;
  region: string;
  lat: number;
  lng: number;
  x: number;
  y: number;
  temperature: number;
  feelsLike: number;
  relativeHumidity: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  windDirectionCompass: string; // e.g. "SW"
  pressureMsl: number; // hPa
  precipitation: number; // mm
  cloudCover: number; // %
  visibility: number; // km
  weatherCode: number;
  condition: string;
  isDay: boolean;
  observationTime: string;
}

export interface IWeatherAlert {
  id: string;
  severity: 'WARNING' | 'ALERT' | 'WATCH';
  title: string;
  area: string;
  startTime: string;
  endTime: string;
  source: string;
  description: string;
}

export interface IRealtimeWeatherResponse {
  success: boolean;
  isLive: boolean;
  source: string;
  lastUpdated: string;
  cities: ICityWeatherData[];
  alerts: IWeatherAlert[];
}

export const MAJOR_INDIA_CITIES: ICityWeatherLocation[] = [
  // NORTH
  { id: 'delhi', name: 'Delhi', state: 'NCT Delhi', region: 'NORTH', lat: 28.6139, lng: 77.2090, x: 42, y: 31, isKeyStation: true },
  { id: 'srinagar', name: 'Srinagar', state: 'Jammu & Kashmir', region: 'NORTH', lat: 34.0837, lng: 74.7973, x: 33, y: 13, isKeyStation: true },
  { id: 'chandigarh', name: 'Chandigarh', state: 'Punjab / Haryana', region: 'NORTH', lat: 30.7333, lng: 76.7794, x: 39, y: 24, isKeyStation: false },
  { id: 'jaipur', name: 'Jaipur', state: 'Rajasthan', region: 'NORTH', lat: 26.9124, lng: 75.7873, x: 35, y: 36, isKeyStation: true },
  { id: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh', region: 'NORTH', lat: 26.8467, lng: 80.9462, x: 53, y: 37, isKeyStation: true },

  // WEST
  { id: 'mumbai', name: 'Mumbai', state: 'Maharashtra', region: 'WEST', lat: 19.0760, lng: 72.8777, x: 27, y: 60, isKeyStation: true },
  { id: 'pune', name: 'Pune', state: 'Maharashtra', region: 'WEST', lat: 18.5204, lng: 73.8567, x: 32, y: 63, isKeyStation: true },
  { id: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat', region: 'WEST', lat: 23.0225, lng: 72.5714, x: 26, y: 46, isKeyStation: true },
  { id: 'surat', name: 'Surat', state: 'Gujarat', region: 'WEST', lat: 21.1702, lng: 72.8311, x: 27, y: 53, isKeyStation: false },

  // CENTRAL
  { id: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh', region: 'CENTRAL', lat: 23.2599, lng: 77.4126, x: 44, y: 47, isKeyStation: true },
  { id: 'nagpur', name: 'Nagpur', state: 'Maharashtra', region: 'CENTRAL', lat: 21.1458, lng: 79.0882, x: 48, y: 54, isKeyStation: true },
  { id: 'indore', name: 'Indore', state: 'Madhya Pradesh', region: 'CENTRAL', lat: 22.7196, lng: 75.8577, x: 38, y: 49, isKeyStation: false },

  // SOUTH
  { id: 'bengaluru', name: 'Bengaluru', state: 'Karnataka', region: 'SOUTH', lat: 12.9716, lng: 77.5946, x: 43, y: 78, isKeyStation: true },
  { id: 'hyderabad', name: 'Hyderabad', state: 'Telangana', region: 'SOUTH', lat: 17.3850, lng: 78.4867, x: 47, y: 66, isKeyStation: true },
  { id: 'chennai', name: 'Chennai', state: 'Tamil Nadu', region: 'SOUTH', lat: 13.0827, lng: 80.2707, x: 53, y: 77, isKeyStation: true },
  { id: 'kochi', name: 'Kochi', state: 'Kerala', region: 'SOUTH', lat: 9.9312, lng: 76.2673, x: 38, y: 88, isKeyStation: true },

  // EAST
  { id: 'kolkata', name: 'Kolkata', state: 'West Bengal', region: 'EAST', lat: 22.5726, lng: 88.3639, x: 74, y: 49, isKeyStation: true },
  { id: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha', region: 'EAST', lat: 20.2961, lng: 85.8245, x: 67, y: 56, isKeyStation: true },
  { id: 'patna', name: 'Patna', state: 'Bihar', region: 'EAST', lat: 25.5941, lng: 85.1376, x: 64, y: 39, isKeyStation: true },
  { id: 'ranchi', name: 'Ranchi', state: 'Jharkhand', region: 'EAST', lat: 23.3441, lng: 85.3096, x: 65, y: 46, isKeyStation: false },

  // NORTHEAST
  { id: 'guwahati', name: 'Guwahati', state: 'Assam', region: 'NORTHEAST', lat: 26.1445, lng: 91.7362, x: 84, y: 37, isKeyStation: true },
];

export function getWindCompass(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5)) % 16;
  return directions[index];
}

export function decodeWmoWeatherCode(code: number): string {
  switch (code) {
    case 0: return 'Clear Sky';
    case 1: return 'Mainly Clear';
    case 2: return 'Partly Cloudy';
    case 3: return 'Overcast';
    case 45: case 48: return 'Fog / Haze';
    case 51: case 53: case 55: return 'Light Drizzle';
    case 56: case 57: return 'Freezing Drizzle';
    case 61: return 'Slight Rain';
    case 63: return 'Moderate Rain';
    case 65: return 'Heavy Rain';
    case 71: case 73: case 75: return 'Snowfall';
    case 80: case 81: case 82: return 'Rain Showers';
    case 95: return 'Thunderstorm';
    case 96: case 99: return 'Severe Thunderstorm & Hail';
    default: return 'Fair Conditions';
  }
}
