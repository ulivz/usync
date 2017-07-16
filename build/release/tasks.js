var fs = require('fs')
var path = require('path')

function changePackageJson(root, next) {
    var packageJSON = require('../../package.json')
    packageJSON.version = root.argv.version
    fs.writeFileSync(path.resolve(__dirname, '../../package.json'), JSON.stringify(packageJSON, null, 2), 'utf-8')
    next()
}

function updateREADME(root, next) {
    var README_PATH = path.resolve(__dirname, '../../README.md')
    var README_CN_PATH = path.resolve(__dirname, '../../README_zh_CN.md')
    var README = fs.readFileSync(README_PATH, 'utf-8')
    var README_CN = fs.readFileSync(README_CN_PATH, 'utf-8')
    README = README.replace(/(Version\s)\d{1,2}.\d{1,2}.\d{1,2}/, `$1${root.argv.version}`)
    README_CN = README_CN.replace(/(Version\s)\d{1,2}.\d{1,2}.\d{1,2}/, `$1${root.argv.version}`)
    fs.writeFileSync(README_PATH, README)
    fs.writeFileSync(README_CN_PATH, README_CN)
    next()
}

function removeOldFiles(root, next) {
    root.exec('rm -rf ' + root.config.prod.output.path)
    root.exec('mkdir -p' + root.config.prod.output.path)
    next()
}

function BuildLib(root, next) {
    root.exec('npm run build')
    next()
}

function releaseToGithub(root, next) {
    root.exec('git add .')
    root.exec('git commit -m "[Build] Release ' + root.argv.version + '"')
    root.exec('git push')
    next()
}

function releaseToNPM(root, next) {
    root.exec('npm publish')
    root.draw()
    next()
}

module.exports = {
    changePackageJson,
    updateREADME,
    removeOldFiles,
    BuildLib,
    releaseToGithub,
    releaseToNPM
}
