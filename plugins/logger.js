var chalk = require('chalk')

function logWithTime(content) {
    var time = new Date().toLocaleTimeString()
    console.log(chalk.gray(time) + ' ' + content)
}

function indentByDepth(depth) {
    var indent = ''
    while (depth >= 0){
        indent += '   '
        depth--
    }
    return indent
}

module.exports = function (Usync) {
    Usync.extend({
        taskStart(root) {
            logWithTime(`${indentByDepth(root.$current.$parent ? root.$current.$parent.depth + 1 : 0)}Starting ${chalk.cyan(root.$current.name)} ...`)

        },
        taskEnd(root) {

            logWithTime(`${indentByDepth(root.$current.$parent ? root.$current.$parent.depth + 1 : 0)}${chalk.redBright('Finished')} ${chalk.cyan(root.$current.name)} after ${chalk.magenta((root.$current.endTime - root.$current.startTime) + 'ms')}`)
        }
    })
}