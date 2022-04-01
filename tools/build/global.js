const TerserPlugin = require('terser-webpack-plugin');
const alias = require('../alias');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: alias.forWebpack(),
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
