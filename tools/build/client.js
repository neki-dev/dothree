const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");


const globalConfig = require("./global");
const tsconfig = require("../../tsconfig.json");

const ROOT = path.resolve(__dirname, "../..");
const OUTPUT = path.join(ROOT, tsconfig.compilerOptions.outDir, "public");

module.exports = (env, preset) => ({
  ...globalConfig(env, preset),
  name: "Client",
  target: "web",
  entry: path.join(ROOT, "src/client/index.tsx"),
  output: {
    path: OUTPUT,
    filename: "bundle.js",
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.(svg|png|ttf|woff|wav)$/,
        exclude: /node_modules/,
        loader: "file-loader",
        options: {
          outputPath: "assets",
          name: "[name].[ext]",
          publicPath: "/assets",
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
          from: path.join(ROOT, "src/client/assets"),
          to: path.join(OUTPUT, "assets"),
        },
      ],
    }),
  ],
  devtool: preset.mode === "development" ? "inline-source-map" : "source-map",
  optimization:
    preset.mode === "development"
      ? undefined
      : {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              terserOptions: {
                output: { comments: false },
              },
            }),
          ],
        },
});
