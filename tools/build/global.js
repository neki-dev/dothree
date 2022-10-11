/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');

const alias = require('alias-reuse');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: alias(path.resolve(__dirname, '../..'))
      .fromTsconfig()
      .toWebpack(),
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
  devtool: 'source-map',
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: { comments: false },
        },
      }),
    ],
  },
};
