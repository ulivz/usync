var config = require('./config')
var webpack = require('webpack')
var ora = require('ora')
var webpackConf, env
var log = require('./logger')
var compile = require('./utils').webpackCompile

var env

function conf(env) {
    return './webpack.' + env + '.conf';
}

if (process.argv.indexOf(config.prod.argv) >= 0) {
    env = 'prod'
    webpackConf = require(conf(env))()
    compile(webpackConf)
    compile(require(conf('dev'))())

} else if (process.argv.indexOf(config.dev.argv) >= 0) {
    env = 'dev'
    webpackConf = require(conf(env))({watch: true})
    compile(webpackConf)

} else {
    log('error', 'Need to set env')
    process.exit(0)
}






