const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background/background.js',
    content: './src/content/content.js',
    popup: './src/popup/App.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: "src/manifest.json", to: "manifest.json" }, // FIXED: Ensure correct path
        { from: "src/icons/icon16.png", to: "icon16.png", noErrorOnMissing: true }, // FIXED: Corrected path
        { from: "src/icons/icon48.png", to: "icon48.png", noErrorOnMissing: true }, // FIXED: Corrected path
        { from: "src/icons/icon128.png", to: "icon128.png", noErrorOnMissing: true } // FIXED: Corrected path
      ],
    }),
    new HtmlWebpackPlugin({
      template: './src/popup/popup.html',
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new Dotenv()
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@services': path.resolve(__dirname, 'src/services')
    }
  }
};
