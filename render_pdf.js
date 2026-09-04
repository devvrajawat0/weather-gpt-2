import { execSync } from 'child_process';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const htmlPath = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\WeatherGPT\\SIH26068_WeatherGPT_AwardWinning_SIHLogo.html';
const pdfPath = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\WeatherGPT\\SIH26068_WeatherGPT_AwardWinning_SIHLogo.pdf';

console.log('Rendering PDF...');
const cmd = `"${edgePath}" --headless --no-sandbox --disable-gpu --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;
console.log('Running:', cmd);

try {
  execSync(cmd, { stdio: 'inherit' });
  if (fs.existsSync(pdfPath)) {
    console.log(`SUCCESS! Generated ${pdfPath} (${fs.statSync(pdfPath).size} bytes)`);
  } else {
    console.error('PDF file not found after command execution!');
  }
} catch (err) {
  console.error('Error generating PDF:', err);
}
