var build = require('./build')
var path = require('path')
console.log(build)

function resolve(filePath) {
    return path.resolve(__dirname, '../', filePath)
}

module.exports = build({
    name: 'Usync',
    entry: resolve('src/Usync.ts'),
    outputPath: resolve('dist'),
    outputFilenam: 'Usync.js'
})