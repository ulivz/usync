var chalk = require('chalk')

const INDENT = '- '
const SPACE = ' '
const WRAP = {
    defalut: '[*]'
}
const config = {
    out: [
        {
            type: 'log',
            typeColor: 'cyanBright',
            msgColor: 'gray'
        },
        {
            type: 'debug',
            typeColor: 'cyanBright',
            msgColor: 'gray'
        },
        {
            type: 'info',
            typeColor: 'cyanBright',
            msgColor: 'green'
        },
        {
            type: 'error',
            typeColor: 'redBright',
            msgColor: 'yellow'
        },
        {
            type: 'success',
            typeColor: 'redBright',
            msgColor: 'yellow'
        },
        {
            type: 'warning',
            typeColor: 'red',
            msgColor: 'yellow'
        }
    ],
    custom: {
        msg: {
            defalut: 'yellow'
        },
        type: {
            defalut: 'cyanBright'
        },

    }
}

function log(msg) {
    console.log(msg)
}

function wrap(msg) {
    return WRAP.defalut.replace('*', msg)
}

function out(type, msg) {
    var _config = config.out.find(item => item.type === type)
    log(INDENT + chalk[_config ? _config.typeColor : config.custom.type.defalut](wrap(type.toUpperCase())) +
        SPACE + chalk[_config ? _config.msgColor : config.custom.msg.defalut](msg))
}

// Static function
out.chalk = function (color, content) {
    console.log(require('chalk')[color](content))
}

out.one = function (content) {
    console.log(chalk.cyanBright(content))
}

// Static function
out.custom = function (msg, options) {
    var output = '', outputType = '', outMsg = ''

    if (options) {
        if (options.type) {
            var type = wrap(options.type.toUpperCase())
            outputType = options.typeColor ? chalk[options.typeColor](type) : chalk[config.custom.type.defalut](type);
        }
        outMsg = options.msgColor ? chalk[options.msgColor](msg) : chalk[config.custom.msg.defalut](msg)
    }

    output = outputType + SPACE + outMsg
    log(output)
}

module.exports = out
