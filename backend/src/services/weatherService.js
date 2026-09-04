import fetch from 'node-fetch';
import NodeCache from 'node-cache';

// Initialize cache with 15-minute TTL (900 seconds)
const cache = new NodeCache({ stdTTL: 900, checkperiod: 120 });

/**
 * WMO Weather Interpretation Codes mapping
 */
export const WMO_CODES = {
  0: { label: "Clear Sky", icon: "sun", category: "sunny" },
  1: { label: "Mainly Clear", icon: "sun-cloud", category: "sunny" },
  2: { label: "Partly Cloudy", icon: "cloud-sun", category: "cloudy" },
  3: { label: "Overcast", icon: "cloud", category: "cloudy" },
  45: { label: "Fog", icon: "fog", category: "foggy" },
  48: { label: "Depositing Rime Fog", icon: "fog", category: "foggy" },
  51: { label: "Light Drizzle", icon: "rain-light", category: "rainy" },
  53: { label: "Moderate Drizzle", icon: "rain-light", category: "rainy" },
  55: { label: "Dense Drizzle", icon: "rain-heavy", category: "rainy" },
  61: { label: "Slight Rain", icon: "rain", category: "rainy" },
  63: { label: "Moderate Rain", icon: "rain", category: "rainy" },
  65: { label: "Heavy Rain", icon: "rain-heavy", category: "rainy" },
  71: { label: "Slight Snow", icon: "snow", category: "snowy" },
  73: { label: "Moderate Snow", icon: "snow", category: "snowy" },
  75: { label: "Heavy Snow", icon: "snow-heavy", category: "snowy" },
  80: { label: "Slight Rain Showers", icon: "rain-showers", category: "rainy" },
  81: { label: "Moderate Rain Showers", icon: "rain-showers", category: "rainy" },
  82: { label: "Violent Rain Showers", icon: "rain-heavy", category: "stormy" },
  95: { label: "Thunderstorm", icon: "thunderstorm", category: "stormy" },
  96: { label: "Thunderstorm with Slight Hail", icon: "thunderstorm", category: "stormy" },
  99: { label: "Thunderstorm with Heavy Hail", icon: "thunderstorm", category: "stormy" },
};

export async function getWeatherData(lat, lon) {
  const cacheKey = `weather_${parseFloat(lat).toFixed(2)}_${parseFloat(lon).toFixed(2)}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return { ...cachedData, cached: true };
  }

  try {
    // 1. Fetch Forecast Data from Open-Meteo
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto`;

    const forecastRes = await fetch(forecastUrl);
    if (!forecastRes.ok) {
      throw new Error(`Forecast API HTTP status ${forecastRes.status}`);
    }
    const forecastRaw = await forecastRes.json();

    // 2. Fetch Air Quality Data from Open-Meteo Air Quality API
    let aqiRaw = null;
    try {
      const aqiUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,european_aqi,us_aqi`;
      const aqiRes = await fetch(aqiUrl);
      if (aqiRes.ok) {
        aqiRaw = await aqiRes.json();
      }
    } catch (e) {
      console.warn("AQI fetch failed, proceeding with null AQI:", e.message);
    }

    // Process & Structure Weather Data
    const current = forecastRaw.current || {};
    const daily = forecastRaw.daily || {};
    const hourly = forecastRaw.hourly || {};
    const aqiCurrent = aqiRaw?.current || {};

    const weatherCode = current.weather_code ?? 0;
    const weatherMeta = WMO_CODES[weatherCode] || { label: "Clear", icon: "sun", category: "sunny" };

    // Format 7-day forecast
    const dailyForecast = [];
    if (daily.time && Array.isArray(daily.time)) {
      for (let i = 0; i < daily.time.length; i++) {
        const code = daily.weather_code ? daily.weather_code[i] : 0;
        dailyForecast.push({
          date: daily.time[i],
          maxTemp: daily.temperature_2m_max ? daily.temperature_2m_max[i] : null,
          minTemp: daily.temperature_2m_min ? daily.temperature_2m_min[i] : null,
          weatherCode: code,
          condition: WMO_CODES[code]?.label || "Clear",
          precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
          precipProbability: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
          uvMax: daily.uv_index_max ? daily.uv_index_max[i] : null,
          sunrise: daily.sunrise ? daily.sunrise[i] : null,
          sunset: daily.sunset ? daily.sunset[i] : null,
        });
      }
    }

    // Format 24-hour forecast
    const hourlyForecast = [];
    if (hourly.time && Array.isArray(hourly.time)) {
      const nowIdx = 0;
      const next24 = hourly.time.slice(nowIdx, nowIdx + 24);
      for (let i = 0; i < next24.length; i++) {
        const code = hourly.weather_code ? hourly.weather_code[i] : 0;
        hourlyForecast.push({
          time: next24[i],
          temp: hourly.temperature_2m ? hourly.temperature_2m[i] : null,
          humidity: hourly.relative_humidity_2m ? hourly.relative_humidity_2m[i] : null,
          precipProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] : 0,
          uv: hourly.uv_index ? hourly.uv_index[i] : 0,
          weatherCode: code,
          condition: WMO_CODES[code]?.label || "Clear"
        });
      }
    }

    // Process AQI
    const usAqi = aqiCurrent.us_aqi || Math.round((aqiCurrent.pm2_5 || 0) * 4);
    let aqiLabel = "Good";
    let aqiSeverity = "green";
    if (usAqi > 300) { aqiLabel = "Hazardous"; aqiSeverity = "purple"; }
    else if (usAqi > 200) { aqiLabel = "Very Unhealthy"; aqiSeverity = "red"; }
    else if (usAqi > 150) { aqiLabel = "Unhealthy"; aqiSeverity = "red"; }
    else if (usAqi > 100) { aqiLabel = "Unhealthy for Sensitive Groups"; aqiSeverity = "orange"; }
    else if (usAqi > 50) { aqiLabel = "Moderate"; aqiSeverity = "yellow"; }

    const formattedData = {
      latitude: forecastRaw.latitude,
      longitude: forecastRaw.longitude,
      elevation: forecastRaw.elevation,
      timezone: forecastRaw.timezone,
      current: {
        temp: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        windDirection: current.wind_direction_10m,
        windGusts: current.wind_gusts_10m,
        pressure: current.surface_pressure,
        precipitation: current.precipitation || 0,
        isDay: current.is_day === 1,
        weatherCode,
        condition: weatherMeta.label,
        category: weatherMeta.category,
        uvIndex: daily.uv_index_max ? daily.uv_index_max[0] : 0,
        sunrise: daily.sunrise ? daily.sunrise[0] : null,
        sunset: daily.sunset ? daily.sunset[0] : null,
      },
      aqi: {
        usAqi,
        europeanAqi: aqiCurrent.european_aqi || null,
        label: aqiLabel,
        severity: aqiSeverity,
        pm2_5: aqiCurrent.pm2_5 || null,
        pm10: aqiCurrent.pm10 || null,
        no2: aqiCurrent.nitrogen_dioxide || null,
        so2: aqiCurrent.sulphur_dioxide || null,
        o3: aqiCurrent.ozone || null,
        co: aqiCurrent.carbon_monoxide || null
      },
      daily: dailyForecast,
      hourly: hourlyForecast,
      fetchedAt: new Date().toISOString()
    };

    cache.set(cacheKey, formattedData);
    return { ...formattedData, cached: false };
  } catch (err) {
    console.error("Error fetching weather data:", err);
    throw err;
  }
}
