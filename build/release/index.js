/**
 * Release v0.0.1
 * Please don't execute this file at Windows system
 */
var package = require('../../package.json')
var version = package.version
var argv = require('yargs').argv
var log = require('../logger')
var config = require('../config/index')
var exec = require('../utils').exec
var exit = require('../utils').exit
var checkVersion = require('../utils').checkVersion
var draw = require('../utils').drawPackageName
var Usync = require('../stable-usync/Usync')
var tasks = require('./tasks')

console.log()

log('info', 'Current Version: ' + version)

if (!argv.version) {
    log('error', 'No version gived')
    exit()
}

log('info', 'Released Version: ' + argv.version)

if (!argv.disableVersionCheck) {
    if (!checkVersion(version, argv.version)) {
        log('error', 'Illegal version number, the new version can only be a small version bigger than the old version')
        exit()
    }
    log('success', 'Legal version number')
} else {
    log('warning', 'Version Check closed')
}

Usync.plugin(require('../../plugins/logger'), {
    time: true
})

var app = Usync.app()


app.use(function Init(root, next) {
    root.argv = argv
    root.log = log
    root.exec = exec
    root.draw = draw
    root.config = config
    next()
})

app.use([
    tasks.changePackageJson,
    tasks.updateREADME,
    tasks.removeOldFiles,
    tasks.BuildLib,
    tasks.releaseToGithub,
    tasks.releaseToNPM,
])

app.start()