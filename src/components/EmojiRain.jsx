// EmojiRain.jsx v0.0.1
import React, { useRef } from "react";
import useEmojiRain from "./useEmojiRain";
import { parallaxConfig } from "../config/parallaxConfig";

const EmojiRain = ({ emojiSet = parallaxConfig.defaultEmojis }) => {
  const containerRef = useRef(null);
  const { triggerRain, clearAllEmojis } = useEmojiRain(emojiSet, containerRef);

  return (
    <>
      {/* optional UI or controls */}
      <button onClick={triggerRain}>Make it Rain!</button>
      <div ref={containerRef} className="rain-container" />
    </>
  );
};

export default EmojiRain;