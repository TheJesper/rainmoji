// useEmojiRain.ts - Custom hook for emoji rain logic

import { useReducer, useCallback, useRef, useEffect } from 'react';
import { Emoji, RainState, RainAction, LayerKey, ParallaxConfig } from '../types/emoji.types';

const SPEED_ADJUSTMENT_FACTOR = 50 / 30;
const MAX_EMOJIS = 200; // Maximum number of emojis to prevent performance issues

const initialState: RainState = {
  emojis: [],
  fadingEmojis: new Set(),
  isRaining: false,
  intervals: {
    front: null,
    continuous: null,
    cleanup: null,
  },
};

function rainReducer(state: RainState, action: RainAction): RainState {
  switch (action.type) {
    case 'ADD_EMOJIS': {
      const currentCount = state.emojis.length;
      const newEmojis = action.payload;
      const availableSlots = Math.max(0, MAX_EMOJIS - currentCount);
      
      if (availableSlots === 0) {
        console.warn(`Maximum emoji limit (${MAX_EMOJIS}) reached. Skipping new emojis.`);
        return state;
      }
      
      const emojisToAdd = newEmojis.slice(0, availableSlots);
      
      if (emojisToAdd.length < newEmojis.length) {
        console.warn(`Adding only ${emojisToAdd.length} of ${newEmojis.length} emojis due to limit.`);
      }
      
      return {
        ...state,
        emojis: [...state.emojis, ...emojisToAdd],
      };
    }
    
    case 'REMOVE_EMOJI':
      return {
        ...state,
        emojis: state.emojis.filter(e => e.id !== action.payload),
      };
    
    case 'SET_FADING':
      return {
        ...state,
        fadingEmojis: new Set(action.payload),
      };
    
    case 'CLEAR_FADING':
      return {
        ...state,
        fadingEmojis: new Set(),
      };
    
    case 'SET_RAINING':
      return {
        ...state,
        isRaining: action.payload,
      };
    
    case 'SET_INTERVAL':
      return {
        ...state,
        intervals: {
          ...state.intervals,
          [action.payload.key]: action.payload.value,
        },
      };
    
    case 'CLEAR_ALL':
      // Clear all intervals
      Object.values(state.intervals).forEach(interval => {
        if (interval) clearInterval(interval);
      });
      
      return {
        ...initialState,
        fadingEmojis: new Set(state.emojis.map(e => e.id)),
      };
    
    case 'CLEANUP_OFFSCREEN': {
      const now = Date.now();
      const screenHeight = window.innerHeight;
      const buffer = 200;
      const maxY = screenHeight + buffer;
      
      const visibleEmojis = state.emojis.filter(emoji => {
        // Keep fading emojis
        if (state.fadingEmojis.has(emoji.id)) return true;
        
        // Keep non-dropping emojis
        if (!emoji.drop) return true;
        
        // Calculate elapsed time
        const timeElapsed = (now - emoji.createdAt - emoji.delay * 1000) / 1000;
        
        // Keep emojis that haven't started falling yet
        if (timeElapsed < 0) return true;
        
        // Estimate position based on linear fall animation
        const progress = emoji.fallDuration > 0 ? timeElapsed / emoji.fallDuration : 1;
        
        // If animation is complete, remove
        if (progress >= 1) return false;
        
        // Estimate Y position
        const totalDistance = screenHeight + 250; // -50 start to height+200
        const estimatedY = -50 + (totalDistance * progress);
        
        return estimatedY < maxY;
      });
      
      // Only update if there's a significant change
      if (visibleEmojis.length === state.emojis.length) {
        return state;
      }
      
      return {
        ...state,
        emojis: visibleEmojis,
      };
    }
    
    default:
      return state;
  }
}

