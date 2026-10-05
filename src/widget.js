// widget.js - Standalone embeddable version of RainMoji
// CDN: https://cdn.jsdelivr.net/gh/TheJesper/rainmoji@main/dist/widget.min.js

(function() {
  'use strict';

  const DEFAULT_CONFIG = {
    emojis: ['🎉', '🎊', '🎁', '🎈', '🎀', '🥳', '🍾', '🎆', '✨', '🌟', '⭐', '💫'],
    containerZIndex: 10,
    baseSpeed: 25,
    showControls: false,
    autoPlay: false,
    parallaxEnabled: true,
    blurEnabled: true,
    targetElement: null,
    triggerElement: null, // CSS selector for button that toggles rain
    windDirection: 0, // -100 (left) to 100 (right)
    bounceEnabled: false,
    mobileOptimization: true, // Reduce particles on mobile
    layerRatios: { front: 100, middle: 300, back: 70 },
    zIndexMode: 'individual',
    layerProperties: {
      front:  { speedRange: [0, 2],  blurRange: [1, 2], zIndex: 3, fontSizeRange: [48, 72], delayRange: [0, 0.2] },
      middle: { speedRange: [4, 6],  blurRange: [0, 0], zIndex: 2, fontSizeRange: [16, 32], delayRange: [0, 0.1] },
      back:   { speedRange: [7, 10], blurRange: [2, 3], zIndex: 1, fontSizeRange: [8, 14],  delayRange: [0, 0.2] }
    }
  };

  class EmojiRainWidget {
    constructor(config = {}) {
      this.config = this._mergeConfig(DEFAULT_CONFIG, config);
      this.emojis = [];
      this.intervals = { continuous: null, front: null };
      this.isRaining = false;
      this.container = null;
      this.controlPanel = null;
      this._init();
    }

    _mergeConfig(defaults, override) {
      const merged = { ...defaults, ...override };
      if (override.layerRatios) merged.layerRatios = { ...defaults.layerRatios, ...override.layerRatios };
      if (override.layerProperties) {
        merged.layerProperties = {};
        ['front', 'middle', 'back'].forEach(l => {
          merged.layerProperties[l] = { ...defaults.layerProperties[l], ...(override.layerProperties[l] || {}) };
        });
      }
      return merged;
    }

    _init() {
      if (this.config.targetElement) {
        const target = typeof this.config.targetElement === 'string'
          ? document.querySelector(this.config.targetElement)
          : this.config.targetElement;
        if (!target || target.nodeType !== 1 || typeof target.appendChild !== 'function') {
          throw new Error('RainMoji targetElement must be an existing CSS selector or DOM element.');
        }
        this.targetElement = target;
        this.originalTargetPosition = target.style.position;
        const targetPosition = getComputedStyle(target).position;
        if (!targetPosition || targetPosition === 'static') target.style.position = 'relative';
        this.container = document.createElement('div');
        this.container.id = `emoji-rain-container-${Math.random().toString(36).slice(2, 10)}`;
        this.container.className = 'emoji-rain-container';
        target.appendChild(this.container);
      } else {
        this.container = document.createElement('div');
        this.container.id = `emoji-rain-container-${Math.random().toString(36).slice(2, 10)}`;
        document.body.appendChild(this.container);
      }

      Object.assign(this.container.style, {
        position: this.config.targetElement ? 'absolute' : 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        pointerEvents: 'none', overflow: 'hidden',
        zIndex: this.config.containerZIndex.toString(),
      });

      this._injectStyles();

      if (this.config.showControls) this._createControls();

      // Bind trigger element
      if (this.config.triggerElement) {
        const trigger = document.querySelector(this.config.triggerElement);
        if (trigger) {
          trigger.addEventListener('click', () => this.start());
        }
      }

      if (this.config.autoPlay) this.start();

      window.emojiRainInstance = this;
    }

    _injectStyles() {
      if (document.getElementById('emoji-rain-styles')) return;
      const style = document.createElement('style');
      style.id = 'emoji-rain-styles';
      const windOffset = this.config.windDirection;
      style.textContent = `
        @keyframes emoji-fall { 0%{transform:translateY(-50px) translateX(0)} 100%{transform:translateY(120vh) translateX(${windOffset}px)} }
        @keyframes emoji-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes emoji-spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes emoji-fadeout { 0%{opacity:1} 100%{opacity:0} }
        .emoji-particle { position:absolute; top:-50px; animation:emoji-fall linear forwards; transition:opacity 0.5s ease-out; will-change:transform,opacity; pointer-events:none; }
        .emoji-particle.fading { animation:emoji-fall linear forwards, emoji-fadeout var(--fade-duration) ease-out forwards; }
        .emoji-particle.bounce { animation:emoji-fall linear forwards, emoji-bounce 0.8s ease-in-out infinite; }
        .emoji-inner { display:inline-flex; align-items:center; justify-content:center; line-height:1; transform-origin:center; animation:emoji-spin linear infinite; will-change:transform; }
      `;
      document.head.appendChild(style);
    }

    _createControls() {
      const controls = document.createElement('div');
      controls.className = 'emoji-controls';
      Object.assign(controls.style, {
        position: 'fixed', top: '15px', left: '50%', transform: 'translateX(-50%)',
        zIndex: (this.config.containerZIndex + 10).toString(),
        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
        borderRadius: '15px', padding: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', pointerEvents: 'auto',
      });
      // SECURITY: innerHTML used only for static template (no user input). Keep static.
      controls.innerHTML = `
        <div style="text-align:center;margin-bottom:10px;font-weight:bold;color:#333;">🌧️ RainMoji</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;"></div>
      `;
      const btnContainer = controls.querySelector('div > div');
      [['Start', () => this.start()], ['Stop', () => this.stop()], ['Clear', () => this.clear()]].forEach(([label, fn]) => {
        const btn = document.createElement('button');
        btn.textContent = label;
        Object.assign(btn.style, {
          padding: '10px 20px', background: 'linear-gradient(135deg,#667eea,#764ba2)',
          color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
        });
        btn.addEventListener('click', fn);
        btnContainer.appendChild(btn);
      });
      document.body.appendChild(controls);
      this.controlPanel = controls;
    }

    _createEmoji(emoji, layer = 'middle') {
      const lp = this.config.layerProperties[layer] || this.config.layerProperties.middle;
      const id = `emoji-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const left = Math.random() * 100;
      const speed = lp.speedRange[0] + Math.random() * (lp.speedRange[1] - lp.speedRange[0]);
      const duration = Math.max(1, (speed * this.config.baseSpeed) / 10);
      const size = lp.fontSizeRange[0] + Math.random() * (lp.fontSizeRange[1] - lp.fontSizeRange[0]);
      const blur = this.config.blurEnabled ? lp.blurRange[0] + Math.random() * (lp.blurRange[1] - lp.blurRange[0]) : 0;
      const delay = lp.delayRange[0] + Math.random() * (lp.delayRange[1] - lp.delayRange[0]);
      const spinDuration = 2 + Math.random() * 3;

      return { id, emoji, left, duration, size, spinDuration, blur, zIndex: lp.zIndex, layer, delay };
    }

    _addEmoji(emojiData) {
      const el = document.createElement('div');
      el.className = 'emoji-particle' + (this.config.bounceEnabled ? ' bounce' : '');
      el.id = emojiData.id;
      el.style.left = `${emojiData.left}%`;
      el.style.animationDuration = `${emojiData.duration}s`;
      el.style.animationDelay = `${emojiData.delay || 0}s`;
      el.style.zIndex = emojiData.zIndex;
      if (emojiData.blur > 0) el.style.filter = `blur(${emojiData.blur}px)`;

      const inner = document.createElement('div');
      inner.className = 'emoji-inner';
      inner.textContent = emojiData.emoji;
      inner.style.fontSize = `${emojiData.size}px`;
      inner.style.animationDuration = `${emojiData.spinDuration}s`;

      el.appendChild(inner);
      this.container.appendChild(el);

      setTimeout(() => this._removeEmoji(emojiData.id), (emojiData.duration + (emojiData.delay || 0)) * 1000);
      return emojiData;
    }

    _removeEmoji(id) {
      const el = document.getElementById(id);
      if (el) el.remove();
      this.emojis = this.emojis.filter(e => e.id !== id);
    }

    // --- PUBLIC API ---

    /** Start a rain burst */
    start() {
      const ratios = this.config.layerRatios;
      const total = ratios.front + ratios.middle + ratios.back;
      let count = Math.round(total / 10);

      // Mobile optimization: reduce particle count on small screens
      if (this.config.mobileOptimization && window.innerWidth < 768) {
        count = Math.round(count * 0.6);
      }

      const emojiSet = this.config.emojis;

      for (let i = 0; i < count; i++) {
        const rand = Math.random() * total;
        const layer = rand < ratios.front ? 'front' : rand < ratios.front + ratios.middle ? 'middle' : 'back';
        const emoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
        const data = this._createEmoji(emoji, layer);
        this._addEmoji(data);
        this.emojis.push(data);
      }
      this.isRaining = true;
    }

    /** Stop continuous rain (no-op for burst mode) */
    stop() {
      Object.values(this.intervals).forEach(i => { if (i) clearInterval(i); });
      this.intervals = { continuous: null, front: null };
      this.isRaining = false;
    }

    /** Clear all visible emojis */
    clear() {
      this.emojis.forEach(e => this._removeEmoji(e.id));
      this.emojis = [];
    }

    /** Update config at runtime */
    updateConfig(newConfig) {
      this.config = this._mergeConfig(this.config, newConfig);
    }

    /** Remove widget entirely */
    destroy() {
      this.stop();
      this.clear();
      if (this.controlPanel) this.controlPanel.remove();
      if (this.container) this.container.remove();
      if (this.targetElement && this.targetElement.style.position === 'relative') {
        this.targetElement.style.position = this.originalTargetPosition;
      }
    }
  }

  // Public API
  window.EmojiRain = {
    init: function(config) { return new EmojiRainWidget(config); },
    version: '1.1.0'
  };
})();
