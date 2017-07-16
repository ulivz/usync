// ***************************************************
// Colorful and friendly console plugin for Usync
// ***************************************************

var chalk = require('chalk')

/**
 * Add current time prefix the content
 * @param content
 */
function addTimeNowPrefix(content) {
    var time = new Date().toLocaleTimeString()
    return `${chalk.gray(time)}  ${content}`
}

/**
 * Get indent by count
 * @param depth
 * @returns {string}
 */
function getIndentByCount(depth) {
    var indent = ''
    while (depth > 0) {
        indent += '   '
        depth--
    }
    return indent
}

/**
 * Get Depth
 * @param task
 * @returns {number}
 */
function getDepth(task) {
    return task.$parent ? task.$parent.depth : 0
}

/**
 * A recursive function to define 
 * @param parent
 * @param child
 * @param Usync
 */
function setDepth(parent, child, Usync) {
    let _setDepth = (parent, child) => {
        if (child instanceof Usync) {
            child.depth = parent.depth + 1;
            child.defferd.forEach(nextChild => {
                _setDepth(child, nextChild)
            })
        }
    }
    _setDepth(parent, child)
}

/**
 * Install function
 * @param Usync
 * @param opts
 */
module.exports = function install(Usync, opts) {

    // Object.assign was supported from Node 4.8.3
    opts = Object.assign({
        indent: false,
        time: false
    }, opts)

    let taskStartLog = function () {
        return `Starting ${chalk.cyan(this.$current.name)} ...`
    }

    let taskEndLog = function () {
        return `${chalk.red('Finished')} ${chalk.cyan(this.$current.name)} after ${chalk.magenta((this.$current.endTime - this.$current.startTime) + 'ms')}`
    }

    let hooks = {}

    if (opts.indent) {
        hooks.init = function (app) {
            app.depth = 0
        }
        hooks.beforeUse = function (app, task) {
            setDepth(app, task, Usync)
        }
        let oldTaskStartLog = taskStartLog
        let oldEaskEndLog = taskEndLog
        taskStartLog = function () {
            return getIndentByCount(getDepth(this.$current)) + oldTaskStartLog.call(this)
        }
        taskEndLog = function () {
            return getIndentByCount(getDepth(this.$current)) + oldEaskEndLog.call(this)
        }
    }

    if (opts.time) {
        let oldTaskStartLog = taskStartLog
        let oldEaskEndLog = taskEndLog
        taskStartLog = function () {
            return addTimeNowPrefix(oldTaskStartLog.call(this))
        }
        taskEndLog = function () {
            return addTimeNowPrefix(oldEaskEndLog.call(this))
        }
    }

    hooks.taskStart = function (root) {
        console.log(taskStartLog.call(root))
    }

    hooks.taskEnd = function (root) {
        console.log(taskEndLog.call(root))
    }

    Usync.extend(hooks)

}
