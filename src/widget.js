// widget.js - Standalone embeddable version of Emoji Rain
// This file will be built and hosted on CDN (GitHub Pages, jsDelivr, etc.)

(function() {
  'use strict';

  // Default configuration
  const DEFAULT_CONFIG = {
    emojis: ['🌟', '💫', '✨', '🎉', '🎊', '⭐', '🌈'],
    containerZIndex: 10,
    baseSpeed: 50,
    showControls: true,
    autoPlay: false,
    parallaxEnabled: true,
    blurEnabled: true,
    targetElement: null, // If null, creates container; otherwise uses existing element
  };

  // Emoji Rain Widget Class
  class EmojiRainWidget {
    constructor(config = {}) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.emojis = [];
      this.intervals = {
        continuous: null,
        front: null,
      };
      this.isRaining = false;
      this.fadingEmojis = new Set();
      this.container = null;
      this.controlPanel = null;
      
      this.init();
    }

    init() {
      // Create or get container
      if (this.config.targetElement) {
        this.container = document.querySelector(this.config.targetElement);
      } else {
        this.container = document.createElement('div');
        this.container.id = 'emoji-rain-container';
        document.body.appendChild(this.container);
      }

      // Set container styles
      Object.assign(this.container.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: this.config.containerZIndex.toString(),
      });

      // Inject CSS animations
      this.injectStyles();

      // Create controls if enabled
      if (this.config.showControls) {
        this.createControls();
      }

      // Auto play if enabled
      if (this.config.autoPlay) {
        this.triggerRain();
      }

      // Expose to window for external control
      window.emojiRainInstance = this;
    }

    injectStyles() {
      const styleId = 'emoji-rain-styles';
      if (document.getElementById(styleId)) return;

      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes emoji-fall {
          0% { transform: translateY(-50px); }
          100% { transform: translateY(120vh); }
        }
        @keyframes emoji-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes emoji-fadeout {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        .emoji-particle {
          position: absolute;
          top: -50px;
          animation: emoji-fall linear forwards;
          transform: translateY(-100%);
          transition: opacity 0.5s ease-out;
          will-change: transform, opacity;
          pointer-events: none;
        }
        .emoji-particle.fading {
          animation: emoji-fall linear forwards, emoji-fadeout var(--fade-duration) ease-out forwards;
        }
        .emoji-inner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transform-origin: center center;
          animation: emoji-spin linear infinite;
          will-change: transform;
        }
        .emoji-controls {
          position: fixed;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: ${this.config.containerZIndex + 10};
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          pointer-events: auto;
        }
        .emoji-controls button {
          padding: 10px 20px;
          margin: 5px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          transition: transform 0.2s;
        }
        .emoji-controls button:hover {
          transform: translateY(-2px);
        }
      `;
      document.head.appendChild(style);
    }

    createControls() {
      const controls = document.createElement('div');
      controls.className = 'emoji-controls';
      controls.innerHTML = `
        <div style="text-align: center; margin-bottom: 10px; font-weight: bold; color: #333;">
          🌧️ Emoji Rain
        </div>
        <div style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: center;">
          <button onclick="window.emojiRainInstance.triggerRain()">Make it Rain!</button>
          <button onclick="window.emojiRainInstance.dropSingleEmoji()">Drop Single</button>
          <button onclick="window.emojiRainInstance.clearEmojis()">Clear</button>
        </div>
      `;
      document.body.appendChild(controls);
      this.controlPanel = controls;
    }

    createEmoji(emoji, randomizePosition = true, layer = 'middle') {
      const id = `emoji-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const left = randomizePosition ? Math.random() * 100 : 50;
      
      // Layer-based properties (simplified parallax)
      const layerConfig = {
        back: { size: 0.6, speed: 1.2, blur: 2, zIndex: 1 },
        middle: { size: 0.8, speed: 1.0, blur: 0, zIndex: 50 },
        front: { size: 1.0, speed: 0.8, blur: 0, zIndex: 100 },
      };

      const config = layerConfig[layer] || layerConfig.middle;
      const baseSpeed = this.config.baseSpeed;
      const duration = (config.speed * baseSpeed) / 10;
      const size = 20 + (config.size * 20);
      const spinDuration = 2 + Math.random() * 3;

      return {
        id,
        emoji,
        left,
        duration,
        size,
        spinDuration,
        blur: this.config.blurEnabled ? config.blur : 0,
        zIndex: config.zIndex,
        layer,
      };
    }

    addEmoji(emojiData) {
      const emojiEl = document.createElement('div');
      emojiEl.className = 'emoji-particle';
      emojiEl.id = emojiData.id;
      emojiEl.style.left = `${emojiData.left}%`;
      emojiEl.style.animationDuration = `${emojiData.duration}s`;
      emojiEl.style.zIndex = emojiData.zIndex;
      if (emojiData.blur > 0) {
        emojiEl.style.filter = `blur(${emojiData.blur}px)`;
      }

      const inner = document.createElement('div');
      inner.className = 'emoji-inner';
      inner.textContent = emojiData.emoji;
      inner.style.fontSize = `${emojiData.size}px`;
      inner.style.animationDuration = `${emojiData.spinDuration}s`;

      emojiEl.appendChild(inner);
      this.container.appendChild(emojiEl);

      // Auto-remove after animation
      setTimeout(() => {
        this.removeEmoji(emojiData.id);
      }, emojiData.duration * 1000);

      return emojiData;
    }

    removeEmoji(id) {
      const el = document.getElementById(id);
      if (el) {
        el.remove();
      }
      this.emojis = this.emojis.filter(e => e.id !== id);
    }

    triggerRain() {
      const count = 20;
      const emojiSet = this.config.emojis;

      for (let i = 0; i < count; i++) {
        const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
        const layer = this.config.parallaxEnabled 
          ? ['back', 'middle', 'front'][Math.floor(Math.random() * 3)]
          : 'middle';
        const emojiData = this.createEmoji(randomEmoji, true, layer);
        this.addEmoji(emojiData);
        this.emojis.push(emojiData);
      }
    }

    dropSingleEmoji() {
      const emojiSet = this.config.emojis;
      const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
      const emojiData = this.createEmoji(randomEmoji, true, 'middle');
      this.addEmoji(emojiData);
      this.emojis.push(emojiData);
    }

    clearEmojis() {
      this.emojis.forEach(emoji => {
        this.removeEmoji(emoji.id);
      });
      this.emojis = [];
    }

    destroy() {
      if (this.controlPanel) {
        this.controlPanel.remove();
      }
      if (this.container && !this.config.targetElement) {
        this.container.remove();
      }
      // Clean up any intervals
      Object.values(this.intervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
    }
  }

  // Public API
  window.EmojiRain = {
    init: function(config) {
      return new EmojiRainWidget(config);
    },
    version: '1.0.0'
  };
})();
