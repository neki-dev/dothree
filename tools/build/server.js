/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const nodeExternals = require('webpack-node-externals');

const tsconfig = require('../../tsconfig.json');

const globalConfig = require('./global');

const ROOT = path.resolve(__dirname, '../..');

module.exports = () => ({
  ...globalConfig,
  name: 'Server',
  target: 'node',
  entry: path.join(ROOT, 'src/server/index.ts'),
  output: {
    path: path.join(ROOT, tsconfig.compilerOptions.outDir),
    filename: 'server.js',
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
    }],
  },
  externals: [
    nodeExternals(),
  ],
});
