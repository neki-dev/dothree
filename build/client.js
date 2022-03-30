const path = require('path');
const globalConfig = require('./global');
const tsconfig = require('../tsconfig.json');

const ROOT = path.resolve(__dirname, '..');

module.exports = {
  ...globalConfig,
  name: 'Client',
  target: 'web',
  entry: [
    'babel-polyfill',
    path.resolve(ROOT, 'src/client/index.tsx'),
  ],
  output: {
    path: path.resolve(ROOT, tsconfig.compilerOptions.outDir, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'babel-loader',
    }, {
      test: /\.(svg|png|ttf|woff|wav)$/,
      loader: 'file-loader',
      options: {
        outputPath: '../dist/assets',
        name: '[name].[ext]',
        publicPath: '/dist/assets',
      },
    }],
  },
};
