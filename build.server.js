const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  name: 'Server',
  target: 'node',
  stats: {
    all: false,
    builtAt: true,
    errors: true,
    warnings: true,
    timings: true,
    colors: true,
    entrypoints: true,
  },
  externals: [nodeExternals()],
  entry: path.join(__dirname, 'src', 'server', 'index.ts'),
  resolve: {
    extensions: ['.js', '.ts'],
    alias: {
      '~root': __dirname,
      '~type': path.join(__dirname, 'src', 'types'),
    },
  },
  output: {
    filename: 'server.js',
    path: path.join(__dirname, 'app'),
  },
  module: {
    rules: [{
      test: /\.ts$/,
      use: 'ts-loader',
      include: path.join(__dirname, 'src', 'server'),
    }],
  },
  devtool: false,
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
