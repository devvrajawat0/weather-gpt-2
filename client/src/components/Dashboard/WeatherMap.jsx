import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { CloudRain } from 'lucide-react';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map center changes
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const WeatherMap = ({ lat, lon, city }) => {
  const [mapCenter, setMapCenter] = useState([20.5937, 78.9629]); // India default
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (lat && lon) {
      setMapCenter([lat, lon]);
      setZoom(10);
    }
  }, [lat, lon]);

  if (!lat || !lon) {
    return (
      <div className="w-full h-full bg-slate-800 rounded-xl flex items-center justify-center flex-col text-gray-500">
        <CloudRain size={32} className="mb-2 opacity-50" />
        <p>Location data unavailable for map</p>
      </div>
    );
  }

  // Use a placeholder API key for the OpenWeatherMap tile layer
  // In a real app, this should be fetched from the backend or env
  const OWM_API_KEY = 'YOUR_API_KEY';

  return (
    <div className="w-full h-full relative group rounded-xl overflow-hidden">
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        zoomControl={false}
      >
        <ChangeView center={mapCenter} zoom={zoom} />
        
        {/* Base Map - Dark theme */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Weather Overlay - Temperature 
            Note: This requires a valid API key to render properly. 
            Left as placeholder as requested. */}
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${OWM_API_KEY}`}
          opacity={0.5}
        />

        <Marker position={mapCenter}>
          <Popup className="custom-popup">
            <div className="font-bold text-gray-800">{city}</div>
            <div className="text-sm text-gray-600">Selected Location</div>
          </Popup>
        </Marker>
      </MapContainer>
      
      <div className="absolute top-2 left-2 z-[400] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium pointer-events-none">
        Temperature Map
      </div>
    </div>
  );
};

export default WeatherMap;
