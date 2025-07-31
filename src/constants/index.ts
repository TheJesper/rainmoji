// constants/index.ts - Global constants and configuration

export const APP_CONFIG = {
  // Performance limits
  MAX_EMOJIS: 200,
  CLEANUP_INTERVAL: 2000, // ms
  ANIMATION_FRAME_THROTTLE: 16, // ~60fps
  
  // Default values
  DEFAULT_BASE_SPEED: 50,
  DEFAULT_EMOJI_SET: ['🌟', '💫', '✨', '🎉', '🎊', '⭐', '🌈'],
  
  // Animation timings
  DEFAULT_FADE_DURATION: 0.5, // seconds
  DEFAULT_RAIN_INTERVAL: 3000, // ms
  MIN_FALL_DURATION: 0.1, // seconds
  MAX_FALL_DURATION: 10, // seconds
  
  // Size constraints
  MIN_FONT_SIZE: 10, // px
  MAX_FONT_SIZE: 100, // px
  SCREEN_BUFFER: 200, // px
  
  // Layer defaults
  DEFAULT_LAYER_RATIOS: {
    front: 2,
    middle: 3,
    back: 5,
  },
  
  // Z-index ranges
  Z_INDEX_BASE: 10,
  Z_INDEX_RANGE: {
    MIN: 1,
    MAX: 9999,
  },
} as const;

// Feature flags (can be overridden by environment variables)
export const FEATURES = {
  ENABLE_PERFORMANCE_MONITORING: process.env.NODE_ENV === 'development',
  ENABLE_DEBUG_LOGGING: process.env.NODE_ENV === 'development',
  ENABLE_ERROR_BOUNDARIES: true,
  ENABLE_MEMORY_OPTIMIZATION: true,
} as const;

// Export type for the config
export type AppConfig = typeof APP_CONFIG;
export type Features = typeof FEATURES;