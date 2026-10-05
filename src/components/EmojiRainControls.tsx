// EmojiRainControls.tsx - Control panel for emoji rain

import React, { memo } from 'react';
import { ZIndexMode, ZIndexState, ParallaxConfig } from '../types/emoji.types';

interface EmojiRainControlsProps {
  onTriggerRain: () => void;
  onShowSingle: () => void;
  onDropSingle: () => void;
  onRainFew: () => void;
  onStartContinuous: () => void;
  onStopRain: () => void;
  onClearEmojis: () => void;
  zIndexState: ZIndexState;
  onModeChange: (mode: ZIndexMode) => void;
  onBaseZIndexChange: (value: number) => void;
  onLayerZIndexChange: (layer: keyof ParallaxConfig['layerProperties'], value: number) => void;
  config: ParallaxConfig;
  isRaining: boolean;
}

const buttonStyle: React.CSSProperties = {
  padding: '8px 16px',
  fontSize: '14px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  fontWeight: '500',
};

const EmojiRainControls: React.FC<EmojiRainControlsProps> = memo(({
  onTriggerRain,
  onShowSingle,
  onDropSingle,
  onRainFew,
  onStartContinuous,
  onStopRain,
  onClearEmojis,
  zIndexState,
  onModeChange,
  onBaseZIndexChange,
  onLayerZIndexChange,
  config,
  isRaining,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void): void => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
  
  return (
    <div
      style={{
        position: 'absolute',
        top: '15px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '95vw',
        maxHeight: '85vh',
        overflowY: 'auto',
      }}
      role="region"
      aria-label="Emoji Rain Controls"
    >
      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#333', fontSize: '18px', fontWeight: 'bold' }}>
        🌧️ Emoji Rain Controls
      </div>
      
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
        <button
          style={buttonStyle}
          onClick={onTriggerRain}
          onKeyDown={(e) => handleKeyDown(e, onTriggerRain)}
          aria-label="Make it rain emojis"
        >
          Make it Rain!
        </button>
        <button
          style={buttonStyle}
          onClick={onShowSingle}
          onKeyDown={(e) => handleKeyDown(e, onShowSingle)}
          aria-label="Show single emoji"
        >
          Show Single Emoji
        </button>
        <button
          style={buttonStyle}
          onClick={onDropSingle}
          onKeyDown={(e) => handleKeyDown(e, onDropSingle)}
          aria-label="Drop single emoji"
        >
          Drop Single Emoji
        </button>
        <button
          style={buttonStyle}
          onClick={onRainFew}
          onKeyDown={(e) => handleKeyDown(e, onRainFew)}
          aria-label="Rain few emojis"
        >
          Rain Few Emojis
        </button>
        <button
          style={{
            ...buttonStyle,
            background: isRaining ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' : buttonStyle.background,
          }}
          onClick={isRaining ? onStopRain : onStartContinuous}
          onKeyDown={(e) => handleKeyDown(e, isRaining ? onStopRain : onStartContinuous)}
          aria-label={isRaining ? "Stop continuous rain" : "Start continuous rain"}
          aria-pressed={isRaining}
        >
          {isRaining ? 'Stop Rain' : 'Start Continuous Rain'}
        </button>
        <button
          style={buttonStyle}
          onClick={onClearEmojis}
          onKeyDown={(e) => handleKeyDown(e, onClearEmojis)}
          aria-label="Clear all emojis"
        >
          Clear Emojis
        </button>
      </div>

      <div
        style={{
          background: 'rgba(248, 249, 250, 0.8)',
          borderRadius: '10px',
          padding: '15px',
          border: '1px solid rgba(0, 0, 0, 0.08)',
        }}
      >
        <div
          style={{
            fontWeight: 'bold',
            color: '#495057',
            marginBottom: '12px',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          Z-Index Control
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '12px' }}>
          <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#495057', fontWeight: '500' }}>
            <span style={{ flex: 1 }}>Mode</span>
            <select
              value={zIndexState.mode}
              onChange={(e) => onModeChange(e.target.value as ZIndexMode)}
              style={{ marginLeft: '8px', padding: '4px 8px', border: '1px solid #dee2e6', borderRadius: '5px', fontSize: '12px', background: 'white' }}
              aria-label="Z-Index mode selection"
            >
              <option value="individual">Individual</option>
              <option value="relative">Relative</option>
              <option value="allTop">All Top (9999)</option>
              <option value="allBehind">All Behind (0)</option>
              <option value="interactive">✨ Interactive Mode</option>
            </select>
          </label>
        </div>

        {zIndexState.mode === 'individual' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#495057', fontWeight: '500' }}>
              <span style={{ flex: 1 }}>Front Z-Index</span>
              <input
                type="number"
                min="1"
                max="100"
                value={config.layerProperties.front.zIndex}
                onChange={(e) => onLayerZIndexChange('front', parseInt(e.target.value) || 3)}
                style={{ marginLeft: '8px', width: '60px', padding: '4px 8px', border: '1px solid #dee2e6', borderRadius: '5px', fontSize: '12px', background: 'white' }}
                aria-label="Front layer z-index"
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#495057', fontWeight: '500' }}>
              <span style={{ flex: 1 }}>Middle Z-Index</span>
              <input
                type="number"
                min="1"
                max="100"
                value={config.layerProperties.middle.zIndex}
                onChange={(e) => onLayerZIndexChange('middle', parseInt(e.target.value) || 2)}
                style={{ marginLeft: '8px', width: '60px', padding: '4px 8px', border: '1px solid #dee2e6', borderRadius: '5px', fontSize: '12px', background: 'white' }}
                aria-label="Middle layer z-index"
              />
            </label>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#495057', fontWeight: '500' }}>
              <span style={{ flex: 1 }}>Back Z-Index</span>
              <input
                type="number"
                min="1"
                max="100"
                value={config.layerProperties.back.zIndex}
                onChange={(e) => onLayerZIndexChange('back', parseInt(e.target.value) || 1)}
                style={{ marginLeft: '8px', width: '60px', padding: '4px 8px', border: '1px solid #dee2e6', borderRadius: '5px', fontSize: '12px', background: 'white' }}
                aria-label="Back layer z-index"
              />
            </label>
          </div>
        )}

        {zIndexState.mode === 'relative' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#495057', fontWeight: '500' }}>
              <span style={{ flex: 1 }}>Base Z-Index (Middle)</span>
              <input
                type="number"
                min="1"
                max="100"
                value={zIndexState.baseZIndex}
                onChange={(e) => onBaseZIndexChange(parseInt(e.target.value) || 10)}
                style={{ marginLeft: '8px', width: '60px', padding: '4px 8px', border: '1px solid #dee2e6', borderRadius: '5px', fontSize: '12px', background: 'white' }}
                aria-label="Base z-index for relative mode"
              />
            </label>
          </div>
        )}

        {zIndexState.mode === 'interactive' && (
          <div
            style={{
              marginTop: '12px',
              padding: '12px',
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
              borderRadius: '8px',
              border: '1px solid rgba(102, 126, 234, 0.3)',
              fontSize: '12px',
              color: '#495057',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '8px', color: '#667eea' }}>
              ✨ Interactive Mode Active
            </div>
            <div style={{ marginBottom: '4px' }}>
              Click any element on the page to set emoji layers:
            </div>
            <ul style={{ margin: '8px 0 0 20px', padding: 0, fontSize: '11px' }}>
              <li>🔷 Back layer: 10 behind clicked element</li>
              <li>🔶 Middle layer: Just above clicked element</li>
              <li>⭐ Front layer: Always on top (9999)</li>
            </ul>
            {zIndexState.clickedElementZIndex !== null && (
              <div
                style={{
                  marginTop: '8px',
                  padding: '8px',
                  background: 'rgba(40, 167, 69, 0.1)',
                  borderRadius: '4px',
                  fontWeight: '500',
                }}
              >
                Clicked element z-index: {zIndexState.clickedElementZIndex}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

EmojiRainControls.displayName = 'EmojiRainControls';

export default EmojiRainControls;