const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    name: 'Server',
    target: 'node',
    stats: {
        all: false,
        builtAt: true,
        errors: true,
        warnings: true,
        timings: true,
        colors: true,
        entrypoints: true,
    },
    externals: [nodeExternals()],
    entry: './src/server/index.ts',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'server.js',
        path: path.resolve(__dirname, 'app'),
    },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
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