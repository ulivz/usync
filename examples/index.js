var Usync = require('../dist/Usync')
var fs = require('fs')
var path = require('path')
var examples = fs.readdirSync(__dirname)
var chalk = require('chalk')

function logWithTime(content) {
    var time = new Date().toLocaleTimeString()
    console.log(chalk.gray(time) + ' ' + content)
}

Usync.extend({
    // appStart(root) {
    //     console.log(`Start ${root.$name}`)
    // },
    // appEnd (root) {
    //     console.log(`Finished ${root.$name}`)
    // },
    taskStart(root) {
        // console.time(root.$current.name)
        // logWithTime(` ${chalk.redBright('Starting')} ${chalk.cyan(root.$current.name)} ...`)
        logWithTime(` Starting ${chalk.cyan(root.$current.name)} ...`)
    },
    taskEnd(root) {
        // console.timeEnd(root.$current.name)
        logWithTime(` ${chalk.redBright('Finished')} ${chalk.cyan(root.$current.name)} after ${chalk.magenta((root.$current.endTime - root.$current.startTime) + 'ms')}`)
    }
})

var app = Usync.app('Example')

examples
    .sort()
    .filter(example => example !== 'index.js')
    .map(example => {
        app.use(require(path.resolve(__dirname, example)))
    })

app.start()