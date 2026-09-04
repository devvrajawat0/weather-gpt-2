import fs from 'fs';

// Read districts and capitals static files
const districtsContent = fs.readFileSync('./frontend/src/data/districts.ts', 'utf8');
const capitalsContent = fs.readFileSync('./frontend/src/data/capitals.ts', 'utf8');

const districtMatches = [...districtsContent.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*state:\s*"([^"]+)",\s*lat:\s*([\d.-]+),\s*lon:\s*([\d.-]+)/g)];
const ALL_DISTRICTS = districtMatches.map(m => ({
  id: m[1],
  name: m[2],
  state: m[3],
  lat: parseFloat(m[4]),
  lon: parseFloat(m[5])
}));

console.log(`Total Indian Districts in dataset: ${ALL_DISTRICTS.length}`);

const ALIASES = {
  'delhi': 'new delhi',
  'bangalore': 'bengaluru',
  'bombay': 'mumbai',
  'calcutta': 'kolkata',
  'madras': 'chennai',
  'gurgaon': 'gurugram',
  'trivandrum': 'thiruvananthapuram',
  'pondicherry': 'puducherry',
  'cochin': 'kochi',
  'baroda': 'vadodara',
  'banaras': 'varanasi',
  'kashi': 'varanasi'
};

const STOP_WORDS = new Set([
  'weather', 'forecast', 'today', 'tomorrow', 'tell', 'me', 'about', 'how', 'is',
  'what', 'will', 'it', 'rain', 'raining', 'rains', 'snow', 'snowing', 'sunny',
  'cloudy', 'hot', 'cold', 'warm', 'windy', 'humid', 'a', 'an', 'the', 'for', 'of',
  'in', 'at', 'to', 'near', 'around', 'climate', 'temperature', 'temp', 'condition',
  'conditions', 'compare', 'vs', 'and', 'please', 'give', 'info', 'information',
  'report', 'now', 'current', 'right', 'should', 'i', 'wear', 'cloth', 'clothes',
  'clothing', 'outfit', 'umbrella', 'farmer', 'agri', 'crop', 'irrigation',
  'farming', 'advice', 'advisory', 'city', 'district', 'town', 'place'
]);

function findLocationsInText(text) {
  const queryLower = text.toLowerCase();
  const matched = [];

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const checkPhraseInQuery = (phrase) => {
    if (!phrase || phrase.length < 3) return false;
    const pattern = new RegExp(`\\b${escapeRegExp(phrase.toLowerCase())}\\b`, 'i');
    if (pattern.test(queryLower)) return true;
    
    for (const [alias, canonical] of Object.entries(ALIASES)) {
      if (phrase.toLowerCase().includes(canonical) && new RegExp(`\\b${escapeRegExp(alias)}\\b`, 'i').test(queryLower)) {
        return true;
      }
    }
    return false;
  };

  const getVariations = (rawName) => {
    const variations = [rawName];
    const cleanMain = rawName.split('(')[0].trim();
    variations.push(cleanMain);

    if (rawName.includes('(')) {
      const insideParen = rawName.split('(')[1].replace(')', '').trim();
      variations.push(insideParen);
      insideParen.split('&').forEach(part => variations.push(part.trim()));
      insideParen.split(' ').forEach(part => variations.push(part.trim()));
    }

    const prefixes = ['new', 'old', 'north', 'south', 'east', 'west', 'central'];
    const parts = cleanMain.split(' ');
    if (parts.length > 1 && prefixes.includes(parts[0].toLowerCase())) {
      variations.push(parts.slice(1).join(' '));
    }

    return variations.filter(v => v && v.length >= 3);
  };

  for (const d of ALL_DISTRICTS) {
    const variations = getVariations(d.name);
    if (variations.some(v => checkPhraseInQuery(v))) {
      if (!matched.some(m => m.id === d.id)) {
        matched.push(d);
      }
    }
  }

  return matched;
}

function extractLocationCandidates(text) {
  const candidates = [];
  const lower = text.toLowerCase();

  const prepMatches = lower.match(/(?:in|at|for|near|around|of|about)\s+([a-z\s]+?)(?:\s+(?:today|tomorrow|now|yesterday|forecast|weather|rain|temperature|this|next)|$)/gi);
  if (prepMatches) {
    for (const match of prepMatches) {
      const clean = match.replace(/^(in|at|for|near|around|of|about)\s+/i, '').trim();
      const filtered = clean.split(/\s+/).filter(w => !STOP_WORDS.has(w)).join(' ');
      if (filtered.length >= 2) candidates.push(filtered);
    }
  }

  if (candidates.length === 0) {
    const words = text.replace(/[^a-zA-Z\s]/g, ' ').split(/\s+/).filter(w => w.length >= 2 && !STOP_WORDS.has(w.toLowerCase()));
    if (words.length > 0) {
      candidates.push(words.join(' '));
    }
  }

  return Array.from(new Set(candidates));
}

async function geocodeLocationOnline(name) {
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
        state: r.admin1 || r.country || '',
        lat: r.latitude,
        lon: r.longitude
      };
    }
  } catch (err) {}
  return null;
}

async function runAccuracyTest() {
  let correctCount = 0;
  let totalTested = ALL_DISTRICTS.length;

  console.log(`Starting automated resolution accuracy test for all ${totalTested} Indian Districts...\n`);

  const failedList = [];

  for (let i = 0; i < ALL_DISTRICTS.length; i++) {
    const d = ALL_DISTRICTS[i];
    const cleanQueryName = d.name.split('(')[0].trim();
    const prompt = `weather in ${cleanQueryName}`;

    // Test Resolution
    let matched = findLocationsInText(prompt);
    let isCorrect = false;

    if (matched.length > 0 && matched.some(m => m.id === d.id || m.name === d.name)) {
      isCorrect = true;
    } else {
      // Try geocoding
      const candidates = extractLocationCandidates(prompt);
      if (candidates.length > 0) {
        const geo = await geocodeLocationOnline(candidates[0]);
        if (geo && (geo.name.toLowerCase().includes(cleanQueryName.toLowerCase()) || Math.hypot(geo.lat - d.lat, geo.lon - d.lon) < 0.5)) {
          isCorrect = true;
        }
      }
    }

    if (isCorrect) {
      correctCount++;
    } else {
      failedList.push({ name: d.name, state: d.state, query: prompt });
    }

    if ((i + 1) % 50 === 0 || i === ALL_DISTRICTS.length - 1) {
      console.log(`Progress: Tested ${i + 1}/${totalTested} districts... Current Correct: ${correctCount}/${i + 1} (${((correctCount / (i + 1)) * 100).toFixed(1)}%)`);
    }
  }

  console.log("\n==========================================");
  console.log(`FINAL ACCURACY RESULTS:`);
  console.log(`Total Districts Tested: ${totalTested}`);
  console.log(`Correctly Resolved: ${correctCount}`);
  console.log(`Failed / Missed: ${failedList.length}`);
  console.log(`Accuracy Score: ${((correctCount / totalTested) * 100).toFixed(2)}%`);
  console.log("==========================================\n");

  if (failedList.length > 0) {
    console.log("Sample Failed Cases (first 10):", failedList.slice(0, 10));
  }
}

runAccuracyTest();
