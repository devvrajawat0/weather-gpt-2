import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { LocationItem } from '../types';
import { MapPin } from 'lucide-react';

// Fix default marker icon issue in Leaflet with Vite bundler
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface WeatherMapProps {
  location: LocationItem;
  currentTemp?: number;
  condition?: string;
}

// Controller to smoothly recalculate map center when location changes
const MapRecenter: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 9);
  }, [lat, lon, map]);
  return null;
};

export const WeatherMap: React.FC<WeatherMapProps> = ({ location, currentTemp, condition }) => {
  return (
    <div className="glass-panel rounded-3xl p-5 border border-slate-700/60 shadow-xl flex flex-col h-[380px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Interactive Location Map
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Lat: {location.lat.toFixed(2)}, Lon: {location.lon.toFixed(2)}
        </span>
      </div>

      <div className="flex-1 w-full rounded-2xl overflow-hidden relative border border-slate-700/40">
        <MapContainer
          center={[location.lat, location.lon]}
          zoom={9}
          scrollWheelZoom={false}
          className="w-full h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapRecenter lat={location.lat} lon={location.lon} />

          <Marker position={[location.lat, location.lon]}>
            <Popup>
              <div className="p-1 text-slate-900 font-sans">
                <div className="font-bold text-sm">{location.name}</div>
                {location.state && <div className="text-xs text-gray-600">{location.state}</div>}
                {currentTemp !== undefined && (
                  <div className="text-xs font-semibold text-blue-600 mt-1">
                    Temp: {Math.round(currentTemp)}°C ({condition})
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};
