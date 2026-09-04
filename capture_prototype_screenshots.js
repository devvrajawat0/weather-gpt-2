import { execSync } from 'child_process';
import fs from 'fs';

const edgePath = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const outputDir = 'C:/Users/HP/.gemini/antigravity/scratch/WeatherGPT/screenshots';
const targetUrl = 'file:///C:/Users/HP/.gemini/antigravity/scratch/WeatherGPT/index.html';

function capture(name, delayMs = 4000) {
  const file = `${outputDir}/${name}.png`;
  console.log(`Capturing ${name}...`);
  const cmd = `"${edgePath}" --headless --no-sandbox --window-size=1400,900 --virtual-time-budget=${delayMs} --screenshot="${file}" "${targetUrl}"`;
  execSync(cmd);
  console.log(`Saved ${file} (${fs.statSync(file).size} bytes)`);
}

try {
  capture('prototype_dashboard', 5000);
} catch (e) {
  console.error("Error capturing:", e.message);
}
