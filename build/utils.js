var shell = require('shelljs')
var log = require('./logger')

function exec(command) {
    log('info', 'Start ' + command)
    shell.exec(command)
    log('success', 'End ' + command)
}

function exit(err) {
    if (err) {
        process.stdout.write(err)
    }
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

module.exports = {
    exec,
    exit,
    checkVersion
}