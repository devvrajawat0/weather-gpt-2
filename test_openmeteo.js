async function testOpenMeteo() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,uv_index&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max&timezone=auto';
  try {
    const res = await fetch(url);
    console.log("OPEN-METEO STATUS:", res.status);
    if (!res.ok) {
      console.log("ERROR BODY:", await res.text());
    } else {
      const json = await res.json();
      console.log("SUCCESS! Current temp:", json.current?.temperature_2m);
    }
  } catch (err) {
    console.error("FETCH ERROR:", err);
  }
}

testOpenMeteo();
