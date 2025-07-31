// src/index.tsx v0.0.3
import React from 'react';
import ReactDOM from 'react-dom/client';
import EmojiRain from './components/EmojiRain';
import { ErrorBoundary } from './components/ErrorBoundary';
import './styles.css';

const App: React.FC = () => {
  const items = [
    '🌟',
    '💫',
    '✨',
    '🎉',
    '🎊',
    '⭐',
    '🌈',
  ];

  return (
    <ErrorBoundary>
      <EmojiRain emojiSet={items} autoPlay={true} />
    </ErrorBoundary>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
