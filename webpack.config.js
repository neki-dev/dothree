const webpack = require('webpack');
const path = require('path');
const AutoprefixerPlugin = require('autoprefixer');
const CSSNanoPlugin = require('cssnano');
const ExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
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
        path.join(__dirname, 'client', 'src', 'index.jsx'),
    ],
    output: {
        path: path.join(__dirname, 'client', 'dist'),
        filename: 'bundle.js',
    },
    resolve: {
        alias: {
            '@lib': path.join(__dirname, 'lib'),
        },
        extensions: ['.js', '.jsx'],
        modules: [
            path.join(__dirname, 'node_modules'),
            path.join(__dirname, 'client', 'src'),
        ],
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
                    path.join(__dirname, 'client', 'src'),
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
                    path.join(__dirname, 'client', 'src'),
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
                    path.join(__dirname, 'client'),
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