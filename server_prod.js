const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const DIST_DIR = path.join(__dirname, 'client/dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Proxy /api requests to Express backend on port 5000
  if (req.url.startsWith('/api')) {
    const proxyReq = http.request({
      hostname: '127.0.0.1',
      port: 5000,
      path: req.url,
      method: req.method,
      headers: req.headers
    }, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Backend error', message: err.message }));
    });

    req.pipe(proxyReq);
    return;
  }

  // Serve static files from client/dist
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);
  let extname = path.extname(filePath).toLowerCase();

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for React SPA routing
      filePath = path.join(DIST_DIR, 'index.html');
      extname = '.html';
    }

    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
        res.end(content, 'utf-8');
      }
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Production WeatherGPT server listening on http://localhost:${PORT}`);
});
