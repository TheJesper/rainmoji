// webpack.lib.config.js - Library build configuration for npm publishing
const path = require('path');

const baseConfig = {
  mode: 'production',
  entry: './src/lib.tsx',
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  externals: {
    react: {
      module: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React',
    },
    'react-dom': {
      module: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
      root: 'ReactDOM',
    },
  },
  performance: {
    hints: false,
  },
};

// UMD build
const umdConfig = {
  ...baseConfig,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'emojiRain.js',
    library: {
      name: 'EmojiRain',
      type: 'umd',
    },
    globalObject: 'this',
    clean: false,
  },
};

// Native ESM build
const esmConfig = {
  ...baseConfig,
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'emojiRain.esm.mjs',
    module: true,
    library: {
      type: 'module',
    },
    clean: false,
  },
};

module.exports = [umdConfig, esmConfig];
