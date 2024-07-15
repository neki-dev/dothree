/* eslint-disable import/no-extraneous-dependencies */
const alias = require("alias-reuse");
const path = require("path");

const pathToRoot = path.resolve(__dirname, "../..");

module.exports = (env, preset) => ({
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: alias.fromFile(pathToRoot, "./tsconfig.json").toWebpack(),
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
