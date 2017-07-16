var shell = require('shelljs')
var log = require('./logger')
var webpack = require('webpack')
var ora = require('ora')
var path = require('path')
var figlet = require('figlet')

function exec(command) {
    shell.exec(command)
}

function exit(err) {
    if (err) {
        process.stdout.write(err)
        console.log()
    }
    console.log()
    process.exit(0)
}

function checkVersion(oldVersion, newVersion) {
    var older = parseInt(oldVersion.split('.').join(''))
    var newer = parseInt(newVersion.split('.').join(''))
    if (newer - older !== 1) {
        return false
    }
    return true
}

function webpackCompile(webpackConfig, callback) {

    var spinner = ora('Building for ' + webpackConfig.output.filename + '...')
    spinner.start()

    webpack(webpackConfig, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false
            }) + '\n\n')
        log('Webpack', 'Build ' + webpackConfig.output.filename + ' successfully')
        callback && callback()
    })
}

function drawPackageName() {
    var package = require(path.resolve(process.cwd(), 'package.json'))
    figlet(package.name, {
            horizontalLayout: 'fitted',
        },
        function (err, data) {
            if (err) {
                log('error', 'Something went wrong...');
                console.dir(err);
                return;
            }
            log.chalk('gray', data)
            log.chalk('gray', '           Version ' + package.version)
            console.log()
        });
}

module.exports = {
    exec,
    exit,
    checkVersion,
    webpackCompile,
    drawPackageName
}