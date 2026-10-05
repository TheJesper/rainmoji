// webpack.widget.config.js - Build standalone widget for CDN distribution
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/widget.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'widget.min.js',
    clean: false, // Don't clean dist folder (preserve other builds)
  },
  optimization: {
    minimize: true,
  },
  performance: {
    hints: false, // Disable performance warnings for widget build
  },
};
