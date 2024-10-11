/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const alias = require("alias-reuse");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");

const tsconfig = path.resolve(ROOT, 'tsconfig.json');

module.exports = () => ({
  name: "Server",
  target: "node",
  entry: path.resolve(ROOT, "src/server/index.ts"),
  resolve: {
    extensions: [".js", ".ts"],
    alias: alias.reuse().from(tsconfig).for("webpack"),
  },
  output: {
    path: path.resolve(ROOT, "dist"),
    filename: "server.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
        include: /src\/(server|shared)/,
      },
    ],
  },
  externals: [
    "bufferutil",
    "utf-8-validate",
  ],
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  stats: {
    all: false,
    builtAt: true,
    errors: true,
    warnings: true,
    timings: true,
    colors: true,
  },
});
