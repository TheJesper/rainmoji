// parallaxConfig.ts - Configuration for parallax layers
import { ParallaxConfig } from '../types/emoji.types';

export const parallaxConfig: ParallaxConfig = {
  layerProperties: {
    front: {
      speedRange: [0, 2],
      blurRange: [1, 2],
      zIndex: 3,
      fontSizeRange: [48, 72],
      delayRange: [0, 0.2],
    },
    middle: {
      speedRange: [4, 6],
      blurRange: [0, 0],
      zIndex: 2,
      fontSizeRange: [16, 32],
      delayRange: [0, 0.1],
    },
    back: {
      speedRange: [7, 10],
      blurRange: [2, 3],
      zIndex: 1,
      fontSizeRange: [8, 14],
      delayRange: [0, 0.2],
    },
  },
  layerRatios: {
    front: 100,
    middle: 300,
    back: 70,
  },
  defaultEmojis: ["🥗", "🍕", "🥪", "🍔", "🍎", "🍇"],
  baseSpeed: 50,
};