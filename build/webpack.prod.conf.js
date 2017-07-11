var base = require('./webpack.base.conf')
var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./config')

module.exports = merge(base, {
    devtool: "source-map",
    entry: config.prod.entry,
    output: config.prod.output,
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true
        })
    ]
})
