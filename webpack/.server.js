const path = require("path");

const sharedConfig = require("./.shared");
const tsconfig = require("../tsconfig.json");

const ROOT = path.resolve(__dirname, "..");

module.exports = (env, preset) => ({
  ...sharedConfig(env, preset),
  name: "Server",
  target: "node",
  entry: path.join(ROOT, "src/server/index.ts"),
  output: {
    path: path.join(ROOT, tsconfig.compilerOptions.outDir),
    filename: "server.js",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  externals: ["bufferutil", "utf-8-validate"],
  optimization: {
    minimize: false,
  },
});
