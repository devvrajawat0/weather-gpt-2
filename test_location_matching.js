import fs from 'fs';

const districtsContent = fs.readFileSync('./frontend/src/data/districts.ts', 'utf8');
const capitalsContent = fs.readFileSync('./frontend/src/data/capitals.ts', 'utf8');

const districtMatches = [...districtsContent.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);
const capitalMatches = [...capitalsContent.matchAll(/name:\s*"([^"]+)"/g)].map(m => m[1]);

const INDIAN_DISTRICTS = districtMatches.map((name, i) => ({ id: `d-${i}`, name }));
const WORLD_CAPITALS = capitalMatches.map((name, i) => ({ id: `c-${i}`, name }));

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
  'banaras': 'varanasi'
};

function findLocationsInText(text) {
  const queryLower = text.toLowerCase();
  const matched = [];

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const checkPhraseInQuery = (phrase) => {
    if (!phrase || phrase.length < 3) return false;
    // Check direct regex word boundary match
    const pattern = new RegExp(`\\b${escapeRegExp(phrase.toLowerCase())}\\b`, 'i');
    if (pattern.test(queryLower)) return true;
    
    // Check aliases
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

    // Handle direction/prefix variations (e.g. "New Delhi" -> "Delhi", "North Goa" -> "Goa")
    const prefixes = ['new', 'old', 'north', 'south', 'east', 'west', 'central'];
    const parts = cleanMain.split(' ');
    if (parts.length > 1 && prefixes.includes(parts[0].toLowerCase())) {
      variations.push(parts.slice(1).join(' '));
    }

    return variations.filter(v => v && v.length >= 3);
  };

  // 1. Check Indian districts & cities
  for (const d of INDIAN_DISTRICTS) {
    const variations = getVariations(d.name);
    if (variations.some(v => checkPhraseInQuery(v))) {
      if (!matched.some(m => m.id === d.id)) {
        matched.push(d);
      }
    }
  }

  // 2. Check World Capitals
  for (const c of WORLD_CAPITALS) {
    const variations = getVariations(c.name);
    if (variations.some(v => checkPhraseInQuery(v))) {
      if (!matched.some(m => m.id === c.id)) {
        matched.push(c);
      }
    }
  }

  return matched;
}

const testQueries = [
  "Will it rain in Delhi tomorrow?",
  "What is the weather in Bangalore?",
  "What is the weather in Manali?",
  "Compare weather in Mumbai and Tokyo",
  "How is the weather in Shimla?",
  "Rain in Jaipur?",
  "What should I wear in London?",
  "bhopal weather",
  "tell me about indore",
  "how is weather in goa"
];

for (const q of testQueries) {
  const locs = findLocationsInText(q);
  console.log(`Query: "${q}" -> Matched:`, locs.map(l => l.name));
}
