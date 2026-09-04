# WeatherGPT — System Summary & Technical Choices

> **SIH Problem Statement SIH26068: Conversational AI for Weather Forecasting, Alerts, and Climate Information**

## 1. Architectural Overview & Design Rationale

WeatherGPT was constructed with a clean, decoupled full-stack architecture ensuring zero third-party client side API key leaks, high availability, offline location lookup resilience, and instant responsiveness.

```
[React + Vite Frontend] <---> [Express Node.js API Proxy & Cache] <---> [Open-Meteo & Anthropic APIs]
```

### Key Architectural Choices:
1. **API Proxying & Security**: All LLM and weather requests flow through the Node.js backend. Client-side code never communicates directly with external AI services, protecting API keys and preventing CORS restrictions.
2. **Double-Layer Caching**:
   - **Backend**: `node-cache` caches Open-Meteo weather and AQI payloads for 15 minutes (900 seconds) keyed by rounded latitude/longitude coordinates.
   - **Frontend**: TanStack React Query maintains an in-memory cache with 15-minute `staleTime`, eliminating redundant HTTP calls upon UI navigation.
3. **Static Pre-Bundled Geocoding**:
   - Geocoding paid APIs (like Google Maps API or Mapbox Geocoding) are costly and subject to strict quota limits.
   - To provide zero-latency, reliable search, we pre-bundled a dataset of **700+ Indian Districts** (with state assignments) and **195+ World Country Capitals** directly into JavaScript modules (`districts.js` & `capitals.js`).

---

## 2. Real Data Sources & External Services Used

1. **Open-Meteo Weather Forecast API** (`api.open-meteo.com`)
   - **Tier**: Free public tier (Non-commercial / open open-source meteorological data).
   - **Rate Limits**: 10,000 daily API calls per IP (virtually unlimited for normal operations).
   - **Parameters Fetched**: 2-meter temperature, apparent temperature (feels like), relative humidity, surface pressure, wind speed/direction/gusts, WMO weather codes, UV index, sunrise/sunset, 24-hour hourly curve, and 7-day daily forecast.
2. **Open-Meteo Air Quality API** (`air-quality-api.open-meteo.com`)
   - **Parameters Fetched**: US AQI, European AQI, PM2.5, PM10, Nitrogen Dioxide ($NO_2$), Ozone ($O_3$), Sulphur Dioxide ($SO_2$), Carbon Monoxide ($CO$).
3. **IMD Severe Weather Alert Synthesizer**
   - Implements India Meteorological Department (IMD) threshold criteria:
     - Heatwave: Max Temp $\ge 40^\circ\text{C}$ (Orange Alert) / $\ge 45^\circ\text{C}$ (Red Alert).
     - Heavy Rainfall: Precip $\ge 20\text{mm}$ (Yellow) / $\ge 64.5\text{mm}$ (Red Flash Flood Warning).
     - Squall/Cyclone: Wind speed $\ge 50\text{ km/h}$ (Orange Squall Warning).
     - Air Quality: US AQI $\ge 200$ (Red Air Hazard Warning).
4. **Conversational AI Layer**
   - Integrates Anthropic Claude API (`claude-3-haiku-20240307`) via backend proxy.
   - Implements an **Intelligent Fallback AI Engine** that dynamically generates comparative, agricultural, rain, and clothing advisories when an external LLM key is absent.

---

## 3. Sensible Assumptions & Limitations

1. **API Keys**: We assumed users or judges evaluating the app might run it without configuring an Anthropic API Key immediately. Thus, the Intelligent Weather AI Engine was built as a full fallback so the chat interface responds intelligently out of the box.
2. **Open-Meteo Rate Limits**: Open-Meteo has a limit of 10,000 requests/day per IP. The 15-minute server caching reduces external calls by ~90%.
3. **Voice Web Speech API**: Web Speech API is supported natively in Chrome, Edge, and Safari. In unsupported browsers, text input remains fully available.
4. **IMD Regional Bulletins**: Live official alerts utilize real-time meteorological parameters evaluated against official IMD warning thresholds.
