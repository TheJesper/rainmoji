// EmojiRain.tsx - Main component for emoji rain effect
import React, { useCallback, useEffect, useMemo } from 'react';
import { EmojiRainProps, Emoji, LayerKey } from '../types/emoji.types';
import { useEmojiRain } from '../hooks/useEmojiRain';
import { useZIndexManager } from '../hooks/useZIndexManager';
import EmojiParticle from './EmojiParticle';
import EmojiRainControls from './EmojiRainControls';
import { parallaxConfig as defaultConfig } from '../config/parallaxConfig';

const EmojiRain: React.FC<EmojiRainProps> = ({
  emojiSet = defaultConfig.defaultEmojis,
  showControls = true,
  containerStyle = {},
  className = '',
  autoPlay = false,
  parallaxEnabled = true,
  blurEnabled = true,
  baseSpeed = 50,
}) => {
  // Validate props
  const validatedEmojiSet = useMemo(() => {
    if (!Array.isArray(emojiSet) || emojiSet.length === 0) {
      console.warn('Invalid or empty emojiSet provided, using defaults');
      return defaultConfig.defaultEmojis;
    }
    return emojiSet.filter(emoji => typeof emoji === 'string' && emoji.length > 0);
  }, [emojiSet]);
  
  const validatedBaseSpeed = useMemo(() => {
    const speed = Number(baseSpeed);
    if (isNaN(speed) || speed < 0 || speed > 100) {
      console.warn('Invalid baseSpeed provided, using default: 50');
      return 50;
    }
    return speed;
  }, [baseSpeed]);
  // Create config with component props
  const config = useMemo(() => ({
    ...defaultConfig,
    defaultEmojis: validatedEmojiSet,
    baseSpeed: validatedBaseSpeed,
  }), [validatedEmojiSet, validatedBaseSpeed]);
  
  // Custom hooks
  const { state, dispatch, createEmoji, distributeEmojis, getRandomValue } = useEmojiRain(
    config,
    parallaxEnabled,
    blurEnabled
  );
  
  const { zIndexState, setMode, setBaseZIndex, updateLayerZIndex, config: zIndexConfig } = useZIndexManager(config);
  
  // Memoized styles
  const containerStyles = useMemo(() => ({
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none' as const,
    overflow: 'hidden',
    zIndex: 10,
    ...containerStyle,
  }), [containerStyle]);
  
  // Actions
  const triggerRain = useCallback(() => {
    const count = 20;
    const newEmojis: Emoji[] = [];
    
    if (parallaxEnabled) {
      const distribution = distributeEmojis(count);
      
      // Create emojis for back and middle layers
      (['back', 'middle'] as LayerKey[]).forEach(layer => {
        for (let i = 0; i < distribution[layer]; i++) {
          const randomEmoji = validatedEmojiSet[Math.floor(Math.random() * validatedEmojiSet.length)] ?? validatedEmojiSet[0] ?? '✨';
          newEmojis.push(createEmoji(randomEmoji, true, layer));
        }
      });
      
      // Handle front layer with interval
      if (distribution.front > 0) {
        let frontRemaining = distribution.front;
        const slowestLayerTime = Math.max(
          ...Object.values(zIndexConfig.layerProperties).map(layer => {
            const maxSpeed = layer.speedRange[1];
            return (maxSpeed / 10) * 10; // Simplified calculation
          })
        );
        const intervalTime = (slowestLayerTime * 1000) / (frontRemaining || 1);
        
        const interval = setInterval(() => {
          if (frontRemaining <= 0) {
            clearInterval(interval);
            dispatch({ type: 'SET_INTERVAL', payload: { key: 'front', value: null } });
          } else {
            const randomEmoji = validatedEmojiSet[Math.floor(Math.random() * validatedEmojiSet.length)] ?? validatedEmojiSet[0] ?? '✨';
            dispatch({ type: 'ADD_EMOJIS', payload: [createEmoji(randomEmoji, true, 'front')] });
            frontRemaining--;
          }
        }, intervalTime);
        
        dispatch({ type: 'SET_INTERVAL', payload: { key: 'front', value: interval } });
      }
    } else {
      for (let i = 0; i < count; i++) {
        const randomEmoji = validatedEmojiSet[Math.floor(Math.random() * validatedEmojiSet.length)] ?? validatedEmojiSet[0] ?? '✨';
        newEmojis.push(createEmoji(randomEmoji, true, 'middle'));
      }
    }
    
    dispatch({ type: 'ADD_EMOJIS', payload: newEmojis });
  }, [validatedEmojiSet, parallaxEnabled, createEmoji, distributeEmojis, dispatch, zIndexConfig]);
  
  const showSingleEmoji = useCallback(() => {
    const randomEmoji = validatedEmojiSet[Math.floor(Math.random() * validatedEmojiSet.length)] ?? validatedEmojiSet[0] ?? '✨';
    dispatch({ type: 'ADD_EMOJIS', payload: [createEmoji(randomEmoji, true)] });
  }, [validatedEmojiSet, createEmoji, dispatch]);
  
  const dropSingleEmoji = useCallback(() => {
    showSingleEmoji();
  }, [showSingleEmoji]);
  
  const rainFewEmojis = useCallback(() => {
    const count = 5;
    const newEmojis: Emoji[] = [];
    
    if (parallaxEnabled) {
      const distribution = distributeEmojis(count);
      
      (['front', 'middle', 'back'] as LayerKey[]).forEach(layer => {
        for (let i = 0; i < distribution[layer]; i++) {
          const randomEmoji = validatedEmojiSet[Math.floor(Math.random() * validatedEmojiSet.length)] ?? validatedEmojiSet[0] ?? '✨';
          newEmojis.push(createEmoji(randomEmoji, true, layer));
        }
      });
    } else {
      for (let i = 0; i < count; i++) {
        const randomEmoji = validatedEmojiSet[Math.floor(Math.random() * validatedEmojiSet.length)] ?? validatedEmojiSet[0] ?? '✨';
        newEmojis.push(createEmoji(randomEmoji, true, 'middle'));
      }
    }
    
    dispatch({ type: 'ADD_EMOJIS', payload: newEmojis });
  }, [validatedEmojiSet, parallaxEnabled, createEmoji, distributeEmojis, dispatch]);
  
  const startContinuousRain = useCallback(() => {
    // Clear existing continuous interval
    if (state.intervals.continuous) {
      clearInterval(state.intervals.continuous);
    }
    
    dispatch({ type: 'SET_RAINING', payload: true });
    
    // Start with immediate rain
    triggerRain();
    
    // Continue raining every 3 seconds
    const interval = setInterval(() => {
      triggerRain();
    }, 3000);
    
    dispatch({ type: 'SET_INTERVAL', payload: { key: 'continuous', value: interval } });
  }, [state.intervals.continuous, dispatch, triggerRain]);
  
  const stopRain = useCallback(() => {
    if (state.intervals.continuous) {
      clearInterval(state.intervals.continuous);
      dispatch({ type: 'SET_INTERVAL', payload: { key: 'continuous', value: null } });
    }
    if (state.intervals.front) {
      clearInterval(state.intervals.front);
      dispatch({ type: 'SET_INTERVAL', payload: { key: 'front', value: null } });
    }
    dispatch({ type: 'SET_RAINING', payload: false });
  }, [state.intervals, dispatch]);
  
  const clearEmojis = useCallback(() => {
    // Stop all intervals
    stopRain();
    
    // Mark emojis for fading
    const emojiIds = state.emojis.map(e => e.id);
    dispatch({ type: 'SET_FADING', payload: emojiIds });
    
    // Clear emojis with staggered timing
    emojiIds.forEach((id) => {
      const randomDelay = Math.random() * 1700;
      const fadeOutDuration = getRandomValue(0.1, 0.3);
      
      setTimeout(() => {
        dispatch({ type: 'REMOVE_EMOJI', payload: id });
      }, randomDelay + (fadeOutDuration * 1000));
    });
    
    // Clear fading set after animations complete
    setTimeout(() => {
      dispatch({ type: 'CLEAR_FADING' });
    }, 2000);
  }, [state.emojis, stopRain, dispatch, getRandomValue]);
  
  // Auto play effect
  useEffect(() => {
    if (autoPlay) {
      triggerRain();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]); // Only run on mount/autoPlay change
  
  return (
    <>
      <style>{`
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
        @keyframes fadeout {
          0% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        .emoji {
          position: absolute;
          top: -50px;
          animation: fall linear forwards;
          transform: translateY(-100%);
          transition: opacity 0.5s ease-out;
          will-change: transform, opacity;
        }
        .emoji.fading {
          animation: fall linear forwards, fadeout var(--fade-duration) ease-out forwards;
        }
        .emoji-inner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          transform-origin: center center;
          animation: spin linear infinite;
          will-change: transform;
        }
      `}</style>
      
      {showControls && (
        <EmojiRainControls
          onTriggerRain={triggerRain}
          onShowSingle={showSingleEmoji}
          onDropSingle={dropSingleEmoji}
          onRainFew={rainFewEmojis}
          onStartContinuous={startContinuousRain}
          onStopRain={stopRain}
          onClearEmojis={clearEmojis}
          zIndexState={zIndexState}
          onModeChange={setMode}
          onBaseZIndexChange={setBaseZIndex}
          onLayerZIndexChange={updateLayerZIndex}
          config={zIndexConfig}
          isRaining={state.isRaining}
        />
      )}
      
      <div
        className={`rain-container ${className}`}
        style={containerStyles}
        role="region"
        aria-label="Emoji rain animation area"
      >
        {state.emojis.map(emoji => (
          <EmojiParticle
            key={emoji.id}
            emoji={emoji}
            isFading={state.fadingEmojis.has(emoji.id)}
            fadeOutDuration={getRandomValue(0.2, 0.8)}
          />
        ))}
      </div>
    </>
  );
};

export default EmojiRain;