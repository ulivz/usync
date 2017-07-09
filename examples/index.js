var Usync = require('../dist/Usync')
var fs = require('fs')
var path = require('path')
var examples = fs.readdirSync(__dirname)

console.log(Usync)

var app = Usync.createApp('Example')

examples
    .sort()
    .filter(example => example !== 'index.js')
    .map(example => {
        app.use(require(path.resolve(__dirname, example)))
    })

app.start()