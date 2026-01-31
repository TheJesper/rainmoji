# RainMoji

[![npm version](https://badge.fury.io/js/rainmoji.svg)](https://www.npmjs.com/package/rainmoji)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Beautiful emoji rain animations for any website. Zero dependencies. 5KB gzipped.

**[Live Demo](https://rainmoji.vs-code.com)** | **[Get The Code](https://rainmoji.vs-code.com)**

## Quick Start

```html
<script src="https://cdn.jsdelivr.net/gh/TheJesper/rainmoji@latest/dist/widget.min.js"></script>
<script>
  EmojiRain.init({
    emojis: ['🌟', '💫', '✨', '🎉'],
    autoPlay: true
  });
</script>
```

## npm

```bash
npm install rainmoji
```

```tsx
import { EmojiRain } from 'rainmoji';

function App() {
  return <EmojiRain emojiSet={['🌟', '💫', '✨']} autoPlay={true} />;
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `emojis` | `string[]` | `['🥗', '🍕', ...]` | Emojis to rain |
| `containerZIndex` | `number` | `10` | Z-index layering |
| `baseSpeed` | `number` | `50` | Animation speed (0-100) |
| `showControls` | `boolean` | `true` | Show control buttons |
| `autoPlay` | `boolean` | `false` | Start immediately |
| `parallaxEnabled` | `boolean` | `true` | 3D parallax depth layers |
| `blurEnabled` | `boolean` | `true` | Depth blur effect |
| `targetElement` | `string` | `null` | CSS selector for container |

## Examples

```javascript
// Celebration
EmojiRain.init({ emojis: ['🎉', '🎊', '🎈', '🎁'], autoPlay: true });

// Seasonal
EmojiRain.init({ emojis: ['🎃', '👻', '🦇', '🕷️'] }); // Halloween
EmojiRain.init({ emojis: ['❄️', '⛄', '🎄', '🎅'] }); // Christmas
EmojiRain.init({ emojis: ['❤️', '💕', '💖', '💝'] }); // Valentine's

// Ambient background
EmojiRain.init({
  emojis: ['✨', '💫', '🌟'],
  containerZIndex: 1,
  autoPlay: true,
  showControls: false,
  baseSpeed: 30
});
```

## Features

- **Parallax layers** - Front, middle, and back layers with configurable depth
- **Auto-cleanup** - Emojis fade out and are removed from DOM after animation
- **GPU accelerated** - CSS transforms for smooth 60fps
- **Container mode** - Rain inside any element, or full viewport
- **Mobile friendly** - Works on all devices

## Build

```bash
git clone https://github.com/TheJesper/rainmoji.git
cd rainmoji
npm install
npm run build:all
```

## License

MIT License - Copyright (c) 2025 [Jesper Wilfing](https://conzeon.com) / [Conzeon AB](https://conzeon.com)

See [LICENSE](LICENSE) for details. You are free to use, modify, and distribute this software. The copyright notice and license must be included in all copies or substantial portions.

## Links

- [Live Demo & Widget Generator](https://rainmoji.vs-code.com)
- [Landing Page Repo](https://github.com/TheJesper/rainmoji-web)
- [npm Package](https://www.npmjs.com/package/rainmoji)

---

Built by [Jesper Wilfing](https://conzeon.com) / [Conzeon AB](https://conzeon.com)
