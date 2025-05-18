// useEmojiLayers.js v0.0.1
import { parallaxConfig } from "../config/parallaxConfig";

export const createEmojiElement = (
  emojiSet,
  drop = false,
  layerKey = "middle"
) => {
  const layerProps = parallaxConfig.layerProperties[layerKey];
  const emojiChar = emojiSet[Math.floor(Math.random() * emojiSet.length)];
  const { finalFontSize, fallDuration, blurAmount, delay, zIndex } =
    getLayerProperties(layerKey);

  const emojiElement = document.createElement("div");
  emojiElement.className = "emoji";
  emojiElement.style.zIndex = zIndex;

  // other code...
};

const getRandomValue = (min, max) => Math.random() * (max - min) + min;

const SPEED_ADJUSTMENT_FACTOR = 50 / 30;

const convertSpeedToFallDuration = (speedValue) => {
  let { baseSpeed } = parallaxConfig;
  baseSpeed = baseSpeed / SPEED_ADJUSTMENT_FACTOR;
  if (baseSpeed < 0) baseSpeed = 0;
  if (baseSpeed > 100) baseSpeed = 100;
  if (baseSpeed === 0) return Infinity;
  const minDur = 1,
    maxDur = 10;
  const fraction = speedValue / 10;
  let baseDuration = fraction * (maxDur - minDur) + minDur;
  return baseDuration * (10 / baseSpeed);
};

const getLayerProperties = (layerKey) => {
  const layerProps = parallaxConfig.layerProperties[layerKey];
  const randomSpeed = getRandomValue(...layerProps.speedRange);
  const fallDuration = convertSpeedToFallDuration(randomSpeed);
  const blurAmount = getRandomValue(...layerProps.blurRange);
  const finalFontSize = getRandomValue(...layerProps.fontSizeRange);
  const randomDelay = getRandomValue(...layerProps.delayRange);
  return {
    finalFontSize,
    fallDuration,
    blurAmount,
    delay: randomDelay,
    zIndex: layerProps.zIndex,
  };
};

export const scheduleFrontLayer = (
  count,
  containerRef,
  emojiSet,
  frontIntervalRef
) => {
  if (count <= 0) return;
  // Schedule front emojis
  const slowestLayerTime = 3000; // fallback
  const intervalTime = slowestLayerTime / count;
  frontIntervalRef.current = setInterval(() => {
    if (count <= 0) {
      clearInterval(frontIntervalRef.current);
      frontIntervalRef.current = null;
    } else {
      if (containerRef.current) {
        containerRef.current.appendChild(
          createEmojiElement(emojiSet, true, "front")
        );
      }
      count--;
    }
  }, intervalTime);
};
