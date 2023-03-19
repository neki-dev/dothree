/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const alias = require('alias-reuse');
const TerserPlugin = require('terser-webpack-plugin');

const pathToRoot = path.resolve(__dirname, '../..');

module.exports = (_, { mode }) => ({
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: alias.fromFile(pathToRoot, './tsconfig.json').toWebpack(),
  },
  stats: {
    all: false,
    builtAt: true,
    errors: true,
    warnings: true,
    timings: true,
    colors: true,
    entrypoints: true,
  },
  devtool: mode === 'development' ? 'source-map' : undefined,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: { comments: false },
        },
      }),
    ],
  },
});
