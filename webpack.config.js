// webpack.config.js v0.0.2
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Generate a random port between 8000 and 8999
const getRandomPort = () => Math.floor(Math.random() * 1000) + 8000;

module.exports = {
  entry: {
    main: './src/index.tsx',
    demo: './src/index.tsx', // Using the same entry for demo; alternatively, create a separate entry if needed
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Clean the output directory before emit
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/, // If using CSS
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: getRandomPort(),
    open: false, // Disable auto-open due to WSL limitations
    before: function(app, server) {
      // Log server info on startup
      const port = server.options.port || getRandomPort();
      console.log(`\n🎉 Server will start on port: ${port}`);
    },
    onListening: function(server) {
      const port = server.options.port;
      console.log(`\n🌟 Demo is running at: http://localhost:${port}/demo.html`);
      console.log(`📖 Main page at: http://localhost:${port}/`);
      console.log(`\nPlease open these URLs in your browser.`);
    },
    // Ensure static HTML files are served correctly
    contentBasePublicPath: '/',
    watchContentBase: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      filename: 'demo.html',
      template: './public/demo.html',
      chunks: ['demo'],
      inject: true
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
