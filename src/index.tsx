// src/index.tsx v0.0.1
import React from 'react';
import ReactDOM from 'react-dom/client';
import EmojiRain from './components/EmojiRain.jsx';
import './styles.css'; // Optional: Create if you have additional styles

const App = () => {
  const items = [
    '🌟',
    '💫',
    '✨',
    '🎉',
    '🎊',
    '⭐',
    '🌈',
  ];

  return <EmojiRain emojiSet={items} />;
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
