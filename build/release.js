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
logger.out('info', 'Github Release')

shell.exec('git add . && git commit -m "[Version Update] Released ' + argv.version + '" && git push', function (code, stdout, stderr) {
    console.log(code)
    if (code === 0) {
        logger.out('success', 'Github release successfully')
    } else {
        process.stdout.write(stderr)
        process.exit(0)
    }
})

// 5. NPM
shell.exec('npm publish', function (code, stdout, stderr) {
    if (code === 0) {
        logger.out('success', 'npm release successfully')
    } else {
        process.stdout.write(stderr)
        process.exit(0)
    }
})

function checkVersion(oldVersion, newVersion) {
    var older = parseInt(oldVersion.split('.').join(''))
    var newer = parseInt(newVersion.split('.').join(''))
    if (newer - older !== 1) {
        return false
    }
    return true
}

function exit() {
    console.log()
    process.exit(0)
}

exit()
