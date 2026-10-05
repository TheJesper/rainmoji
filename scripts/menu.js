#!/usr/bin/env node

const readline = require('readline');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Set up readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// ANSI color codes for gradient
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  magenta: "\x1b[35m",
  red: "\x1b[31m"
};

// Gradient colors array for text
const gradientColors = [
  colors.magenta,
  colors.red,
  colors.yellow,
  colors.green,
  colors.cyan,
  colors.blue
];

// ASCII art for the "EMOJI RAIN" header
const asciiArt = [
  "███████╗███╗   ███╗ ██████╗      ██╗██╗    ██████╗  █████╗ ██╗███╗   ██╗",
  "██╔════╝████╗ ████║██╔═══██╗     ██║██║    ██╔══██╗██╔══██╗██║████╗  ██║",
  "█████╗  ██╔████╔██║██║   ██║     ██║██║    ██████╔╝███████║██║██╔██╗ ██║",
  "██╔══╝  ██║╚██╔╝██║██║   ██║██   ██║██║    ██╔══██╗██╔══██║██║██║╚██╗██║",
  "███████╗██║ ╚═╝ ██║╚██████╔╝╚█████╔╝██║    ██║  ██║██║  ██║██║██║ ╚████║",
  "╚══════╝╚═╝     ╚═╝ ╚═════╝  ╚════╝ ╚═╝    ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝"
];

// Menu items configuration
const menuItems = [
  {
    key: '1',
    icon: '🌟',
    title: 'Original CSS Demo',
    description: 'The fast CSS-animated demo with parallax effects',
    command: 'npm run original-demo-direct',
    blocking: true
  },
  {
    key: '2',
    icon: '🎯',
    title: 'React Demo',
    description: 'The React-based emoji rain demo',
    command: 'npm run demo',
    blocking: true
  },
  {
    key: '3',
    icon: '💻',
    title: 'Development Server',
    description: 'Start development mode with hot reloading',
    command: 'npm start',
    blocking: true
  },
  {
    key: '4',
    icon: '🏗️',
    title: 'Build Production',
    description: 'Create optimized bundle for distribution',
    command: 'npm run build',
    blocking: false
  },
  {
    key: '5',
    icon: '🧹',
    title: 'Lint Code',
    description: 'Check code quality and style issues',
    command: 'npm run lint',
    blocking: false
  },
  {
    key: '6',
    icon: '🔍',
    title: 'View Configuration',
    description: 'Display current emoji and parallax configuration',
    action: viewConfig
  },
  {
    key: '7',
    icon: '📦',
    title: 'Install Dependencies',
    description: 'Install all required npm packages',
    command: 'npm install',
    blocking: false
  },
  {
    key: '8',
    icon: '🎨',
    title: 'Widget Generator Demo',
    description: 'Interactive widget generator & code exporter',
    command: 'npm run widget-demo',
    blocking: true
  },
  {
    key: '9',
    icon: '📄',
    title: 'Z-Index Demo',
    description: 'Test emoji layering with interactive z-index controls',
    command: 'npm run z-index-demo',
    blocking: true
  },
  {
    key: 'A',
    icon: '📦',
    title: 'Build Widget',
    description: 'Build standalone widget for CDN distribution',
    command: 'npm run build:widget',
    blocking: false
  },
  {
    key: 'B',
    icon: '🚀',
    title: 'Build All',
    description: 'Build React component + standalone widget',
    command: 'npm run build:all',
    blocking: false
  },
  {
    key: 'C',
    icon: '📖',
    title: 'View Documentation',
    description: 'Open project README',
    action: openReadme
  },
  {
    key: 'D',
    icon: '🔄',
    title: 'Clean & Rebuild',
    description: 'Remove dist folder and rebuild',
    action: cleanAndRebuild
  },
  {
    key: 'Q',
    icon: '❌',
    title: 'Exit',
    description: 'Close the menu',
    action: exitMenu
  }
];

// Helper functions
function getRandomPort() {
  return Math.floor(Math.random() * 1000) + 8000;
}

// Apply gradient to text
function applyGradient(text) {
  let result = '';
  const charCount = text.length;
  
  for (let i = 0; i < charCount; i++) {
    const colorIndex = Math.floor((i / charCount) * gradientColors.length);
    result += gradientColors[colorIndex] + text[i];
  }
  
  return result + colors.reset;
}

// Apply gradient to ASCII art
function renderGradientAscii() {
  console.log('\n');
  asciiArt.forEach(line => {
    console.log(applyGradient(line));
  });
  console.log('\n');
}

// Render menu item with color and formatting
function renderMenuItem(item) {
  const keyPart = `${colors.bright}${colors.cyan}[${item.key}]${colors.reset}`;
  const iconPart = `${item.icon}`;
  const titlePart = `${colors.bright}${item.title}${colors.reset}`;
  console.log(`  ${keyPart} ${iconPart} ${titlePart}`);
  console.log(`      ${item.description}`);
  console.log('');
}

function runOriginalDemo() {
  console.log('\n🌟 Launching Original CSS Demo...\n');
  
  // Create a simple HTTP server to serve the demo
  const http = require('http');
  const port = getRandomPort();
  const originalDemoPath = path.join(__dirname, '..', 'public', 'originalDemo.html');
  
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
    console.log(`${colors.bright}${colors.green}🌟 Original Demo running at: ${url}${colors.reset}`);
    console.log('\nPress Ctrl+C to stop the server and return to menu\n');
    
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
      console.log('\nServer stopped. Returning to menu...');
      setTimeout(() => {
        pauseAndContinue('Press Enter to return to menu...');
      }, 1000);
    });
  });
}

