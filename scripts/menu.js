#!/usr/bin/env node

const readline = require('readline');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Menu configuration - properly organized
const menuItems = [
  {
    key: '1',
    icon: '🌟',
    title: 'Original Demo (Advanced)',
    description: 'The original full-control emoji rain demo with all settings',
    action: runOriginalDemo
  },
  {
    key: '2',
    icon: '🎯',
    title: 'Current Basic Demo',
    description: 'The current simplified React demo',
    command: 'npm run demo',
    blocking: true
  },
  {
    key: '3',
    icon: '🌟',
    title: 'Original Demo (Advanced)',
    description: 'Run the original CSS animated demo with parallax effects',
    command: 'npm run original-demo-direct',
    blocking: true
  },
  {
    key: '4',
    icon: '💻',
    title: 'Development Server',
    description: 'Start development mode with hot reloading',
    command: 'npm start',
    blocking: true
  },
  {
    key: '5',
    icon: '🏗️',
    title: 'Build Production',
    description: 'Create optimized bundle for distribution',
    command: 'npm run build',
    blocking: false
  },
  {
    key: '6',
    icon: '🧹',
    title: 'Lint Code',
    description: 'Check code quality and style issues',
    command: 'npm run lint',
    blocking: false
  },
  {
    key: '7',
    icon: '🔍',
    title: 'View Configuration',
    description: 'Display current emoji and parallax configuration',
    action: viewConfig
  },
  {
    key: '8',
    icon: '📦',
    title: 'Install Dependencies',
    description: 'Install all required npm packages',
    command: 'npm install',
    blocking: false
  },
  {
    key: '9',
    icon: '📖',
    title: 'View Documentation',
    description: 'Open project README',
    action: openReadme
  },
  {
    key: '0',
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

function runOriginalDemo() {
  console.log('\n🌟 Launching Original Advanced Demo...\n');
  
  // Create the original demo HTML if it doesn't exist
  const originalDemoPath = path.join(__dirname, '..', 'public', 'originalDemo.html');
  
  if (!fs.existsSync(originalDemoPath)) {
    console.log('Creating original demo file from chat history...');
    const html = createOriginalDemoHTML();
    fs.writeFileSync(originalDemoPath, html);
  }
  
  // Create a simple HTTP server to serve the demo
  const http = require('http');
  const port = getRandomPort();
  
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
    console.log(`🌟 Original Demo running at: ${url}`);
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
      console.log('\nServer stopped. Returning to menu...');
      setTimeout(showMenu, 1000);
    });
  });
}

