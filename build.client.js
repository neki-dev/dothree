const webpack = require('webpack');
const path = require('path');
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
        path.join(__dirname, 'src', 'client', 'index.tsx'),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.tsx'],
        alias: {
            ['~root']: __dirname,
            ['~type']: path.join(__dirname, 'src', 'types'),
            ['~hook']: path.join(__dirname, 'src', 'client', 'hooks'),
        },
    },
    output: {
        path: path.join(__dirname, 'app', 'dist'),
        filename: 'bundle.js',
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            include: path.join(__dirname, 'src', 'client'),
        }, {
            test: /\.tsx$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                },
            }, {
                loader: 'ts-loader',
            }],
            include: path.join(__dirname, 'src', 'client'),
        }, {
            test: /\.(svg|png|ttf|woff|wav)$/,
            loader: 'file-loader',
            options: {
                outputPath: '../dist/assets',
                name: '[name].[ext]',
                publicPath: '/dist/assets',
            },
            include: path.join(__dirname, 'src', 'client'),
        }],
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