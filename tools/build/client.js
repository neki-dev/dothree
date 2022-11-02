const path = require('path');

const tsconfig = require('../../tsconfig.json');

const globalConfig = require('./global');

const ROOT = path.resolve(__dirname, '../..');

module.exports = {
  ...globalConfig,
  name: 'Client',
  target: 'web',
  entry: path.join(ROOT, 'src/client/index.tsx'),
  output: {
    path: path.join(ROOT, tsconfig.compilerOptions.outDir, 'public', 'dist'),
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