export function useEmojiRain(config: ParallaxConfig, parallaxEnabled: boolean, blurEnabled: boolean): {
  state: RainState;
  dispatch: React.Dispatch<RainAction>;
  createEmoji: (emojiChar: string, drop?: boolean, layerKey?: LayerKey | null) => Emoji;
  distributeEmojis: (totalCount: number) => Record<LayerKey, number>;
  getRandomValue: (min: number, max: number) => number;
} {
  const [state, dispatch] = useReducer(rainReducer, initialState);
  const configRef = useRef(config);
  
  // Update config ref when config changes
  useEffect(() => {
    configRef.current = config;
  }, [config]);
  
  const getRandomValue = useCallback((min: number, max: number) => {
    if (typeof min !== 'number' || typeof max !== 'number' || min > max) {
      console.error('Invalid min/max values:', { min, max });
      return 0;
    }
    return Math.random() * (max - min) + min;
  }, []);
  
  const convertSpeedToFallDuration = useCallback((speedValue: number) => {
    try {
      let adjustedSpeed = configRef.current.baseSpeed / SPEED_ADJUSTMENT_FACTOR;
      if (adjustedSpeed < 0) adjustedSpeed = 0;
      if (adjustedSpeed > 100) adjustedSpeed = 100;
      if (adjustedSpeed === 0) {
        return Number.POSITIVE_INFINITY;
      }
      const minDuration = 1;
      const maxDuration = 10;
      const fraction = speedValue / 10;
      const baseDuration = fraction * (maxDuration - minDuration) + minDuration;
      const fallDuration = baseDuration * (10 / adjustedSpeed);
      return Math.max(0.1, fallDuration); // Ensure minimum duration
    } catch (error) {
      console.error('Error converting speed to fall duration:', error);
      return 5; // Default fallback
    }
  }, []);
  
  const createDepthProperties = useCallback((layerKey: LayerKey) => {
    try {
      const layerConfig = configRef.current.layerProperties[layerKey];
      if (!layerConfig) {
        console.error('Invalid layer key:', layerKey);
        layerKey = 'middle'; // Fallback to middle layer
      }
      
      const randomSpeed = getRandomValue(...layerConfig.speedRange);
      const fallDuration = convertSpeedToFallDuration(randomSpeed);
      const blurAmount = getRandomValue(...layerConfig.blurRange);
      const finalFontSize = getRandomValue(...layerConfig.fontSizeRange);
      const randomDelay = getRandomValue(...layerConfig.delayRange);
      
      return {
        depth: layerKey,
        finalFontSize: Math.max(10, finalFontSize),
        fallDuration,
        blurAmount: Math.max(0, blurAmount),
        delay: Math.max(0, randomDelay),
        zIndex: layerConfig.zIndex || 10
      };
    } catch (error) {
      console.error('Error creating depth properties:', error);
      return {
        depth: 'middle',
        finalFontSize: 30,
        fallDuration: 5,
        blurAmount: 0,
        delay: 0,
        zIndex: 10
      };
    }
  }, [getRandomValue, convertSpeedToFallDuration]);
  
  const distributeEmojis = useCallback((totalCount: number) => {
    const { layerRatios } = configRef.current;
    const ratioSum = Object.values(layerRatios).reduce((a, b) => a + b, 0);
    const distribution: Record<LayerKey, number> = {
      front: Math.round((layerRatios.front / ratioSum) * totalCount),
      middle: Math.round((layerRatios.middle / ratioSum) * totalCount),
      back: Math.round((layerRatios.back / ratioSum) * totalCount),
    };
    
    // Adjust for rounding errors
    const allocated = Object.values(distribution).reduce((a, b) => a + b, 0);
    let remainder = totalCount - allocated;
    
    const layers = Object.keys(distribution) as LayerKey[];
    while (remainder !== 0) {
      for (const layer of layers) {
        if (remainder > 0) {
          distribution[layer]++;
          remainder--;
        } else if (remainder < 0 && distribution[layer] > 0) {
          distribution[layer]--;
          remainder++;
        }
        if (remainder === 0) break;
      }
    }
    
    return distribution;
  }, []);
  
  const createEmoji = useCallback((
    emojiChar: string,
    drop = false,
    layerKey: LayerKey | null = null
  ): Emoji => {
    if (!emojiChar || typeof emojiChar !== 'string') {
      console.error('Invalid emoji character provided:', emojiChar);
      emojiChar = '✨'; // Fallback emoji
    }
    
    const xPosition = getRandomValue(0, Math.max(1, window.innerWidth));
    
    if (!layerKey) {
      if (parallaxEnabled) {
        const ratioSum = Object.values(configRef.current.layerRatios).reduce((a, b) => a + b, 0);
        const randomVal = getRandomValue(0, ratioSum);
        let cumulative = 0;
        
        const layers = Object.keys(configRef.current.layerRatios) as LayerKey[];
        for (const layer of layers) {
          cumulative += configRef.current.layerRatios[layer];
          if (randomVal <= cumulative) {
            layerKey = layer;
            break;
          }
        }
      } else {
        layerKey = 'middle';
      }
    }
    
    const depthProps = createDepthProperties(layerKey as LayerKey);
    const emojiId = `${Date.now()}-${Math.random()}`;
    
    return {
      id: emojiId,
      emoji: emojiChar,
      x: xPosition,
      y: drop ? -50 : window.innerHeight / 2,
      fontSize: depthProps.finalFontSize,
      fallDuration: isFinite(depthProps.fallDuration) ? depthProps.fallDuration : 0,
      delay: drop ? depthProps.delay : 0,
      blur: blurEnabled ? depthProps.blurAmount : 0,
      zIndex: depthProps.zIndex,
      drop,
      spinDuration: getRandomValue(2, 4),
      createdAt: Date.now()
    };
  }, [parallaxEnabled, blurEnabled, getRandomValue, createDepthProperties]);
  
  // Cleanup effect
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      dispatch({ type: 'CLEANUP_OFFSCREEN' });
    }, 2000);
    
    dispatch({ type: 'SET_INTERVAL', payload: { key: 'cleanup', value: cleanupInterval } });
    
    return () => {
      clearInterval(cleanupInterval);
      // Clear all intervals on unmount
      if (state.intervals.front) clearInterval(state.intervals.front);
      if (state.intervals.continuous) clearInterval(state.intervals.continuous);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return {
    state,
    dispatch,
    createEmoji,
    distributeEmojis,
    getRandomValue,
  };
}