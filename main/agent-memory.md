## EmojiRainParalax Project Memory

### Core Structure
- React component: `/src/components/EmojiRain.jsx` 
- Original demo: `/public/originalDemo.html`
- Config: `/src/config/parallaxConfig.js`
- Hooks: `useEmojiRain.js`, `useEmojiLayers.js`

### Key Features Implemented
- Parallax 3-layer system (front/middle/back) with blur/speed/size variants
- Continuous rain with memory cleanup (auto-remove off-screen)
- Control panel with modern glassmorphism design, organized sections
- Clear function: random delays 0-1.7s, quick fade 0.1-0.3s, max 2s total
- Single emoji spawn from above (not center) - fixed
- Webpack security: updated v3→v5, fixed 14 vulnerabilities
- Windows compatibility: npx in package.json scripts

### Technical Details
- CSS animations outperform React due to hardware acceleration
- Memory management: cleanup every 2s, fade-out on clear
- Task system: agent-tasklist.md → agent-task.done.md workflow

### Recent Updates
- Fixed front layer speedRange bug: [0,0] → [0,2] 
- Added dropSingleEmoji() and rainFewEmojis(5) functions to React component
- Added missing control buttons to React UI
- Enhanced feature parity between React and original demo
- Added comprehensive z-index controls with 4 modes:
  - Individual: Set each layer z-index separately
  - Relative: Set middle layer, others auto ±1
  - Auto Front: All emojis on top (z-index 20)
  - Auto Back: All emojis on back (z-index 1)

### Status
All major tasks completed. Both implementations now have advanced z-index control with modern UI design.