function createOriginalDemoHTML() {
  // This is the original demo HTML from the chat history
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Emoji Rain With Enhanced Controls - Original</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      overflow: hidden;
      position: relative;
      height: 100vh;
      background: #f9f9f9;
    }
    .rain-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      overflow: hidden;
      z-index: 10;
    }
    /* Outer container for each emoji (falling movement) */
    .emoji {
      position: absolute;
      top: -50px;
      animation: fall linear forwards;
      transform: translateY(-100%);
    }
    /* Inner container for the emoji character (spinning) */
    .emoji-inner {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      transform-origin: center center;
      animation: spin linear infinite;
    }
    @keyframes fall {
      0% {
        transform: translateY(-50px);
      }
      100% {
        transform: translateY(120vh);
      }
    }
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
    .controls-container {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      max-width: 90vw;
    }
    .button-container {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .options-container {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      max-width: 600px;
    }
    .option-row {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: center;
      width: 100%;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      background-color: #007BFF;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
    label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    label input[type="checkbox"], label input[type="number"] {
      margin-right: 5px;
    }
    input[type="number"] {
      width: 60px;
    }
    .label-text {
      margin-right: 5px;
    }
    .ratio-label {
      margin: 0 5px;
    }
  </style>
</head>
<body>
  <div class="controls-container">
    <div class="button-container">
      <button id="rainButton">Make it Rain!</button>
      <button id="singleEmoji">Show Single Emoji</button>
      <button id="dropSingleEmoji">Drop Single Emoji</button>
      <button id="rainFewEmojis">Rain Few Emojis</button>
      <button id="clearEmojis">Clear Emojis</button>
    </div>
    <div class="options-container">
      <div class="option-row">
        <label>
          <input type="checkbox" id="parallaxCheckbox" checked> Parallax
        </label>
        <label>
          <input type="checkbox" id="blurCheckbox" checked> Blur
        </label>
        <label>
          <span class="label-text">Speed (0-100):</span>
          <input type="number" id="baseSpeedInput" min="0" max="100" step="1" value="50">
        </label>
      </div>
      
      <!-- Layer Ratios -->
      <div class="option-row">
        <label>
          <span class="label-text ratio-label">Front Ratio:</span>
          <input type="number" id="frontRatioInput" min="0" max="1000" step="1" value="100">
        </label>
        <label>
          <span class="label-text ratio-label">Middle Ratio:</span>
          <input type="number" id="middleRatioInput" min="0" max="1000" step="1" value="300">
        </label>
        <label>
          <span class="label-text ratio-label">Back Ratio:</span>
          <input type="number" id="backRatioInput" min="0" max="1000" step="1" value="70">
        </label>
      </div>
      
      <!-- Front Layer Configurations -->
      <div class="option-row">
        <label>
          <span class="label-text">Front Speed Range [Min]:</span>
          <input type="number" id="frontSpeedRangeMin" min="0" max="10" step="0.1" value="0">
        </label>
        <label>
          <span class="label-text">Front Speed Range [Max]:</span>
          <input type="number" id="frontSpeedRangeMax" min="0" max="10" step="0.1" value="2">
        </label>
        <label>
          <span class="label-text">Front Blur Range [Min]:</span>
          <input type="number" id="frontBlurRangeMin" min="0" max="10" step="1" value="1">
        </label>
        <label>
          <span class="label-text">Front Blur Range [Max]:</span>
          <input type="number" id="frontBlurRangeMax" min="0" max="10" step="1" value="2">
        </label>
      </div>
      <div class="option-row">
        <label>
          <span class="label-text">Front Font Size [Min]:</span>
          <input type="number" id="frontFontSizeMin" min="1" max="100" step="1" value="48">
        </label>
        <label>
          <span class="label-text">Front Font Size [Max]:</span>
          <input type="number" id="frontFontSizeMax" min="1" max="100" step="1" value="72">
        </label>
        <label>
          <span class="label-text">Front Delay [Min]:</span>
          <input type="number" id="frontDelayMin" min="0" max="10" step="0.1" value="0">
        </label>
        <label>
          <span class="label-text">Front Delay [Max]:</span>
          <input type="number" id="frontDelayMax" min="0" max="10" step="0.1" value="0.2">
        </label>
        <label>
          <span class="label-text">Front zIndex:</span>
          <input type="number" id="frontZIndex" min="1" max="100" step="1" value="3">
        </label>
      </div>
      
      <!-- Middle Layer Configurations -->
      <div class="option-row">
        <label>
          <span class="label-text">Middle Speed Range [Min]:</span>
          <input type="number" id="middleSpeedRangeMin" min="0" max="10" step="0.1" value="4">
        </label>
        <label>
          <span class="label-text">Middle Speed Range [Max]:</span>
          <input type="number" id="middleSpeedRangeMax" min="0" max="10" step="0.1" value="6">
        </label>
        <label>
          <span class="label-text">Middle Blur Range [Min]:</span>
          <input type="number" id="middleBlurRangeMin" min="0" max="10" step="1" value="0">
        </label>
        <label>
          <span class="label-text">Middle Blur Range [Max]:</span>
          <input type="number" id="middleBlurRangeMax" min="0" max="10" step="1" value="0">
        </label>
      </div>
      <div class="option-row">
        <label>
          <span class="label-text">Middle Font Size [Min]:</span>
          <input type="number" id="middleFontSizeMin" min="1" max="100" step="1" value="16">
        </label>
        <label>
          <span class="label-text">Middle Font Size [Max]:</span>
          <input type="number" id="middleFontSizeMax" min="1" max="100" step="1" value="32">
        </label>
        <label>
          <span class="label-text">Middle Delay [Min]:</span>
          <input type="number" id="middleDelayMin" min="0" max="10" step="0.1" value="0">
        </label>
        <label>
          <span class="label-text">Middle Delay [Max]:</span>
          <input type="number" id="middleDelayMax" min="0" max="10" step="0.1" value="0.1">
        </label>
        <label>
          <span class="label-text">Middle zIndex:</span>
          <input type="number" id="middleZIndex" min="1" max="100" step="1" value="2">
        </label>
      </div>
      
      <!-- Back Layer Configurations -->
      <div class="option-row">
        <label>
          <span class="label-text">Back Speed Range [Min]:</span>
          <input type="number" id="backSpeedRangeMin" min="0" max="10" step="0.1" value="7">
        </label>
        <label>
          <span class="label-text">Back Speed Range [Max]:</span>
          <input type="number" id="backSpeedRangeMax" min="0" max="10" step="0.1" value="10">
        </label>
        <label>
          <span class="label-text">Back Blur Range [Min]:</span>
          <input type="number" id="backBlurRangeMin" min="0" max="10" step="1" value="2">
        </label>
        <label>
          <span class="label-text">Back Blur Range [Max]:</span>
          <input type="number" id="backBlurRangeMax" min="0" max="10" step="1" value="3">
        </label>
      </div>
      <div class="option-row">
        <label>
          <span class="label-text">Back Font Size [Min]:</span>
          <input type="number" id="backFontSizeMin" min="1" max="100" step="1" value="8">
        </label>
        <label>
          <span class="label-text">Back Font Size [Max]:</span>
          <input type="number" id="backFontSizeMax" min="1" max="100" step="1" value="14">
        </label>
        <label>
          <span class="label-text">Back Delay [Min]:</span>
          <input type="number" id="backDelayMin" min="0" max="10" step="0.1" value="0">
        </label>
        <label>
          <span class="label-text">Back Delay [Max]:</span>
          <input type="number" id="backDelayMax" min="0" max="10" step="0.1" value="0.2">
        </label>
        <label>
          <span class="label-text">Back zIndex:</span>
          <input type="number" id="backZIndex" min="1" max="100" step="1" value="1">
        </label>
      </div>
    </div>
  </div>
  
  <div class="rain-container" id="rainContainer"></div>

  <script>
    const parallaxConfig = {
      layerProperties: {
        front: {
          speedRange: [0, 2],
          blurRange: [1, 2],
          zIndex: 3,
          fontSizeRange: [48, 72],
          delayRange: [0, 0.2]
        },
        middle: {
          speedRange: [4, 6],
          blurRange: [0, 0],
          zIndex: 2,
          fontSizeRange: [16, 32],
          delayRange: [0, 0.1]
        },
        back: {
          speedRange: [7, 10],
          blurRange: [2, 3],
          zIndex: 1,
          fontSizeRange: [8, 14],
          delayRange: [0, 0.2]
        }
      },
      layerRatios: {
        front: 100,
        middle: 300,
        back: 70
      },
      defaultEmojis: ["🥗", "🍕", "🥪", "🍔", "🍎", "🍇"],
      baseSpeed: 50
    };

    const SPEED_ADJUSTMENT_FACTOR = 50 / 30;
    let parallaxEnabled = true;
    let blurEnabled = true;
    const themes = {
      lunchPlan: ["🥗", "🍕", "🥪", "🍔", "🍎", "🍇"],
      restaurant: ["🍽️", "🍴", "🍹", "🍤", "🍜", "🍣"]
    };

    const getRandomValue = (min, max) => Math.random() * (max - min) + min;

    const convertSpeedToFallDuration = (speedValue) => {
      let { baseSpeed } = parallaxConfig;
      baseSpeed = baseSpeed / SPEED_ADJUSTMENT_FACTOR;
      if (baseSpeed < 0) baseSpeed = 0;
      if (baseSpeed > 100) baseSpeed = 100;
      if (baseSpeed === 0) {
        return Number.POSITIVE_INFINITY;
      }
      const minDuration = 1;
      const maxDuration = 10;
      const fraction = speedValue / 10;
      let baseDuration = fraction * (maxDuration - minDuration) + minDuration;
      let fallDuration = baseDuration * (10 / baseSpeed);
      return fallDuration;
    };

    const distributeEmojis = (totalCount) => {
      const { layerRatios } = parallaxConfig;
      const ratioSum = Object.values(layerRatios).reduce((a, b) => a + b, 0);
      const distribution = {
        front: (layerRatios.front / ratioSum) * totalCount,
        middle: (layerRatios.middle / ratioSum) * totalCount,
        back: (layerRatios.back / ratioSum) * totalCount,
      };
      const roundedDistribution = {};
      let allocatedCount = 0;
      for (let layer in distribution) {
        roundedDistribution[layer] = Math.round(distribution[layer]);
        allocatedCount += roundedDistribution[layer];
      }
      let remainder = totalCount - allocatedCount;
      while (remainder !== 0) {
        for (let layer in roundedDistribution) {
          if (remainder > 0) {
            roundedDistribution[layer]++;
            remainder--;
            if (remainder === 0) break;
          } else {
            if (roundedDistribution[layer] > 0) {
              roundedDistribution[layer]--;
              remainder++;
              if (remainder === 0) break;
            }
          }
        }
      }
      return roundedDistribution;
    };

    const createDepthProperties = (layerKey) => {
      const layerConfig = parallaxConfig.layerProperties[layerKey];
      const randomSpeed = getRandomValue(...layerConfig.speedRange);
      const fallDuration = convertSpeedToFallDuration(randomSpeed);
      const blurAmount = getRandomValue(...layerConfig.blurRange);
      const finalFontSize = getRandomValue(...layerConfig.fontSizeRange);
      const randomDelay = getRandomValue(...layerConfig.delayRange);
      return {
        depth: layerKey,
        finalFontSize,
        fallDuration,
        blurAmount,
        delay: randomDelay,
        zIndex: layerConfig.zIndex
      };
    };

    const createEmoji = (emojiSet, drop = false, layerKey = null) => {
      if (!emojiSet || emojiSet.length === 0) {
        emojiSet = parallaxConfig.defaultEmojis;
      }
      const emojiChar = emojiSet[Math.floor(Math.random() * emojiSet.length)];
      const xPosition = getRandomValue(0, window.innerWidth);
      
      if (!layerKey) {
        if (parallaxEnabled) {
          const ratioSum = Object.values(parallaxConfig.layerRatios).reduce((a, b) => a + b, 0);
          const randomVal = getRandomValue(0, ratioSum);
          let cumulative = 0;
          for (let layer in parallaxConfig.layerRatios) {
            cumulative += parallaxConfig.layerRatios[layer];
            if (randomVal <= cumulative) {
              layerKey = layer;
              break;
            }
          }
        } else {
          layerKey = 'middle';
        }
      }
      
      const depthProps = createDepthProperties(layerKey);
      const {
        finalFontSize,
        fallDuration,
        blurAmount,
        delay,
        zIndex
      } = depthProps;
      
      const emojiElement = document.createElement("div");
      emojiElement.className = "emoji";
      emojiElement.style.zIndex = zIndex;
      
      if (drop) {
        emojiElement.style.left = \`\${xPosition}px\`;
      } else {
        emojiElement.style.top = "50%";
        emojiElement.style.left = "50%";
        emojiElement.style.transform = "translate(-50%, -50%)";
      }
      
      if (isFinite(fallDuration)) {
        emojiElement.style.animationDuration = drop ? \`\${fallDuration}s\` : \`0s\`;
        emojiElement.style.animationDelay = \`\${drop ? delay : 0}s\`;
      } else {
        emojiElement.style.animationName = "none";
      }
      
      const emojiInner = document.createElement("div");
      emojiInner.className = "emoji-inner";
      emojiInner.textContent = emojiChar;
      emojiInner.style.fontSize = \`\${finalFontSize}px\`;
      emojiInner.style.animationDuration = \`\${getRandomValue(2, 4)}s\`;
      emojiInner.style.animationDelay = \`0s\`;
      
      const finalBlur = blurEnabled ? blurAmount : 0;
      emojiInner.style.filter = \`blur(\${finalBlur}px)\`;
      
      emojiElement.appendChild(emojiInner);
      
      return emojiElement;
    };

    let frontInterval = null;
    let frontRemaining = 0;

    const triggerRain = (emojiSet) => {
      const rainContainer = document.getElementById("rainContainer");
      const count = 20;
      
      if (parallaxEnabled) {
        const distribution = distributeEmojis(count);
        
        if (distribution.front > 0) {
          frontRemaining = distribution.front;
          const slowestLayerTime = Math.max(
            ...Object.keys(parallaxConfig.layerProperties).map(layer => {
              const layerConf = parallaxConfig.layerProperties[layer];
              return convertSpeedToFallDuration(layerConf.speedRange[1]);
            })
          );
          const intervalTime = (slowestLayerTime * 1000) / (frontRemaining || 1);
          
          frontInterval = setInterval(() => {
            if (frontRemaining <= 0) {
              clearInterval(frontInterval);
              frontInterval = null;
            } else {
              const emoji = createEmoji(emojiSet, true, 'front');
              rainContainer.appendChild(emoji);
              frontRemaining--;
            }
          }, intervalTime);
        }
        
        if (distribution.middle > 0) {
          for (let i = 0; i < distribution.middle; i++) {
            const emoji = createEmoji(emojiSet, true, 'middle');
            rainContainer.appendChild(emoji);
          }
        }
        
        if (distribution.back > 0) {
          for (let i = 0; i < distribution.back; i++) {
            const emoji = createEmoji(emojiSet, true, 'back');
            rainContainer.appendChild(emoji);
          }
        }
      } else {
        for (let i = 0; i < count; i++) {
          const emoji = createEmoji(emojiSet, true, 'middle');
          rainContainer.appendChild(emoji);
        }
      }
    };

    const showSingleEmoji = (emojiSet) => {
      const rainContainer = document.getElementById("rainContainer");
      const emoji = createEmoji(emojiSet);
      rainContainer.appendChild(emoji);
    };

    const dropSingleEmoji = (emojiSet) => {
      const rainContainer = document.getElementById("rainContainer");
      const emoji = createEmoji(emojiSet, true);
      rainContainer.appendChild(emoji);
    };

    const rainFewEmojis = (emojiSet) => {
      const rainContainer = document.getElementById("rainContainer");
      const count = 5;
      if (parallaxEnabled) {
        const distribution = distributeEmojis(count);
        for (let layer in distribution) {
          for (let i = 0; i < distribution[layer]; i++) {
            const emoji = createEmoji(emojiSet, true, layer);
            rainContainer.appendChild(emoji);
          }
        }
      } else {
        for (let i = 0; i < count; i++) {
          const emoji = createEmoji(emojiSet, true, 'middle');
          rainContainer.appendChild(emoji);
        }
      }
    };

    const clearEmojis = () => {
      const rainContainer = document.getElementById("rainContainer");
      rainContainer.innerHTML = "";
      if (frontInterval) {
        clearInterval(frontInterval);
        frontInterval = null;
        frontRemaining = 0;
      }
    };

    // UI Control event listeners
    const baseSpeedInput = document.getElementById('baseSpeedInput');
    const frontRatioInput = document.getElementById('frontRatioInput');
    const middleRatioInput = document.getElementById('middleRatioInput');
    const backRatioInput = document.getElementById('backRatioInput');
    
    // All control IDs
    const controlIds = [
      'frontSpeedRangeMin', 'frontSpeedRangeMax', 'frontBlurRangeMin', 'frontBlurRangeMax',
      'frontFontSizeMin', 'frontFontSizeMax', 'frontDelayMin', 'frontDelayMax', 'frontZIndex',
      'middleSpeedRangeMin', 'middleSpeedRangeMax', 'middleBlurRangeMin', 'middleBlurRangeMax',
      'middleFontSizeMin', 'middleFontSizeMax', 'middleDelayMin', 'middleDelayMax', 'middleZIndex',
      'backSpeedRangeMin', 'backSpeedRangeMax', 'backBlurRangeMin', 'backBlurRangeMax',
      'backFontSizeMin', 'backFontSizeMax', 'backDelayMin', 'backDelayMax', 'backZIndex'
    ];

    // Base speed
    baseSpeedInput.addEventListener('input', (e) => {
      let value = parseInt(e.target.value, 10);
      if (isNaN(value)) value = 50;
      else if (value < 0) value = 0;
      else if (value > 100) value = 100;
      parallaxConfig.baseSpeed = value;
    });

    // Layer ratios
    frontRatioInput.addEventListener('input', (e) => {
      let value = parseInt(e.target.value, 10);
      if (isNaN(value)) value = 100;
      else if (value < 0) value = 0;
      else if (value > 10000) value = 10000;
      parallaxConfig.layerRatios.front = value;
    });

    middleRatioInput.addEventListener('input', (e) => {
      let value = parseInt(e.target.value, 10);
      if (isNaN(value)) value = 300;
      else if (value < 0) value = 0;
      else if (value > 10000) value = 10000;
      parallaxConfig.layerRatios.middle = value;
    });

    backRatioInput.addEventListener('input', (e) => {
      let value = parseInt(e.target.value, 10);
      if (isNaN(value)) value = 70;
      else if (value < 0) value = 0;
      else if (value > 10000) value = 10000;
      parallaxConfig.layerRatios.back = value;
    });

    // Set up all layer control listeners
    function setupLayerControls() {
      controlIds.forEach(id => {
        const element = document.getElementById(id);
        if (!element) return;
        
        element.addEventListener('input', (e) => {
          let value = parseFloat(e.target.value);
          const parts = id.split(/(?=[A-Z])/);
          const layer = parts[0];
          const property = parts.slice(1).join('');
          
          // Validate value
          if (isNaN(value)) value = parseFloat(element.defaultValue);
          const min = parseFloat(element.min);
          const max = parseFloat(element.max);
          if (value < min) value = min;
          if (value > max) value = max;
          
          // Update config
          if (property.includes('Min')) {
            const propName = property.replace('Min', '');
            const propKey = propName.charAt(0).toLowerCase() + propName.slice(1) + 'Range';
            parallaxConfig.layerProperties[layer][propKey][0] = value;
          } else if (property.includes('Max')) {
            const propName = property.replace('Max', '');
            const propKey = propName.charAt(0).toLowerCase() + propName.slice(1) + 'Range';
            parallaxConfig.layerProperties[layer][propKey][1] = value;
          } else if (property === 'ZIndex') {
            parallaxConfig.layerProperties[layer].zIndex = value;
          }
        });
      });
    }

    setupLayerControls();

    // Checkboxes
    document.getElementById("parallaxCheckbox").addEventListener("change", (e) => {
      parallaxEnabled = e.target.checked;
    });

    document.getElementById("blurCheckbox").addEventListener("change", (e) => {
      blurEnabled = e.target.checked;
    });

    // Buttons
    document.getElementById("rainButton").addEventListener("click", () => {
      triggerRain(themes.lunchPlan);
    });

    document.getElementById("singleEmoji").addEventListener("click", () => {
      showSingleEmoji(themes.lunchPlan);
    });

    document.getElementById("dropSingleEmoji").addEventListener("click", () => {
      dropSingleEmoji(themes.lunchPlan);
    });

    document.getElementById("rainFewEmojis").addEventListener("click", () => {
      rainFewEmojis(themes.lunchPlan);
    });

    document.getElementById("clearEmojis").addEventListener("click", () => {
      clearEmojis();
    });
  </script>
</body>
</html>`;
}

function viewConfig() {
  console.clear();
  console.log('\n📋 Current Configuration:\n');
  
  try {
    const configPath = path.join(__dirname, '..', 'src', 'config', 'parallaxConfig.js');
    const packagePath = path.join(__dirname, '..', 'package.json');
    
    console.log('🎯 Parallax Config:');
    console.log('─'.repeat(40));
    const configContent = fs.readFileSync(configPath, 'utf8');
    const match = configContent.match(/defaultEmojis:\s*\[(.*?)\]/s);
    if (match) {
      console.log(`Default Emojis: ${match[1]}`);
    }
    console.log('\nLayer Properties:');
    console.log('- Front Layer: Large, slow, blurred');
    console.log('- Middle Layer: Medium size, medium speed');
    console.log('- Back Layer: Small, fast, blurred');
    
    console.log('\n📦 Package Info:');
    console.log('─'.repeat(40));
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`Name: ${packageJson.name}`);
    console.log(`Version: ${packageJson.version}`);
    console.log(`Author: ${packageJson.author}`);
    console.log(`License: ${packageJson.license}`);
    
  } catch (error) {
    console.error('Error reading configuration:', error.message);
  }
  
  console.log('\nPress Enter to return to menu...');
  rl.once('line', showMenu);
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
  console.log('\n🔄 Cleaning and rebuilding...\n');
  
  const commands = [
    'rm -rf dist || rmdir /s /q dist',
    'npm run build'
  ];
  
  executeSequentially(commands, () => {
    console.log('\n✅ Clean and rebuild complete!');
    setTimeout(showMenu, 2000);
  });
}

function exitMenu() {
  console.log('\n👋 Thanks for using Emoji Storm! Goodbye!\n');
  rl.close();
  process.exit(0);
}

function executeCommand(command, description) {
  console.log(`\n${description}...\n`);
  
  const proc = exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      console.log('\nPress Enter to return to menu...');
      rl.once('line', showMenu);
      return;
    }
    
    if (stderr && !stderr.includes('warning')) {
      console.error(`Warning: ${stderr}`);
    }
    
    if (stdout) {
      console.log(stdout);
    }
    
    // For non-blocking commands, return to menu
    if (!command.includes('serve') && !command.includes('start')) {
      setTimeout(showMenu, 1500);
    }
  });
  
  // Show real-time output for long-running commands
  proc.stdout?.on('data', (data) => process.stdout.write(data));
  proc.stderr?.on('data', (data) => process.stderr.write(data));
  
  // Handle Ctrl+C for blocking commands
  process.on('SIGINT', () => {
    proc.kill();
    console.log('\n\nProcess terminated. Returning to menu...');
    setTimeout(showMenu, 1000);
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
      console.error(`Error executing: ${current}`);
      console.error(error.message);
    }
    executeSequentially(rest, callback);
  });
}

function showMenu() {
  console.clear();
  console.log(`
╔══════════════════════════════════════════════╗
║           🌈 Emoji Storm Menu 🌈             ║
╚══════════════════════════════════════════════╝

`);

  menuItems.forEach(item => {
    console.log(`  ${item.key}. ${item.icon} ${item.title}`);
    console.log(`     ${item.description}`);
    console.log('');
  });

  console.log('─'.repeat(48));
  
  rl.question('\nSelect an option: ', (answer) => {
    const item = menuItems.find(i => i.key === answer.trim().toUpperCase());
    
    if (item) {
      if (item.action) {
        item.action();
      } else if (item.command) {
        executeCommand(item.command, `${item.icon} ${item.title}`);
      }
    } else {
      console.log('\n❌ Invalid option. Please try again.\n');
      setTimeout(showMenu, 1500);
    }
  });
}

// Main execution
console.log('🌟 Starting Emoji Storm Menu...');
showMenu();