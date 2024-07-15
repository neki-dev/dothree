const path = require("path");
const nodeExternals = require("webpack-node-externals");

const globalConfig = require("./global");
const tsconfig = require("../tsconfig.json");

const ROOT = path.resolve(__dirname, "..");

module.exports = (env, preset) => ({
  ...globalConfig(env, preset),
  name: "Server",
  target: "node",
  entry: path.join(ROOT, "src/server/index.ts"),
  output: {
    path: path.join(ROOT, tsconfig.compilerOptions.outDir),
    filename: "server.js",
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
});
