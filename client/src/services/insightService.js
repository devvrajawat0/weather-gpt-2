/**
 * WeatherGPT Intelligent Weather Insights Generator
 * Converts raw weather metrics into human-actionable recommendations.
 */

export function generateWeatherInsights(weatherData, unit = 'C') {
  if (!weatherData) return null;

  const tempC = weatherData.temp_c ?? 25;
  const tempF = weatherData.temp_f ?? (tempC * 9/5 + 32);
  const displayTemp = unit === 'F' ? `${Math.round(tempF)}°F` : `${Math.round(tempC)}°C`;
  
  const condition = (weatherData.condition || '').toLowerCase();
  const humidity = weatherData.humidity || 50;
  const windKph = weatherData.wind_kph || 10;
  const uv = weatherData.uv ?? 3;
  const precipMm = weatherData.precip_mm || 0;
  const visibilityKm = weatherData.visibility_km ?? 10;
  const aqiEpa = weatherData.aqi?.us_epa_index || 1;

  // Max rain chance in next 12 hours from hourly forecast
  const maxRainChance = (weatherData.hourly || []).slice(0, 12).reduce((max, h) => Math.max(max, h.chance_of_rain || 0), 0);
  const isRaining = condition.includes('rain') || condition.includes('drizzle') || condition.includes('thunderstorm') || precipMm > 0.5;

  // 1. RAIN RISK
  let rainRisk = {
    title: 'Rain Risk',
    level: 'Low Risk',
    color: 'emerald',
    badge: `LOW (${maxRainChance}%)`,
    icon: '🌧️',
    recommendation: 'Low chance of precipitation today.',
    tip: 'Perfect for outdoor plans without an umbrella.'
  };

  if (isRaining || maxRainChance >= 75) {
    rainRisk = {
      title: 'Rain Risk',
      level: 'High / Severe',
      color: 'red',
      badge: `HIGH (${Math.max(maxRainChance, 80)}%)`,
      icon: '⛈️',
      recommendation: `Active rain or high probability (${Math.max(maxRainChance, 80)}%) expected.`,
      tip: 'Keep an umbrella and raincoat handy!'
    };
  } else if (maxRainChance >= 40) {
    rainRisk = {
      title: 'Rain Risk',
      level: 'Moderate Risk',
      color: 'amber',
      badge: `MODERATE (${maxRainChance}%)`,
      icon: '🌦️',
      recommendation: `Moderate chance of scattered rain showers (${maxRainChance}%).`,
      tip: 'Consider carrying a compact umbrella.'
    };
  } else if (maxRainChance >= 20) {
    rainRisk = {
      title: 'Rain Risk',
      level: 'Slight Chance',
      color: 'cyan',
      badge: `SLIGHT (${maxRainChance}%)`,
      icon: '🌥️',
      recommendation: `Slight rain possibility (${maxRainChance}%).`,
      tip: 'Mostly cloudy with light isolated sprinkles possible.'
    };
  }

  // 2. WHAT TO WEAR
  let wear = {
    title: 'What to Wear',
    icon: '👕',
    level: 'Casual Wear',
    color: 'cyan',
    badge: displayTemp,
    recommendation: 'Breathable Cotton T-Shirt & Trousers',
    tip: 'Comfortable everyday wear for pleasant conditions.'
  };

  if (tempC < 5) {
    wear = {
      title: 'What to Wear',
      icon: '🧥',
      level: 'Heavy Layers',
      color: 'blue',
      badge: 'COLD',
      recommendation: 'Heavy Winter Coat, Scarf & Gloves',
      tip: 'Layer up to protect against freezing weather.'
    };
  } else if (tempC < 16) {
    wear = {
      title: 'What to Wear',
      icon: '🧥',
      level: 'Light Jacket',
      color: 'indigo',
      badge: 'COOL',
      recommendation: 'Warm Sweater, Jacket or Hoodie',
      tip: 'Brisk conditions — bring a jacket when going outside.'
    };
  } else if (tempC > 32) {
    wear = {
      title: 'What to Wear',
      icon: '🕶️',
      level: 'Light & Breathable',
      color: 'orange',
      badge: 'HOT',
      recommendation: 'Linen / Cotton Wear + Sunglasses & Cap',
      tip: 'Hot weather — wear light colors and stay hydrated.'
    };
  } else if (tempC >= 25) {
    wear = {
      title: 'What to Wear',
      icon: '👕',
      level: 'Summer Outfit',
      color: 'yellow',
      badge: 'WARM',
      recommendation: 'Short Sleeve T-Shirt & Shorts / Cotton Pants',
      tip: 'Warm conditions — light breathable fabrics best.'
    };
  }

  if (isRaining || maxRainChance >= 50) {
    wear.recommendation += ' + Umbrella';
    wear.tip += ' Rain expected — wear waterproof shoes.';
  }

  // 3. OUTDOOR ACTIVITY
  let outdoor = {
    title: 'Outdoor Activity',
    icon: '🏃',
    level: 'Excellent',
    color: 'emerald',
    badge: 'IDEAL',
    recommendation: 'Great time for a run, walk, or outdoor sports!',
    tip: `Favorable ${displayTemp} temperature and light winds.`
  };

  if (isRaining || maxRainChance >= 70) {
    outdoor = {
      title: 'Outdoor Activity',
      icon: '🌧️',
      level: 'Not Recommended',
      color: 'red',
      badge: 'INDOOR PREFERRED',
      recommendation: 'Indoor workouts & gym activities preferred.',
      tip: 'Wet surfaces increase slip hazards outdoors.'
    };
  } else if (tempC > 35 || uv >= 9) {
    outdoor = {
      title: 'Outdoor Activity',
      icon: '⚠️',
      level: 'Exercise Caution',
      color: 'amber',
      badge: 'HEAT ADVISORY',
      recommendation: 'Schedule workouts early morning or after sunset.',
      tip: 'High heat & intense UV increase dehydration risk.'
    };
  } else if (aqiEpa >= 4) {
    outdoor = {
      title: 'Outdoor Activity',
      icon: '😷',
      level: 'Poor Air Quality',
      color: 'purple',
      badge: 'HIGH POLLUTION',
      recommendation: 'Limit strenuous outdoor workouts.',
      tip: 'Air pollution elevated — indoor cardio safer.'
    };
  }

  // 4. UV SAFETY
  let uvInsight = {
    title: 'UV Sun Safety',
    icon: '☀️',
    level: `Low (UV ${uv})`,
    color: 'emerald',
    badge: 'SAFE',
    recommendation: 'Minimal UV sun protection required.',
    tip: 'Low risk of sun damage.'
  };

  if (uv >= 10) {
    uvInsight = {
      title: 'UV Sun Safety',
      icon: '🚨',
      level: `Extreme (UV ${uv})`,
      color: 'red',
      badge: 'EXTREME RISK',
      recommendation: 'Apply SPF 50+ sunscreen, wear hat & sunglasses.',
      tip: 'Avoid direct sun exposure between 11 AM - 4 PM.'
    };
  } else if (uv >= 7) {
    uvInsight = {
      title: 'UV Sun Safety',
      icon: '☀️',
      level: `Very High (UV ${uv})`,
      color: 'orange',
      badge: 'VERY HIGH',
      recommendation: 'Wear sunglasses, wide-brim hat & SPF 30+ sunscreen.',
      tip: 'Skin can burn quickly without sun protection.'
    };
  } else if (uv >= 5) {
    uvInsight = {
      title: 'UV Sun Safety',
      icon: '🕶️',
      level: `Moderate (UV ${uv})`,
      color: 'amber',
      badge: 'MODERATE',
      recommendation: 'Apply sunscreen if spending >30 mins outside.',
      tip: 'Wear UV-blocking sunglasses.'
    };
  }

  // 5. AIR QUALITY
  let aqiInsight = {
    title: 'Air Quality (AQI)',
    icon: '🌬️',
    level: weatherData.aqi?.category || 'Good (EPA 1)',
    color: weatherData.aqi?.badge_color || 'emerald',
    badge: `EPA ${aqiEpa}/6`,
    recommendation: 'Clean & fresh air quality in your region.',
    tip: 'Great for breathing and outdoor activities.'
  };

  if (aqiEpa === 2) {
    aqiInsight = {
      title: 'Air Quality (AQI)',
      icon: '🌬️',
      level: 'Moderate (EPA 2)',
      color: 'amber',
      badge: 'MODERATE',
      recommendation: 'Acceptable air quality for most individuals.',
      tip: 'Unusually sensitive individuals should monitor outdoor time.'
    };
  } else if (aqiEpa === 3) {
    aqiInsight = {
      title: 'Air Quality (AQI)',
      icon: '😷',
      level: 'Unhealthy Sensitive',
      color: 'orange',
      badge: 'EPA 3',
      recommendation: 'Sensitive groups should consider an N95 mask.',
      tip: 'Reduce prolonged heavy outdoor exertion.'
    };
  } else if (aqiEpa >= 4) {
    aqiInsight = {
      title: 'Air Quality (AQI)',
      icon: '🚨',
      level: `Unhealthy (EPA ${aqiEpa})`,
      color: 'red',
      badge: 'POLLUTED',
      recommendation: 'Air pollution elevated. Wear N95 mask outdoors.',
      tip: 'Keep windows closed and run air purifiers.'
    };
  }

  // 6. TRAVEL CONDITIONS
  let travel = {
    title: 'Travel & Driving',
    icon: '🚗',
    level: 'Good Conditions',
    color: 'emerald',
    badge: 'CLEAR ROADS',
    recommendation: 'Clear visibility & normal road driving safety.',
    tip: 'Favorable conditions for commuting and long drives.'
  };

  if (visibilityKm < 2 || condition.includes('fog') || condition.includes('mist') || condition.includes('haze')) {
    travel = {
      title: 'Travel & Driving',
      icon: '🌫️',
      level: 'Low Visibility Warning',
      color: 'amber',
      badge: 'FOG / HAZE',
      recommendation: 'Drive with low-beam fog lights and reduced speed.',
      tip: `Visibility reduced to ${visibilityKm.toFixed(1)} km.`
    };
  } else if (windKph > 40) {
    travel = {
      title: 'Travel & Driving',
      icon: '💨',
      level: 'High Wind Advisory',
      color: 'amber',
      badge: `${Math.round(windKph)} KM/H WIND`,
      recommendation: 'Hold steering wheel firmly; watch for debris.',
      tip: 'Strong crosswinds affecting high-profile vehicles.'
    };
  } else if (isRaining) {
    travel = {
      title: 'Travel & Driving',
      icon: '🌧️',
      level: 'Slippery Road Warning',
      color: 'orange',
      badge: 'WET ROADS',
      recommendation: 'Maintain extra braking distance from other vehicles.',
      tip: 'Wet pavement reduces tire traction.'
    };
  }

  return {
    rainRisk,
    wear,
    outdoor,
    uvInsight,
    aqiInsight,
    travel
  };
}
