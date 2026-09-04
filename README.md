# WeatherGPT — Conversational AI for Weather Forecasting, Alerts, and Climate Information

> **Smart India Hackathon Problem Statement SIH26068**

WeatherGPT is a full-stack, production-ready web application combining real-time weather forecasting, IMD-style severe weather alerts, comprehensive air quality indexing (AQI), static location databases (700+ Indian districts & 195+ world capitals), and a natural-language conversational AI assistant equipped with voice interaction and speech synthesis.

---

## 🌟 Key Features

1. **Conversational AI Weather Assistant (`/api/chat`)**
   - Natural language query understanding ("Will it rain in Bhopal tomorrow?", "Compare weather in Delhi and Tokyo").
   - Proxies requests to Anthropic Claude API with real-time weather context injection.
   - Built-in **Intelligent Fallback AI Engine** ensuring 100% functionality out-of-the-box even without an API key.
   - Supports both **Voice Speech Input** (Web Speech API) and **Text-to-Speech (TTS)** output toggle.

2. **Real Live Weather Data & Air Quality Index**
   - Live weather forecasts powered by **Open-Meteo API** (No API key required!).
   - Comprehensive parameters: Temperature, Feels-like, Wind Speed & Direction, Humidity, Pressure, Precipitation, UV Index, Sunrise/Sunset, and 7-day temperature trends.
   - Real-time AQI metrics: US AQI, PM2.5, PM10, Nitrogen Dioxide (NO2), Ozone (O3), Sulphur Dioxide (SO2).

3. **Complete Static Dataset Coverage (Zero Geocoding Latency)**
   - Includes all **700+ Indian Districts** grouped by State/UT.
   - Includes all **195+ World Country Capital Cities**.
   - Instant search autocomplete and filterable Explorer.

4. **IMD Severe Weather Alert System**
   - Live color-coded alerts (**Red**, **Orange**, **Yellow**, **Green**) covering Heatwaves, Heavy Rainfall/Floods, Cyclones/Squalls, Thunderstorms, and Air Pollution.
   - Actionable disaster safety guidelines and emergency helpline contacts.

5. **Apple-Weather & Windy Inspired Design**
   - Adaptive dynamic gradient backgrounds reflecting current conditions (sunny, rainy, cloudy, night, stormy, snowy).
   - Glassmorphism UI components, responsive layout across Mobile, Tablet, and Desktop.
   - Built-in **Dark Mode** toggle.
   - Interactive **Leaflet Map** centered on selected location.

---

## 🏗️ Architecture & Tech Stack

```
WeatherGPT Monorepo
├── /backend            # Node.js + Express API Server
│   ├── /src/data       # Static Datasets (Districts & Capitals)
│   ├── /src/services   # Weather, Alert & AI Service Layer
│   └── /src/routes     # Express Route Handlers
└── /frontend           # React + TypeScript + Vite + Tailwind CSS
    ├── /src/components # Glassmorphism UI Components & Leaflet Map
    ├── /src/views      # Dashboard, Chat, Explorer, Alerts Views
    └── /src/context    # Dark Mode & Speech Context
```

* **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Leaflet (`react-leaflet`), TanStack React Query, Web Speech API.
* **Backend**: Node.js, Express, `@anthropic-ai/sdk`, `node-cache` (15-min TTL), `express-rate-limit`, `cors`.

---

## 🚀 Quick Start Guide

### Prerequisites
* Node.js v18+ and npm installed.

### 1. Installation
Clone the repository and install dependencies across the monorepo:

```bash
# Install all root, backend, and frontend dependencies
npm run install:all
```

Alternatively:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 2. Environment Configuration
Create a `.env` file inside `/backend` (or copy `.env.example`):

```env
PORT=5000
ANTHROPIC_API_KEY=your_optional_anthropic_api_key
```

> **Note**: If `ANTHROPIC_API_KEY` is omitted, WeatherGPT automatically uses its built-in Intelligent Fallback AI Weather Engine to synthesize data-backed answers!

### 3. Run Locally (Concurrent Launch)
Launch both frontend (Vite on `http://localhost:3000`) and backend (Express on `http://localhost:5000`) concurrently:

```bash
npm run dev
```

Open your browser and navigate to:
👉 `http://localhost:3000`

---

## 🧪 Testing Verification & Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `GET /api/weather/forecast?lat=...&lon=...` | GET | Returns live weather, 7-day forecast, AQI, and alerts. |
| `GET /api/weather/alerts` | GET | Returns live IMD-style severe weather warnings. |
| `GET /api/locations/search?q=bhopal` | GET | Instant autocomplete over 700+ districts & 195+ capitals. |
| `POST /api/chat` | POST | WeatherGPT Conversational AI endpoint. |

---

## 📜 Disclaimer
Forecasts, AI responses, and advice in WeatherGPT are provided for informational purposes. For official emergency declarations, always consult the **India Meteorological Department (IMD)** or local government warnings.
