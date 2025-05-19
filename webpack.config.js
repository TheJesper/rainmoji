// webpack.config.js v0.0.3
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
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/',
      watch: true
    },
    compress: true,
    port: getRandomPort(),
    open: false, // Disable auto-open due to WSL limitations
    client: {
      logging: 'info',
    },
    onListening: function(devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      const port = devServer.server.address().port;
      console.log(`\n🎉 Server started on port: ${port}`);
      console.log(`\n🌟 Demo is running at: http://localhost:${port}/demo.html`);
      console.log(`📖 Main page at: http://localhost:${port}/`);
      console.log(`\nPlease open these URLs in your browser.`);
    },
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