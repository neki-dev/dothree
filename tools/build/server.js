const path = require('path');
const nodeExternals = require('webpack-node-externals');
const globalConfig = require('./global');
const tsconfig = require('../../tsconfig.json');

const ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.resolve(ROOT, tsconfig.compilerOptions.outDir);
const OUTPUT_FILE = 'server.js';

module.exports = () => ({
  ...globalConfig,
  name: 'Server',
  target: 'node',
  entry: [
    'babel-polyfill',
    path.resolve(ROOT, 'src/server/index.ts'),
  ],
  output: {
    path: OUTPUT_DIR,
    filename: OUTPUT_FILE,
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'babel-loader',
    }],
  },
  externals: [
    nodeExternals(),
  ],
});
