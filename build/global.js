const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const tsconfig = require('../tsconfig.json');

module.exports = {
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: Object.entries(tsconfig.compilerOptions.paths).reduce((a, b) => ({
      ...a,
      [b[0].replace('/*', '')]: path.resolve(__dirname, '..', b[1][0].replace('*', '')),
    }), {}),
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
