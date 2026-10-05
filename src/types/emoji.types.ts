// emoji.types.ts - Type definitions for the emoji rain component

export interface Emoji {
  id: string;
  emoji: string;
  x: number;
  y: number;
  fontSize: number;
  fallDuration: number;
  delay: number;
  blur: number;
  zIndex: number;
  drop: boolean;
  spinDuration: number;
  createdAt: number;
}

export type LayerKey = 'front' | 'middle' | 'back';

export type ZIndexMode = 'individual' | 'relative' | 'allTop' | 'allBehind' | 'interactive';

export interface LayerProperties {
  speedRange: [number, number];
  blurRange: [number, number];
  zIndex: number;
  fontSizeRange: [number, number];
  delayRange: [number, number];
}

export interface ParallaxConfig {
  layerProperties: Record<LayerKey, LayerProperties>;
  layerRatios: Record<LayerKey, number>;
  defaultEmojis: string[];
  baseSpeed: number;
}

export interface EmojiRainProps {
  emojiSet?: string[];
  showControls?: boolean;
  containerStyle?: React.CSSProperties;
  className?: string;
  autoPlay?: boolean;
  parallaxEnabled?: boolean;
  blurEnabled?: boolean;
  baseSpeed?: number;
}

export interface RainState {
  emojis: Emoji[];
  fadingEmojis: Set<string>;
  isRaining: boolean;
  intervals: {
    front: NodeJS.Timeout | null;
    continuous: NodeJS.Timeout | null;
    cleanup: NodeJS.Timeout | null;
  };
}

export interface ZIndexState {
  mode: ZIndexMode;
  baseZIndex: number;
  clickedElementZIndex: number | null;
}

export type RainAction = 
  | { type: 'ADD_EMOJIS'; payload: Emoji[] }
  | { type: 'REMOVE_EMOJI'; payload: string }
  | { type: 'SET_FADING'; payload: string[] }
  | { type: 'CLEAR_FADING' }
  | { type: 'SET_RAINING'; payload: boolean }
  | { type: 'SET_INTERVAL'; payload: { key: keyof RainState['intervals']; value: NodeJS.Timeout | null } }
  | { type: 'CLEAR_ALL' }
  | { type: 'CLEANUP_OFFSCREEN' };