const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const CONFIG_FILE = 'config.json';

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: {
    puppeteer: 'require ("puppeteer")'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', CONFIG_FILE),
          to: path.resolve(__dirname, 'dist', CONFIG_FILE)
        }
      ],
    }),
  ]
};
