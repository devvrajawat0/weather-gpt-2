# ⛈️ WeatherGPT — AI-Powered Weather Assistant

> **SIH 2026 | Problem Statement: SIH26068** | Ministry of Earth Sciences (MoES) | Theme: Disaster Management

WeatherGPT is a conversational AI system that provides weather forecasts, delivers timely disaster alerts, and makes complex climate data accessible through an intuitive chat interface.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![AI](https://img.shields.io/badge/AI-Gemini%202.0-orange) ![Weather](https://img.shields.io/badge/Data-OpenWeatherMap-yellow)

---

## 🚀 Features

### 🤖 AI Chat Assistant
- Natural language weather queries ("Will it rain in Mumbai tomorrow?")
- Context-aware responses grounded in real weather data
- Practical advice and safety tips
- Conversation memory for follow-up questions

### 📊 Weather Dashboard
- Real-time current conditions (temperature, humidity, wind, pressure)
- 5-day forecast with interactive charts
- Hourly forecast breakdown
- Interactive weather map (Leaflet.js)

### 🚨 Disaster Alerts
- Real-time weather warnings (cyclones, heatwaves, floods)
- Color-coded severity levels (Red/Orange/Yellow/Green)
- Safety instructions for each alert type
- Location-based alert filtering

### 🎨 Modern UI/UX
- Dark mode by default with light mode toggle
- Glassmorphism design with smooth animations
- Fully responsive (mobile + desktop)
- Beautiful data visualizations

---

## 📋 Prerequisites

Before you begin, you need to install:

1. **Node.js** (v18 or later) — [Download here](https://nodejs.org/)
2. **Git** (optional) — [Download here](https://git-scm.com/)

And sign up for these **FREE** API keys:

1. **OpenWeatherMap API Key** — [Sign up here](https://openweathermap.org/api) (Free tier: 1000 calls/day)
2. **Google Gemini API Key** — [Get it here](https://aistudio.google.com/apikey) (Free tier available)

---

## ⚡ Quick Start

### Step 1: Install Node.js
Download and install from [https://nodejs.org/](https://nodejs.org/) (choose LTS version).
After installation, verify by opening a new terminal:
```bash
node --version
npm --version
```

### Step 2: Set up API Keys
Copy the environment template and add your keys:
```bash
copy .env.example .env
```
Then open `.env` in any text editor and replace the placeholder values:
```
OPENWEATHER_API_KEY=your_actual_key_here
GEMINI_API_KEY=your_actual_key_here
```

### Step 3: Install Dependencies
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Step 4: Run the App
```bash
npm run dev
```
This starts both the backend (port 5000) and frontend (port 5173).

### Step 5: Open in Browser
Visit: **http://localhost:5173**

---

## 📁 Project Structure

```
weathergpt/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chat/          # AI chat interface
│   │   │   ├── Dashboard/     # Weather dashboard
│   │   │   ├── Alerts/        # Disaster alerts
│   │   │   ├── Layout/        # Navbar, Sidebar, Footer
│   │   │   └── Common/        # Shared components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API client
│   │   └── utils/             # Helper functions
│   └── ...config files
│
├── server/                    # Node.js Backend
│   ├── controllers/           # Route handlers
│   ├── services/              # Business logic
│   │   ├── geminiService.js   # Google Gemini AI
│   │   ├── weatherService.js  # OpenWeatherMap API
│   │   └── alertService.js    # Alert generation
│   ├── models/                # Database (SQLite)
│   ├── routes/                # Express routes
│   ├── middleware/             # Error handling, rate limiting
│   └── server.js              # Entry point
│
├── .env.example               # Environment template
└── package.json               # Root scripts
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send message to AI assistant |
| GET | `/api/chat/history/:sessionId` | Get chat history |
| GET | `/api/weather/current?city=Mumbai` | Current weather |
| GET | `/api/weather/forecast?city=Mumbai` | 5-day forecast |
| GET | `/api/weather/hourly?city=Mumbai` | Hourly forecast |
| GET | `/api/weather/air-quality?lat=xx&lon=yy` | Air quality |
| GET | `/api/alerts?city=Mumbai` | Weather alerts |
| GET | `/api/alerts/recent` | Recent alert log |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | Node.js + Express.js |
| AI Engine | Google Gemini 2.0 Flash |
| Weather Data | OpenWeatherMap API |
| Database | SQLite (better-sqlite3) |
| Charts | Recharts |
| Maps | Leaflet.js + React-Leaflet |
| Animations | Framer Motion |
| Icons | Lucide React |

---

## 🏆 What Makes This Stand Out

1. **Context-Aware AI** — Not just an API wrapper. The AI receives real weather data and provides intelligent analysis
2. **Hallucination Prevention** — AI is grounded in actual API data, not making up numbers
3. **Interactive Weather Map** — Leaflet-based map with weather overlays
4. **Smart Disaster Alerts** — Auto-generated from weather conditions with severity classification
5. **Data Visualization** — Beautiful charts showing temperature trends and patterns
6. **Responsive Design** — Works seamlessly on desktop and mobile

---

## 👥 Team

Built for **Smart India Hackathon 2026** — Internal Hackathon Round

---

## 📄 License

MIT License — Free to use and modify
