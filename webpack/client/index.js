/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

const alias = require("alias-reuse");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const OUTPUT = path.resolve(ROOT, "dist/public");

const tsconfig = path.resolve(ROOT, 'tsconfig.json');

module.exports = () => ({
  name: "Client",
  target: "web",
  entry: path.resolve(ROOT, "src/client/index.tsx"),
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
    alias: alias.reuse().from(tsconfig).for("webpack"),
  },
  output: {
    path: OUTPUT,
    filename: "bundle.[fullhash].js",
    clean: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "babel-loader",
          },
          {
            loader: "ts-loader",
            options: {
              configFile: path.resolve(__dirname, "tsconfig.json"),
            },
          },
        ],
        include: /src\/(client|shared)/,
      },
      {
        test: /\.(svg|png|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlPlugin({
      minify: false,
      template: "src/client/index.html",
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(ROOT, "src/client/assets"),
          to: path.resolve(OUTPUT, "assets"),
        },
      ],
    }),
  ],
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
