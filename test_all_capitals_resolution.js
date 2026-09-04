import fs from 'fs';

const capitalsContent = fs.readFileSync('./frontend/src/data/capitals.ts', 'utf8');

const capitalMatches = [...capitalsContent.matchAll(/id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*country:\s*"([^"]+)",\s*continent:\s*"([^"]+)",\s*lat:\s*([\d.-]+),\s*lon:\s*([\d.-]+)/g)];
const ALL_CAPITALS = capitalMatches.map(m => ({
  id: m[1],
  name: m[2],
  country: m[3],
  lat: parseFloat(m[5]),
  lon: parseFloat(m[6])
}));

console.log(`Total World Capitals in dataset: ${ALL_CAPITALS.length}`);

function findLocationsInText(text) {
  const queryLower = text.toLowerCase();
  const matched = [];

  const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const checkPhraseInQuery = (phrase) => {
    if (!phrase || phrase.length < 3) return false;
    const pattern = new RegExp(`\\b${escapeRegExp(phrase.toLowerCase())}\\b`, 'i');
    return pattern.test(queryLower);
  };

  for (const c of ALL_CAPITALS) {
    const mainName = c.name.split('(')[0].trim();
    if (checkPhraseInQuery(mainName) || checkPhraseInQuery(c.country)) {
      if (!matched.some(m => m.id === c.id)) {
        matched.push(c);
      }
    }
  }

  return matched;
}

let correctCount = 0;
for (const c of ALL_CAPITALS) {
  const prompt = `weather in ${c.name}`;
  const matched = findLocationsInText(prompt);
  if (matched.length > 0 && matched.some(m => m.id === c.id)) {
    correctCount++;
  }
}

console.log("\n==========================================");
console.log(`WORLD CAPITALS RESOLUTION ACCURACY RESULTS:`);
console.log(`Total World Capitals Tested: ${ALL_CAPITALS.length}`);
console.log(`Correctly Resolved: ${correctCount}`);
console.log(`Accuracy Score: ${((correctCount / ALL_CAPITALS.length) * 100).toFixed(2)}%`);
console.log("==========================================\n");
