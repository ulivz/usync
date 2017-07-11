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

module.exports = {
    exec,
    exit
}