/**
 * IMD & Severe Weather Alert Engine
 * Evaluates live weather data and synthesizes color-coded severe weather warnings.
 */

export function generateSevereAlerts(weatherData, locationInfo = {}) {
  const alerts = [];
  const current = weatherData?.current || {};
  const daily = weatherData?.daily || [];
  const aqi = weatherData?.aqi || {};
  const state = locationInfo.state || locationInfo.country || "";
  const name = locationInfo.name || "Location";

  const maxTempToday = daily[0]?.maxTemp || current.temp || 25;
  const windSpeed = current.windSpeed || 0;
  const precipToday = daily[0]?.precipitationSum || current.precipitation || 0;
  const usAqi = aqi.usAqi || 0;

  // 1. HEATWAVE WARNING (IMD Criteria: Temp > 40°C in plains or > 30°C in hills)
  if (maxTempToday >= 45) {
    alerts.push({
      id: `alert-hw-red-${Date.now()}`,
      title: "RED ALERT: Extreme Heatwave Warning",
      severity: "red",
      category: "Heatwave",
      source: "IMD (India Meteorological Department) Bulletin",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: `Severe heatwave conditions expected with temperatures reaching ${maxTempToday}°C.`,
      description: `Maximum temperature is predicted to cross ${maxTempToday}°C. Extremely high risk of heat illness and heat stroke for all age groups. High vulnerability for infants, elderly, and outdoor workers.`,
      instructions: [
        "Avoid heat exposure between 11:00 AM and 4:00 PM.",
        "Drink sufficient water even if not thirsty. Consume ORS, lassi, or lemon water.",
        "Wear lightweight, light-colored, loose cotton clothes.",
        "Keep animals in shade and provide plenty of water."
      ]
    });
  } else if (maxTempToday >= 40) {
    alerts.push({
      id: `alert-hw-orange-${Date.now()}`,
      title: "ORANGE ALERT: Heatwave Warning",
      severity: "orange",
      category: "Heatwave",
      source: "IMD Weather Advisory",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: `Heatwave conditions likely in isolated pockets with max temp around ${maxTempToday}°C.`,
      description: `High temperatures can lead to heat cramps and dehydration. Take precautions during peak outdoor afternoon hours.`,
      instructions: [
        "Stay hydrated and avoid direct sunlight during peak hours.",
        "Cover head with a cloth, hat, or umbrella when stepping outside.",
        "Avoid strenuous outdoor activities in peak afternoon."
      ]
    });
  }

  // 2. HEAVY RAINFALL & FLOOD WATCH (IMD Criteria)
  if (precipToday >= 64.5 || current.precipitation >= 30) {
    alerts.push({
      id: `alert-rain-red-${Date.now()}`,
      title: "RED ALERT: Heavy to Very Heavy Rainfall Warning",
      severity: "red",
      category: "Flood & Heavy Rain",
      source: "IMD Severe Weather Watch",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: `Heavy to extremely heavy rainfall (${precipToday}mm) forecast with potential flash flooding.`,
      description: `Widespread heavy precipitation predicted. High likelihood of waterlogging in low-lying areas, traffic disruption, and river overflow.`,
      instructions: [
        "Avoid travelling through flooded or waterlogged roadways.",
        "Keep emergency lighting and mobile phones fully charged.",
        "Stay updated via local disaster management updates."
      ]
    });
  } else if (precipToday >= 20) {
    alerts.push({
      id: `alert-rain-yellow-${Date.now()}`,
      title: "YELLOW ALERT: Moderate Rainfall Advisory",
      severity: "yellow",
      category: "Heavy Rain",
      source: "IMD Regional Weather Advisory",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: `Moderate rain showers (${precipToday}mm) expected during the day.`,
      description: `Rainfall may cause localized waterlogging and slippery roads. Drive with caution.`,
      instructions: [
        "Carry rain gear and umbrella.",
        "Drive carefully and maintain safe braking distance."
      ]
    });
  }

  // 3. SEVERE THUNDERSTORM & CYCLONIC WIND
  if (windSpeed >= 50) {
    alerts.push({
      id: `alert-wind-orange-${Date.now()}`,
      title: "ORANGE ALERT: Squally Wind & Thunderstorm Alert",
      severity: "orange",
      category: "Thunderstorm / Wind",
      source: "IMD Squall Warning",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: `Gale/Squally winds up to ${windSpeed} km/h with lightning strikes expected.`,
      description: `High-speed winds may cause damage to temporary structures, unfastened tin roofs, and uproot tree branches.`,
      instructions: [
        "Stay indoors away from windows during squally winds.",
        "Do not take shelter under trees or weak metal frames during lightning."
      ]
    });
  } else if (current.weatherCode >= 95) {
    alerts.push({
      id: `alert-storm-yellow-${Date.now()}`,
      title: "YELLOW ALERT: Thunderstorm & Lightning Watch",
      severity: "yellow",
      category: "Thunderstorm",
      source: "IMD Thunderstorm Bulletin",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: `Thunderstorm with gusty winds and lightning activity reported in the region.`,
      description: `Localized lightning hazards possible. Disconnect sensitive electronic gear.`,
      instructions: [
        "Seek sturdy shelter if thunder roars.",
        "Avoid open fields and high elevated structures."
      ]
    });
  }

  // 4. SEVERE AIR POLLUTION ALERT
  if (usAqi >= 200) {
    alerts.push({
      id: `alert-aqi-red-${Date.now()}`,
      title: "RED ALERT: Severe Air Quality Advisory (AQI " + usAqi + ")",
      severity: "red",
      category: "Air Quality",
      source: "CPCB / Global AQI Monitoring",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: `Air quality has reached Severe levels (US AQI: ${usAqi}).`,
      description: `Respiratory hazard for all individuals. High concentration of particulate matter (PM2.5/PM10).`,
      instructions: [
        "Wear N95/FFP2 masks outdoors.",
        "Avoid morning and evening outdoor cardio or running.",
        "Use air purifiers indoors where possible."
      ]
    });
  }

  // If no severe alerts triggered, return a GREEN status
  if (alerts.length === 0) {
    alerts.push({
      id: `alert-green-normal-${Date.now()}`,
      title: "GREEN: Normal Weather Conditions",
      severity: "green",
      category: "General",
      source: "IMD / Meteorological Service Bulletin",
      issuedAt: new Date().toISOString(),
      location: `${name}, ${state}`,
      headline: "No severe weather warnings active for this region.",
      description: "Weather parameters are within normal safe range. Enjoy your day!",
      instructions: ["Standard daily activities can proceed without weather disruption."]
    });
  }

  return alerts;
}
