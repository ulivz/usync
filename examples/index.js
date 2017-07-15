var Usync = require('../dist/Usync')
var fs = require('fs')
var path = require('path')
var examples = fs.readdirSync(__dirname)
var logger = require('../plugins/logger')

Usync.plugin(logger, {
    time: true,
    indent: true
})


var app = Usync.app('Example');

examples
    .sort()
    .filter(example => example !== 'index.js')
    .map(example => {
        app.use(require(path.resolve(__dirname, example)))
    })

app.start()