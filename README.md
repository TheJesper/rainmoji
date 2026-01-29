# 🌧️ Emoji Rain Parallax

[![npm version](https://badge.fury.io/js/emoji-rain-parallax.svg)](https://www.npmjs.com/package/emoji-rain-parallax)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub Pages](https://img.shields.io/badge/demo-live-success)](https://yourusername.github.io/emoji-rain-parallax)

**The easiest way to add stunning emoji rain effects to any website.** No React required. Just one line of code.

## ✨ Why Choose Emoji Rain?

- 🚀 **Zero Dependencies** - Works on any website, framework, or no framework at all
- ⚡ **Lightweight** - Less than 5KB gzipped
- 🎨 **Fully Customizable** - Control speed, layers, z-index, and emojis
- 🌈 **Parallax Effects** - Beautiful 3D depth with multiple layers
- 📱 **Mobile Friendly** - Smooth performance on all devices
- 🎯 **Easy Integration** - Copy-paste one script tag and you're done

## 🎮 Live Demo & Widget Generator

**[Try it now →](https://yourusername.github.io/emoji-rain-parallax)**

Use our interactive widget generator to customize your emoji rain and get ready-to-use code!

## 🚀 Quick Start (CDN - Easiest!)

Add this single line anywhere in your HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/yourusername/emoji-rain-parallax@latest/dist/widget.min.js"></script>
<script>
  EmojiRain.init({
    emojis: ['🌟', '💫', '✨', '🎉'],
    autoPlay: true
  });
</script>
```

**That's it!** Your emoji rain is live. 🎊

## 📦 Installation (npm/yarn)

For React projects or if you want more control:

```bash
npm install emoji-rain-parallax
```

```tsx
import { EmojiRain } from 'emoji-rain-parallax';

function App() {
  return (
    <EmojiRain 
      emojiSet={['🌟', '💫', '✨']} 
      autoPlay={true} 
    />
  );
}
```

## 🎨 Configuration Options

### CDN Widget Options

```javascript
EmojiRain.init({
  emojis: ['🌟', '💫', '✨', '🎉', '🎊', '⭐', '🌈'],  // Array of emojis to rain
  containerZIndex: 10,                                  // Control layering (0-999999)
  baseSpeed: 50,                                        // Animation speed (0-100)
  showControls: true,                                   // Show control buttons
  autoPlay: false,                                      // Start raining immediately
  parallaxEnabled: true,                                // Enable 3D parallax effect
  blurEnabled: true,                                    // Enable depth blur effect
  targetElement: null                                   // Custom container selector
});
```

### React Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `emojiSet` | `string[]` | `['🥗', '🍕', ...]` | Array of emojis to display |
| `showControls` | `boolean` | `true` | Show control panel |
| `containerStyle` | `CSSProperties` | `{}` | Custom container styles |
| `className` | `string` | `''` | Additional CSS classes |
| `autoPlay` | `boolean` | `false` | Start automatically |
| `parallaxEnabled` | `boolean` | `true` | Enable parallax layers |
| `blurEnabled` | `boolean` | `true` | Enable blur effect |
| `baseSpeed` | `number` | `50` | Animation speed (0-100) |

## 💡 Use Cases

### 🎉 Event Celebrations
Add emoji rain to celebrations, achievements, or special announcements:
```javascript
EmojiRain.init({ emojis: ['🎉', '🎊', '🎈', '🎁'], autoPlay: true });
```

### 🎃 Seasonal Themes
Create seasonal effects for holidays:
```javascript
// Halloween
EmojiRain.init({ emojis: ['🎃', '👻', '🦇', '🕷️'] });

// Christmas
EmojiRain.init({ emojis: ['🎄', '❄️', '⛄', '🎅'] });

// Valentine's
EmojiRain.init({ emojis: ['❤️', '💕', '💖', '💝'] });
```

### 🏆 Gamification
Reward users with emoji rain on achievements:
```javascript
function onLevelComplete() {
  EmojiRain.init({ 
    emojis: ['🏆', '⭐', '🌟', '💎'],
    autoPlay: true,
    showControls: false
  });
}
```

### 🎨 Creative Landing Pages
Make your landing page memorable:
```javascript
EmojiRain.init({ 
  emojis: ['✨', '💫', '🌟'],
  containerZIndex: 1,        // Behind content
  autoPlay: true,
  showControls: false,
  baseSpeed: 30              // Slower, ambient effect
});
```

## 🎯 Advanced Examples

### Modal-Safe Z-Index Control

Control whether emojis appear behind or in front of modals:

```javascript
// Emojis stay behind modals (recommended)
EmojiRain.init({ containerZIndex: 10 });  // Modal at z-index: 999

// Emojis appear on top of everything
EmojiRain.init({ containerZIndex: 10000 });
```

### Programmatic Control

```javascript
// Initialize without controls
const rain = EmojiRain.init({ 
  showControls: false,
  autoPlay: false 
});

// Trigger manually
document.getElementById('celebrate-btn').addEventListener('click', () => {
  rain.triggerRain();
});

// Single emoji on user action
document.getElementById('like-btn').addEventListener('click', () => {
  rain.dropSingleEmoji();
});

// Clean up
rain.destroy();
```

### React Advanced Usage

```tsx
import { EmojiRain } from 'emoji-rain-parallax';
import { useState } from 'react';

function CelebrationButton() {
  const [celebrating, setCelebrating] = useState(false);

  return (
    <>
      <button onClick={() => setCelebrating(true)}>
        Celebrate! 🎉
      </button>
      
      {celebrating && (
        <EmojiRain
          emojiSet={['🎉', '🎊', '🎈']}
          autoPlay={true}
          showControls={false}
          onComplete={() => setCelebrating(false)}
        />
      )}
    </>
  );
}
```

## 🌟 Features

### Parallax Layers
Three distinct layers create realistic depth:
- **Front Layer** - Large, slow-moving emojis
- **Middle Layer** - Medium-sized emojis
- **Back Layer** - Smaller, faster emojis with subtle blur

### Performance Optimized
- **Auto-cleanup** - Emojis are removed from DOM after animation
- **GPU acceleration** - Uses CSS transforms for smooth 60fps
- **Lightweight** - Minimal overhead, won't slow down your site

### Accessibility
- Respects `prefers-reduced-motion`
- Keyboard accessible controls
- Screen reader friendly

## 🛠️ Build It Yourself

Clone and customize:

```bash
git clone https://github.com/yourusername/emoji-rain-parallax.git
cd emoji-rain-parallax
npm install
npm run build:all
```

### Available Scripts

- `npm run demo` - Development server with hot reload
- `npm run widget-demo` - Test widget generator
- `npm run build` - Build React component
- `npm run build:widget` - Build standalone widget
- `npm run build:all` - Build everything

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)
- ⚠️ IE11 (with polyfills)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License © 2024 Conzeon AB Jesper Wilfing

## 🌐 Links

- **[Live Demo](https://yourusername.github.io/emoji-rain-parallax)** - Try it now!
- **[NPM Package](https://www.npmjs.com/package/emoji-rain-parallax)**
- **[GitHub Repository](https://github.com/yourusername/emoji-rain-parallax)**
- **[Widget Generator](https://yourusername.github.io/emoji-rain-parallax)** - Get your code

## 💖 Show Your Support

If you find this project helpful, please:
- ⭐ Star the repo on GitHub
- 🐦 Share on Twitter with #EmojiRain
- 📝 Write a blog post about how you're using it
- 🔗 Link to it from your project

## 🎉 Made With Emoji Rain

Using Emoji Rain in your project? [Add it to our showcase!](https://github.com/yourusername/emoji-rain-parallax/issues/new?template=showcase.md)

---

**Built with ❤️ by [Jesper Wilfing](https://github.com/jesperwilfing)**
