// EmojiRain.jsx v0.0.2
import React, { useRef, useEffect, useState } from "react";
import { parallaxConfig } from "../config/parallaxConfig";

const EmojiRain = ({ 
  emojiSet = parallaxConfig.defaultEmojis,
  showControls = true,
  containerStyle = {},
  className = "",
  autoPlay = false,
  parallaxEnabled = true,
  blurEnabled = true,
  baseSpeed = 50
}) => {
  const containerRef = useRef(null);
  const [emojis, setEmojis] = useState([]);
  const [frontInterval, setFrontInterval] = useState(null);
  const [fadingEmojis, setFadingEmojis] = useState(new Set());
  const [isRaining, setIsRaining] = useState(false);
  
  // Configure initial values
  const config = useRef({
    layerProperties: { ...parallaxConfig.layerProperties },
    layerRatios: { ...parallaxConfig.layerRatios },
    defaultEmojis: emojiSet,
    baseSpeed: baseSpeed
  });

  const SPEED_ADJUSTMENT_FACTOR = 50 / 30;

  const getRandomValue = (min, max) => Math.random() * (max - min) + min;

  const convertSpeedToFallDuration = (speedValue) => {
    let adjustedSpeed = config.current.baseSpeed / SPEED_ADJUSTMENT_FACTOR;
    if (adjustedSpeed < 0) adjustedSpeed = 0;
    if (adjustedSpeed > 100) adjustedSpeed = 100;
    if (adjustedSpeed === 0) {
      return Number.POSITIVE_INFINITY;
    }
    const minDuration = 1;
    const maxDuration = 10;
    const fraction = speedValue / 10;
    let baseDuration = fraction * (maxDuration - minDuration) + minDuration;
    let fallDuration = baseDuration * (10 / adjustedSpeed);
    return fallDuration;
  };

  const createDepthProperties = (layerKey) => {
    const layerConfig = config.current.layerProperties[layerKey];
    const randomSpeed = getRandomValue(...layerConfig.speedRange);
    const fallDuration = convertSpeedToFallDuration(randomSpeed);
    const blurAmount = getRandomValue(...layerConfig.blurRange);
    const finalFontSize = getRandomValue(...layerConfig.fontSizeRange);
    const randomDelay = getRandomValue(...layerConfig.delayRange);
    return {
      depth: layerKey,
      finalFontSize,
      fallDuration,
      blurAmount,
      delay: randomDelay,
      zIndex: layerConfig.zIndex
    };
  };

  const distributeEmojis = (totalCount) => {
    const { layerRatios } = config.current;
    const ratioSum = Object.values(layerRatios).reduce((a, b) => a + b, 0);
    const distribution = {
      front: (layerRatios.front / ratioSum) * totalCount,
      middle: (layerRatios.middle / ratioSum) * totalCount,
      back: (layerRatios.back / ratioSum) * totalCount,
    };
    const roundedDistribution = {};
    let allocatedCount = 0;
    for (let layer in distribution) {
      roundedDistribution[layer] = Math.round(distribution[layer]);
      allocatedCount += roundedDistribution[layer];
    }
    let remainder = totalCount - allocatedCount;
    while (remainder !== 0) {
      for (let layer in roundedDistribution) {
        if (remainder > 0) {
          roundedDistribution[layer]++;
          remainder--;
          if (remainder === 0) break;
        } else {
          if (roundedDistribution[layer] > 0) {
            roundedDistribution[layer]--;
            remainder++;
            if (remainder === 0) break;
          }
        }
      }
    }
    return roundedDistribution;
  };

  const createEmoji = (emojiChar, drop = false, layerKey = null) => {
    const xPosition = getRandomValue(0, window.innerWidth);
    
    if (!layerKey) {
      if (parallaxEnabled) {
        const ratioSum = Object.values(config.current.layerRatios).reduce((a, b) => a + b, 0);
        const randomVal = getRandomValue(0, ratioSum);
        let cumulative = 0;
        for (let layer in config.current.layerRatios) {
          cumulative += config.current.layerRatios[layer];
          if (randomVal <= cumulative) {
            layerKey = layer;
            break;
          }
        }
      } else {
        layerKey = 'middle';
      }
    }
    
    const depthProps = createDepthProperties(layerKey);
    const {
      finalFontSize,
      fallDuration,
      blurAmount,
      delay,
      zIndex
    } = depthProps;
    
    const emojiId = Date.now() + Math.random();
    
    return {
      id: emojiId,
      emoji: emojiChar,
      x: xPosition,
      y: drop ? -50 : window.innerHeight / 2,
      fontSize: finalFontSize,
      fallDuration: isFinite(fallDuration) ? fallDuration : 0,
      delay: drop ? delay : 0,
      blur: blurEnabled ? blurAmount : 0,
      zIndex,
      drop,
      spinDuration: getRandomValue(2, 4),
      createdAt: Date.now()
    };
  };

  const triggerRain = () => {
    // Allow multiple triggers by not checking if already raining
    const count = 20;
    const newEmojis = [];
    
    if (parallaxEnabled) {
      const distribution = distributeEmojis(count);
      
      // Handle back layer
      for (let i = 0; i < distribution.back; i++) {
        const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
        newEmojis.push(createEmoji(randomEmoji, true, 'back'));
      }
      
      // Handle middle layer
      for (let i = 0; i < distribution.middle; i++) {
        const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
        newEmojis.push(createEmoji(randomEmoji, true, 'middle'));
      }
      
      // Handle front layer with interval
      if (distribution.front > 0) {
        let frontRemaining = distribution.front;
        const slowestLayerTime = Math.max(
          ...Object.keys(config.current.layerProperties).map(layer => {
            const layerConf = config.current.layerProperties[layer];
            return convertSpeedToFallDuration(layerConf.speedRange[1]);
          })
        );
        const intervalTime = (slowestLayerTime * 1000) / (frontRemaining || 1);
        
        const interval = setInterval(() => {
          if (frontRemaining <= 0) {
            clearInterval(interval);
          } else {
            const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
            setEmojis(prev => [...prev, createEmoji(randomEmoji, true, 'front')]);
            frontRemaining--;
          }
        }, intervalTime);
      }
    } else {
      for (let i = 0; i < count; i++) {
        const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
        newEmojis.push(createEmoji(randomEmoji, true, 'middle'));
      }
    }
    
    setEmojis(prev => [...prev, ...newEmojis]);
  };

  const showSingleEmoji = () => {
    const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
    const emoji = createEmoji(randomEmoji, false);
    setEmojis(prev => [...prev, emoji]);
    
    // Start drop after delay
    setTimeout(() => {
      setEmojis(prev => prev.map(e => 
        e.id === emoji.id 
          ? { ...e, drop: true, x: Math.random() * window.innerWidth, y: -50 }
          : e
      ));
    }, 1000);
  };

  const clearEmojis = () => {
    if (frontInterval) {
      clearInterval(frontInterval);
      setFrontInterval(null);
    }
    setIsRaining(false);
    
    // Mark emojis for fading and remove them with staggered timing
    const emojiIds = emojis.map(e => e.id);
    setFadingEmojis(new Set(emojiIds));
    
    // Stagger the removal of emojis with random delays
    emojiIds.forEach((id, index) => {
      const delay = Math.random() * 500; // 0-500ms random delay
      const fadeOutDuration = getRandomValue(0.2, 0.8);
      
      setTimeout(() => {
        setEmojis(prev => prev.filter(e => e.id !== id));
      }, delay + (fadeOutDuration * 1000));
    });
    
    // Clear the fading set after all animations
    setTimeout(() => {
      setFadingEmojis(new Set());
    }, 1500);
  };

  // Clean up off-screen emojis for memory management
  useEffect(() => {
    const cleanupOffScreenEmojis = () => {
      const now = Date.now();
      
      setEmojis(prev => prev.filter(emoji => {
        // Keep emojis that are still visible or being faded out
        if (fadingEmojis.has(emoji.id)) return true;
        if (!emoji.drop) return true;
        
        // Calculate actual position based on animation timing
        const timeElapsed = (now - emoji.createdAt - emoji.delay * 1000) / 1000;
        
        if (timeElapsed < 0) return true; // Animation hasn't started yet
        
        const progress = timeElapsed / emoji.fallDuration;
        const estimatedY = -50 + (window.innerHeight + 200) * progress;
        
        // Remove emojis that have fallen below screen + buffer
        return estimatedY < window.innerHeight + 200;
      }));
    };

    // Run cleanup every 2 seconds
    const cleanupInterval = setInterval(cleanupOffScreenEmojis, 2000);

    return () => {
      clearInterval(cleanupInterval);
      if (frontInterval) {
        clearInterval(frontInterval);
      }
      if (continuousRainInterval) {
        clearInterval(continuousRainInterval);
      }
    };
  }, [frontInterval, continuousRainInterval, fadingEmojis]);

  // Auto play
  useEffect(() => {
    if (autoPlay) {
      triggerRain();
    }
  }, [autoPlay]);

  // Styles for the component
  const styles = {
    rainContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      overflow: 'hidden',
      zIndex: 10,
      ...containerStyle
    },
    controlsContainer: {
      position: 'absolute',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 20,
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    button: {
      padding: '10px 20px',
      fontSize: '16px',
      backgroundColor: '#007BFF',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer'
    }
  };

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
        <div style={styles.controlsContainer}>
          <button style={styles.button} onClick={() => triggerRain()}>Make it Rain!</button>
          <button style={styles.button} onClick={showSingleEmoji}>Show Single Emoji</button>
          <button style={styles.button} onClick={startContinuousRain}>Start Continuous Rain</button>
          <button style={styles.button} onClick={stopRain}>Stop Rain</button>
          <button style={styles.button} onClick={clearEmojis}>Clear Emojis</button>
        </div>
      )}
      
      <div 
        ref={containerRef} 
        className={`rain-container ${className}`}
        style={styles.rainContainer}
      >
        {emojis.map(emoji => (
          <div
            key={emoji.id}
            className={`emoji ${fadingEmojis.has(emoji.id) ? 'fading' : ''}`}
            style={{
              left: `${emoji.x}px`,
              top: emoji.drop ? `-50px` : `${emoji.y}px`,
              transform: emoji.drop ? '' : 'translate(-50%, -50%)',
              zIndex: emoji.zIndex,
              animationDuration: emoji.drop ? `${emoji.fallDuration}s` : '0s',
              animationDelay: `${emoji.delay}s`,
              animationName: emoji.drop && emoji.fallDuration > 0 ? 'fall' : 'none',
              '--fade-duration': fadingEmojis.has(emoji.id) ? `${getRandomValue(0.2, 0.8)}s` : '0s'
            }}
          >
            <div
              className="emoji-inner"
              style={{
                fontSize: `${emoji.fontSize}px`,
                animationDuration: `${emoji.spinDuration}s`,
                animationDelay: '0s',
                filter: `blur(${emoji.blur}px)`
              }}
            >
              {emoji.emoji}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmojiRain;