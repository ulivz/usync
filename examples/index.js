var Usync = require('../dist/Usync')
var fs = require('fs')
var path = require('path')
var examples = fs.readdirSync(__dirname)

Usync.extend({
    // appStart(root) {
    //     console.log(`Start ${root.$name}`)
    // },
    // appEnd (root) {
    //     console.log(`Finished ${root.$name}`)
    // },
    taskStart(root) {
        console.time(root.$current.name)
        // console.log(`Start ${root.$current.name}`)
    },
    taskEnd(root) {
        console.timeEnd(root.$current.name)
        // console.log(`Finished ${root.$current.name} after ${root.$current.endTime - root.$current.startTime}ms`)
    }
})

var app = Usync.createApp('Example')


examples
    .sort()
    .filter(example => example !== 'index.js')
    .map(example => {
        app.use(require(path.resolve(__dirname, example)))
    })


app.start()