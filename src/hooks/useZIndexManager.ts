// useZIndexManager.ts - Custom hook for z-index management

import { useState, useEffect, useCallback, useRef } from 'react';
import { ZIndexMode, ZIndexState, ParallaxConfig } from '../types/emoji.types';

export function useZIndexManager(initialConfig: ParallaxConfig): {
  zIndexState: ZIndexState;
  setMode: (mode: ZIndexMode) => void;
  setBaseZIndex: (baseZIndex: number) => void;
  updateLayerZIndex: (layer: keyof ParallaxConfig['layerProperties'], value: number) => void;
  config: ParallaxConfig;
} {
  const [zIndexState, setZIndexState] = useState<ZIndexState>({
    mode: 'individual',
    baseZIndex: 10,
    clickedElementZIndex: null,
  });
  
  const configRef = useRef(initialConfig);
  
  const updateZIndexValues = useCallback(() => {
    const { mode, baseZIndex, clickedElementZIndex } = zIndexState;
    
    switch (mode) {
      case 'individual':
        // Use individual values as they are
        break;
        
      case 'relative':
        configRef.current.layerProperties.middle.zIndex = baseZIndex;
        configRef.current.layerProperties.front.zIndex = baseZIndex + 1;
        configRef.current.layerProperties.back.zIndex = baseZIndex - 1;
        break;
        
      case 'allTop':
        configRef.current.layerProperties.front.zIndex = 9999;
        configRef.current.layerProperties.middle.zIndex = 9999;
        configRef.current.layerProperties.back.zIndex = 9999;
        break;
        
      case 'allBehind':
        configRef.current.layerProperties.front.zIndex = 0;
        configRef.current.layerProperties.middle.zIndex = 0;
        configRef.current.layerProperties.back.zIndex = 0;
        break;
        
      case 'interactive':
        if (clickedElementZIndex !== null) {
          configRef.current.layerProperties.back.zIndex = Math.max(0, clickedElementZIndex - 10);
          configRef.current.layerProperties.middle.zIndex = clickedElementZIndex + 1;
          configRef.current.layerProperties.front.zIndex = 9999;
        } else {
          configRef.current.layerProperties.back.zIndex = 1;
          configRef.current.layerProperties.middle.zIndex = 10;
          configRef.current.layerProperties.front.zIndex = 9999;
        }
        break;
    }
  }, [zIndexState]);
  
  // Update z-index values when state changes
  useEffect(() => {
    updateZIndexValues();
  }, [updateZIndexValues]);
  
  // Global click handler for interactive mode
  useEffect(() => {
    if (zIndexState.mode !== 'interactive') return;
    
    const handleGlobalClick = (e: MouseEvent): void => {
      const element = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(element);
      const zIndex = computedStyle.getPropertyValue('z-index');
      const parsedZIndex = zIndex === 'auto' || !zIndex ? 0 : parseInt(zIndex, 10);
      
      setZIndexState(prev => ({
        ...prev,
        clickedElementZIndex: parsedZIndex,
      }));
      
      // Visual feedback
      element.style.transition = 'all 0.3s ease';
      element.style.transform = 'scale(1.05)';
      element.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
      
      setTimeout(() => {
        element.style.transform = '';
        element.style.boxShadow = '';
      }, 300);
    };
    
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [zIndexState.mode]);
  
  const setMode = useCallback((mode: ZIndexMode) => {
    setZIndexState(prev => ({ ...prev, mode }));
  }, []);
  
  const setBaseZIndex = useCallback((baseZIndex: number) => {
    setZIndexState(prev => ({ ...prev, baseZIndex }));
  }, []);
  
  const updateLayerZIndex = useCallback((layer: keyof ParallaxConfig['layerProperties'], value: number) => {
    configRef.current.layerProperties[layer].zIndex = value;
    // Force re-render by updating state
    setZIndexState(prev => ({ ...prev }));
  }, []);
  
  return {
    zIndexState,
    setMode,
    setBaseZIndex,
    updateLayerZIndex,
    config: configRef.current,
  };
}