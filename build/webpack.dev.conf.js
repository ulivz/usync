var base = require('./webpack.base.conf')
var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./config')

module.exports = merge(base, {
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000,
        ignored: [
            /node_modules/,
            'build/**/*.js',
            'dist/**/*.js',
            'test/**/*.js',
            'examples/**/*.js'
        ]
    },
    entry: config.dev.entry,
    output: config.dev.output,
    // cheap-module-eval-source-map is faster for development
    devtool: '#cheap-module-eval-source-map',
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ]
})
