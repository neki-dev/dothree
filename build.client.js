const webpack = require('webpack');
const path = require('path');
const AutoprefixerPlugin = require('autoprefixer');
const CSSNanoPlugin = require('cssnano');
const ExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    name: 'Client',
    target: 'web',
    stats: {
        all: false,
        builtAt: true,
        errors: true,
        warnings: true,
        timings: true,
        colors: true,
        entrypoints: true,
    },
    entry: [
        'babel-polyfill',
        path.join(__dirname, 'src', 'client', 'index.jsx'),
    ],
    resolve: {
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'client', 'src'),
        ],
    },
    output: {
        path: path.join(__dirname, 'app', 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new ExtractPlugin({
            filename: 'bundle.css',
        }),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    module: {
        rules: [
            {
                test: /\.jsx$/,
                include: [
                    path.join(__dirname, 'node_modules'),
                    path.join(__dirname, 'src', 'client'),
                ],
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.s?css$/,
                include: [
                    path.join(__dirname, 'node_modules'),
                    path.join(__dirname, 'src', 'client'),
                ],
                use: [
                    {
                        loader: ExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    AutoprefixerPlugin(),
                                    CSSNanoPlugin({preset: 'default'}),
                                ],
                            },
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: false,
                        },
                    },
                ],
            },
            {
                test: /\.(gif|svg|jpg|jpeg|png|ttf|woff|wav|mp3)$/,
                include: [
                    path.join(__dirname, 'node_modules'),
                    path.join(__dirname, 'src', 'client'),
                ],
                loader: 'file-loader',
                options: {
                    outputPath: '../dist/assets',
                    name: '[name].[ext]',
                    publicPath: '/dist/assets',
                },
            },
        ],
    },
    devtool: false,
    optimization: {
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    output: {comments: false},
                },
            }),
        ],
    },
};