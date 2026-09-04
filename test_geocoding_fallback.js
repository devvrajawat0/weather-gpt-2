const stopWords = new Set([
  'weather', 'forecast', 'today', 'tomorrow', 'tell', 'me', 'about', 'how', 'is',
  'what', 'will', 'it', 'rain', 'raining', 'rains', 'snow', 'snowing', 'sunny',
  'cloudy', 'hot', 'cold', 'warm', 'windy', 'humid', 'a', 'an', 'the', 'for', 'of',
  'in', 'at', 'to', 'near', 'around', 'climate', 'temperature', 'temp', 'condition',
  'conditions', 'compare', 'vs', 'and', 'please', 'give', 'info', 'information',
  'report', 'now', 'current', 'right', 'should', 'i', 'wear', 'cloth', 'clothes',
  'clothing', 'outfit', 'umbrella', 'farmer', 'agri', 'crop', 'irrigation',
  'farming', 'advice', 'advisory', 'city', 'district', 'town', 'place'
]);

function extractLocationCandidates(text) {
  const candidates = [];
  const lower = text.toLowerCase();

  // Pattern 1: Check phrases after "in", "at", "for", "near", "around", "of", "about"
  const prepMatches = lower.match(/(?:in|at|for|near|around|of|about)\s+([a-z\s]+?)(?:\s+(?:today|tomorrow|now|yesterday|forecast|weather|rain|temperature|this|next)|$)/gi);
  if (prepMatches) {
    for (const match of prepMatches) {
      const clean = match.replace(/^(in|at|for|near|around|of|about)\s+/i, '').trim();
      const filtered = clean.split(/\s+/).filter(w => !stopWords.has(w)).join(' ');
      if (filtered.length >= 2) candidates.push(filtered);
    }
  }

  // Pattern 2: Compare X and Y / X vs Y
  const compareMatch = lower.match(/(?:compare|between)\s+([a-z\s]+?)\s+(?:and|vs|with)\s+([a-z\s]+)/i);
  if (compareMatch) {
    const c1 = compareMatch[1].split(/\s+/).filter(w => !stopWords.has(w)).join(' ');
    const c2 = compareMatch[2].split(/\s+/).filter(w => !stopWords.has(w)).join(' ');
    if (c1.length >= 2) candidates.push(c1);
    if (c2.length >= 2) candidates.push(c2);
  }

  // Pattern 3: Fallback - remove all stop words and take remaining words
  if (candidates.length === 0) {
    const words = text.replace(/[^a-zA-Z\s]/g, ' ').split(/\s+/).filter(w => w.length >= 2 && !stopWords.has(w.toLowerCase()));
    if (words.length > 0) {
      candidates.push(words.join(' '));
      // Also push individual words if multi-word
      if (words.length > 1) {
        words.forEach(w => candidates.push(w));
      }
    }
  }

  return [...new Set(candidates)];
}

async function geocodeLocation(name) {
  if (!name || name.length < 2) return null;
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      const r = data.results[0];
      return {
        id: `geo-${r.id}`,
        name: r.name,
        state: r.admin1 || '',
        country: r.country || '',
        lat: r.latitude,
        lon: r.longitude,
        type: 'custom'
      };
    }
  } catch (err) {}
  return null;
}

async function test() {
  const queries = [
    "weather in gwalior",
    "is it raining in udaipur",
    "what is the weather in agra today",
    "compare gwalior and bhopal",
    "gwalior weather report",
    "clothing advice for Manali",
    "agricultural advice for Punjab",
    "how is weather in kanpur",
    "weather in jabalpur tomorrow",
    "climate of dehradun"
  ];

  for (const q of queries) {
    const candidates = extractLocationCandidates(q);
    console.log(`\nQuery: "${q}" -> Candidates:`, candidates);
    const results = [];
    for (const c of candidates) {
      const geo = await geocodeLocation(c);
      if (geo) results.push(geo.name + (geo.state ? `, ${geo.state}` : ''));
    }
    console.log(`Geocoded Locations:`, results);
  }
}

test();
