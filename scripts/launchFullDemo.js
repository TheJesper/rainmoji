#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8080;
const fullDemoPath = path.join(__dirname, '..', 'public', 'fullDemo.html');

// Check if the file exists
if (!fs.existsSync(fullDemoPath)) {
  console.error('Full demo HTML file not found at:', fullDemoPath);
  process.exit(1);
}

// Create a simple server that serves the full demo HTML file
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  if (req.url === '/' || req.url === '/fullDemo.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(fullDemoPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Start the server
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}/fullDemo.html`;
  console.log(`🌈 Full Demo server running at ${url}`);
  
  // Open the URL in the default browser
  const commands = {
    win32: `start ${url}`,
    darwin: `open ${url}`,
    linux: `xdg-open ${url}`
  };
  
  const openCommand = commands[process.platform] || commands.linux;
  exec(openCommand, (error) => {
    if (error) {
      console.error('Could not open browser automatically. Please open the URL manually.');
    }
  });
  
  console.log("Press Ctrl+C to stop the server");
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});