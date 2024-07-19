/* eslint-disable import/no-extraneous-dependencies */
const alias = require("alias-reuse");
const path = require("path");

const root = path.resolve(__dirname, "..");
const tsconfig = path.resolve(root, "tsconfig.json");

module.exports = (env, preset) => ({
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: alias.reuse().from(tsconfig).for('webpack'),
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