function viewConfig() {
  console.clear();
  console.log(`\n${colors.bright}${colors.cyan}📋 Current Configuration:${colors.reset}\n`);
  
  try {
    const configPath = path.join(__dirname, '..', 'src', 'config', 'parallaxConfig.js');
    const packagePath = path.join(__dirname, '..', 'package.json');
    
    console.log(`${colors.bright}${colors.green}🎯 Parallax Config:${colors.reset}`);
    console.log('─'.repeat(48));
    const configContent = fs.readFileSync(configPath, 'utf8');
    const match = configContent.match(/defaultEmojis:\s*\[(.*?)\]/s);
    if (match) {
      console.log(`Default Emojis: ${match[1]}`);
    }
    console.log('\nLayer Properties:');
    console.log('  • Front Layer: Large, slow, blurred');
    console.log('  • Middle Layer: Medium size, medium speed');
    console.log('  • Back Layer: Small, fast, blurred');
    
    console.log(`\n${colors.bright}${colors.green}📦 Package Info:${colors.reset}`);
    console.log('─'.repeat(48));
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`Name: ${packageJson.name}`);
    console.log(`Version: ${packageJson.version}`);
    console.log(`Author: ${packageJson.author}`);
    console.log(`License: ${packageJson.license}`);
    
  } catch (error) {
    console.error(`${colors.red}Error reading configuration:${colors.reset}`, error.message);
  }
  
  pauseAndContinue('Press Enter to return to menu...');
}

function openReadme() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  const openCommands = [
    process.platform === 'win32' ? `start ${readmePath}` : null,
    process.platform === 'darwin' ? `open ${readmePath}` : null,
    `xdg-open ${readmePath}`,
    `code ${readmePath}`,
    `cat ${readmePath}`
  ].filter(Boolean);
  
  executeCommand(openCommands.join(' || '), '📖 Opening README');
}

function cleanAndRebuild() {
  console.log(`\n${colors.bright}${colors.yellow}🔄 Cleaning and rebuilding...${colors.reset}\n`);
  
  const commands = [
    'rm -rf dist || rmdir /s /q dist',
    'npm run build'
  ];
  
  executeSequentially(commands, () => {
    console.log(`\n${colors.bright}${colors.green}✅ Clean and rebuild complete!${colors.reset}`);
    pauseAndContinue('Press Enter to return to menu...');
  });
}

function exitMenu() {
  console.log(`\n${colors.bright}${colors.cyan}👋 Thanks for using Emoji Rain! Goodbye!${colors.reset}\n`);
  rl.close();
  process.exit(0);
}

function executeCommand(command, description) {
  console.log(`\n${colors.bright}${colors.yellow}${description}...${colors.reset}\n`);
  
  const proc = exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`${colors.bright}${colors.red}Error: ${error.message}${colors.reset}`);
      pauseAndContinue('Press Enter to return to menu...');
      return;
    }
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`${colors.bright}${colors.yellow}Warning: ${stderr}${colors.reset}`);
    }
    
    if (stdout) {
      console.log(stdout);
    }
    
    // For non-blocking commands, return to menu after pause
    if (!command.includes('serve') && !command.includes('start')) {
      pauseAndContinue('Command completed. Press Enter to return to menu...');
    }
  });
  
  // Show real-time output for long-running commands
  proc.stdout?.on('data', (data) => process.stdout.write(data));
  proc.stderr?.on('data', (data) => process.stderr.write(data));
  
  // Handle Ctrl+C for blocking commands
  process.on('SIGINT', () => {
    proc.kill();
    console.log('\n\nProcess terminated.');
    pauseAndContinue('Press Enter to return to menu...');
  });
}

function executeSequentially(commands, callback) {
  if (commands.length === 0) {
    callback();
    return;
  }
  
  const [current, ...rest] = commands;
  exec(current, (error) => {
    if (error) {
      console.error(`${colors.red}Error executing: ${current}${colors.reset}`);
      console.error(error.message);
    }
    executeSequentially(rest, callback);
  });
}

function pauseAndContinue(message) {
  console.log(`\n${colors.bright}${colors.cyan}${message}${colors.reset}`);
  rl.once('line', showMenu);
}

function showMenu() {
  console.clear();
  
  // Render ASCII art header with gradient
  renderGradientAscii();
  
  // Render menu items
  menuItems.forEach(renderMenuItem);
  
  // Draw a separator line
  console.log(colors.cyan + '─'.repeat(60) + colors.reset);
  
  // Prompt for selection
  rl.question(`\n${colors.bright}${colors.yellow}Select an option: ${colors.reset}`, (answer) => {
    const item = menuItems.find(i => i.key === answer.trim().toUpperCase());
    
    if (item) {
      if (item.action) {
        item.action();
      } else if (item.command) {
        executeCommand(item.command, `${item.icon} ${item.title}`);
      }
    } else {
      console.log(`\n${colors.bright}${colors.red}❌ Invalid option. Please try again.${colors.reset}\n`);
      setTimeout(() => {
        pauseAndContinue('Press Enter to continue...');
      }, 1000);
    }
  });
}

// Main execution
console.log(`${colors.bright}${colors.green}🌟 Starting Emoji Rain Menu...${colors.reset}`);
showMenu();