#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function getRandomPort() {
  return Math.floor(Math.random() * 1000) + 8000;
}

const port = getRandomPort();
const originalDemoPath = path.join(__dirname, '..', 'public', 'originalDemo.html');

// Create a simple HTTP server to serve the demo
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/originalDemo.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(originalDemoPath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  const url = `http://localhost:${port}/`;
  console.log(`\n🌟 Original Emoji Rain Demo running at: ${url}`);
  console.log('\nPress Ctrl+C to stop the server\n');
  
  // Open in browser
  const openCommands = [
    process.platform === 'win32' ? `start ${url}` : null,
    process.platform === 'darwin' ? `open ${url}` : null,
    `xdg-open ${url}`,
    `firefox ${url}`,
    `chrome ${url}`
  ].filter(Boolean);
  
  exec(openCommands.join(' || '));
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  server.close(() => {
    console.log('\nServer stopped.');
    process.exit(0);
  });
});