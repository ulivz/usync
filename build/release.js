/**
 * Release v0.0.1
 * Please don't execute this file at Windows system
 */
var package = require('../package.json')
var version = package.version
var argv = require('yargs').argv
var log = require('./logger')
var fs = require('fs')
var path = require('path')
var config = require('./config')
var exec = require('./utils').exec
var exit = require('./utils').exit
var checkVersion = require('./utils').checkVersion
var draw = require('./utils').drawPackageName

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

// 1. Change version
var packageJSON = require('../package.json')
packageJSON.version = argv.version
fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(packageJSON, null, 2), 'utf-8')

// 2. Remove old file
exec('rm -rf ' + config.prod.output.path)
exec('mkdir' + config.prod.output.path)

// 3. Build file
log('info', 'Build file ')
exec('npm run build')

// 4. Github
log('info', 'Start to release to Github ')
exec('git add .')
exec('git commit -m "[Train Conductor] Release ' + argv.version + '"')
exec('git push')

// 5. Github
log('info', 'Start to release to NPM ')
exec('npm publish')
draw()

exit()
