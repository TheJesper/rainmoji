// useEmojiRain.js v0.0.1
import { useEffect, useRef, useState } from 'react';
import { parallaxConfig } from '../config/parallaxConfig';

const useEmojiRain = (emojiSet, containerRef) => {
  const [isRaining, setIsRaining] = useState(false);
  const emojisRef = useRef([]);
  const animationFrameRef = useRef();

  // Function to create a single emoji element
  const createEmoji = (emoji, layer) => {
    const element = document.createElement('div');
    const size = Math.random() * 30 + 20; // Random size between 20-50px
    const startX = Math.random() * window.innerWidth;
    const startY = -100; // Start above viewport
    
    element.textContent = emoji;
    element.style.position = 'absolute';
    element.style.fontSize = `${size}px`;
    element.style.left = `${startX}px`;
    element.style.top = `${startY}px`;
    element.style.userSelect = 'none';
    element.style.pointerEvents = 'none';
    element.style.zIndex = layer;
    
    const emojiData = {
      element,
      x: startX,
      y: startY,
      size,
      speed: Math.random() * 2 + 1, // Random speed 1-3
      swaySpeed: Math.random() * 0.02 + 0.01,
      swayAmount: Math.random() * 30 + 10,
      rotation: 0,
      rotationSpeed: Math.random() * 4 - 2 // -2 to 2 degrees per frame
    };
    
    containerRef.current.appendChild(element);
    return emojiData;
  };

  // Animation loop
  const animate = () => {
    emojisRef.current = emojisRef.current.filter(emojiData => {
      const { element, x, y, speed, swaySpeed, swayAmount, rotation, rotationSpeed } = emojiData;
      
      // Update position
      emojiData.y += speed;
      const swayX = Math.sin(emojiData.y * swaySpeed) * swayAmount;
      emojiData.rotation += rotationSpeed;
      
      // Apply transforms
      element.style.transform = `translateX(${swayX}px) rotate(${emojiData.rotation}deg)`;
      element.style.top = `${emojiData.y}px`;
      
      // Remove emoji if it goes off screen
      if (emojiData.y > window.innerHeight + 100) {
        element.remove();
        return false;
      }
      
      return true;
    });
    
    if (emojisRef.current.length > 0 || isRaining) {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  // Start raining emojis
  const triggerRain = () => {
    setIsRaining(true);
    
    // Create multiple layers of emojis
    const layers = 3; // Default to 3 layers (front, middle, back)
    const emojisPerLayer = 10; // Default to 10 emojis per layer
    
    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < emojisPerLayer; i++) {
        setTimeout(() => {
          const randomEmoji = emojiSet[Math.floor(Math.random() * emojiSet.length)];
          const emojiData = createEmoji(randomEmoji, layer);
          emojisRef.current.push(emojiData);
        }, Math.random() * 2000); // Stagger creation over 2 seconds
      }
    }
    
    // Start animation if not already running
    if (!animationFrameRef.current) {
      animate();
    }
    
    // Stop generating new emojis after duration
    setTimeout(() => {
      setIsRaining(false);
    }, parallaxConfig.duration || 5000);
  };

  // Clear all emojis
  const clearAllEmojis = () => {
    setIsRaining(false);
    emojisRef.current.forEach(({ element }) => element.remove());
    emojisRef.current = [];
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearAllEmojis();
    };
  }, []);

  return { triggerRain, clearAllEmojis };
};

export default useEmojiRain;