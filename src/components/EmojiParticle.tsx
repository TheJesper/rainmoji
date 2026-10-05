// EmojiParticle.tsx - Individual emoji particle component

import React, { memo } from 'react';
import { Emoji } from '../types/emoji.types';

interface EmojiParticleProps {
  emoji: Emoji;
  isFading: boolean;
  fadeOutDuration?: number;
}

const EmojiParticleComponent: React.FC<EmojiParticleProps> = ({ 
  emoji, 
  isFading, 
  fadeOutDuration = 0.5 
}) => {
  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${emoji.x}px`,
    top: emoji.drop ? `-50px` : `${emoji.y}px`,
    transform: emoji.drop ? '' : 'translate(-50%, -50%)',
    zIndex: emoji.zIndex,
    animationDuration: emoji.drop ? `${emoji.fallDuration}s` : '0s',
    animationDelay: `${emoji.delay}s`,
    animationName: emoji.drop && emoji.fallDuration > 0 ? 'fall' : 'none',
    '--fade-duration': isFading ? `${fadeOutDuration}s` : '0s',
  } as React.CSSProperties;
  
  const innerStyle: React.CSSProperties = {
    fontSize: `${emoji.fontSize}px`,
    animationDuration: `${emoji.spinDuration}s`,
    animationDelay: '0s',
    filter: `blur(${emoji.blur}px)`,
  };
  
  return (
    <div
      className={`emoji ${isFading ? 'fading' : ''}`}
      style={style}
      role="img"
      aria-label={`Falling ${emoji.emoji} emoji`}
    >
      <div className="emoji-inner" style={innerStyle}>
        {emoji.emoji}
      </div>
    </div>
  );
};

const areEqual = (prevProps: EmojiParticleProps, nextProps: EmojiParticleProps): boolean => {
  return (
    prevProps.emoji.id === nextProps.emoji.id &&
    prevProps.isFading === nextProps.isFading &&
    prevProps.fadeOutDuration === nextProps.fadeOutDuration
  );
};

const EmojiParticle = memo(EmojiParticleComponent, areEqual);

EmojiParticle.displayName = 'EmojiParticle';

export default EmojiParticle;