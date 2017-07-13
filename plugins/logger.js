var chalk = require('chalk')

function logWithTime(content) {
    var time = new Date().toLocaleTimeString()
    console.log(chalk.gray(time) + ' ' + content)
}

module.exports = function (Usync) {
    Usync.extend({
        taskStart(root) {
            logWithTime(` Starting ${chalk.cyan(root.$current.name)} ...`)
        },
        taskEnd(root) {
            logWithTime(` ${chalk.redBright('Finished')} ${chalk.cyan(root.$current.name)} after ${chalk.magenta((root.$current.endTime - root.$current.startTime) + 'ms')}`)
        }
    })
}