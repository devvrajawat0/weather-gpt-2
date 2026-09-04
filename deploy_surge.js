const { spawn } = require('child_process');

const surgeBin = 'C:\\Users\\HP\\nodejs\\node-v22.15.0-win-x64\\surge.cmd';
const distDir = 'C:\\Users\\HP\\.gemini\\antigravity\\scratch\\weathergpt\\client\\dist';
const domain = 'weathergpt-sih2026.surge.sh';

const child = spawn(surgeBin, [`"${distDir}"`, domain], {
  shell: true,
  env: { ...process.env, PATH: `C:\\Users\\HP\\nodejs\\node-v22.15.0-win-x64;${process.env.PATH}` }
});

child.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('[Surge Output]:', str);
  if (str.includes('email:')) {
    child.stdin.write('weathergpt.sih2026@gmail.com\n');
  }
  if (str.includes('password:')) {
    child.stdin.write('WeatherGPTPass123!\n');
  }
});

child.stderr.on('data', (data) => {
  console.error('[Surge Error]:', data.toString());
});

child.on('close', (code) => {
  console.log('[Surge Exit Code]:', code);
});
