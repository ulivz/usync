var shell = require('shelljs')
var package = require('../package.json')
var version = package.version
var argv = require('yargs').argv
var logger = require('./logger')
var fs = require('fs')
var path = require('path')
var config = require('./config')

logger.out('info', 'Current Version: ' + version)

if (!argv.version) {
    logger.out('error', 'No version gived')
    exit()
}

logger.out('info', 'Released Version: ' + argv.version)

if (!argv.disableVersionCheck) {
    if (!checkVersion(version, argv.version)) {
        logger.out('error', 'Illegal version number, the new version can only be a small version bigger than the old version')
        exit()
    }
    logger.out('success', 'Legal version number')
} else {
    logger.out('warning', 'Version Check closed')
}

// 1. Change version
var packageJSON = require('../package.json')
packageJSON.version = argv.version
fs.writeFileSync(path.resolve(__dirname, '../package.json'), JSON.stringify(packageJSON, null, 2), 'utf-8')

// 2. Remove old file
logger.out('info', 'Remove old dist')
shell.rm('-rf', config.prod.output.path)
shell.mkdir('-p', config.prod.output.path)

// 3. Build file
logger.out('info', 'Build library')
shell.exec('npm run build')

// 4. Github
logger.out('info', 'Start to release to Github ')

exec('git add .')
exec('git commit -m "[Train Conductor] Release ' + argv.version + '"')
exec('git push')
exec('npm publish')

function exec(command) {
    logger.out('info', 'Start ' + command)
    shell.exec(command)
    logger.out('success', 'End ' + command)
}

function checkVersion(oldVersion, newVersion) {
    var older = parseInt(oldVersion.split('.').join(''))
    var newer = parseInt(newVersion.split('.').join(''))
    if (newer - older !== 1) {
        return false
    }
    return true
}

function exit(err) {
    if (err) {
        process.stdout.write(err)
    }
    process.exit(0)
}

exit()
