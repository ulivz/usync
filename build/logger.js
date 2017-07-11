var chalk = require('chalk')

const INDENT = '    '
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
            msgColor: 'gray'
        },
        {
            type: 'error',
            typeColor: 'redBright',
            msgColor: 'yellow'
        },
        {
            type: 'success',
            typeColor: 'redBright',
            msgColor: 'yellowBright'
        },
        {
            type: 'warning',
            typeColor: 'red',
            msgColor: 'yellowBright'
        }
    ],
    custom: {
        msg: {
            defalut: 'yellowBright'
        },
        type: {
            defalut: 'yellowBright'
        },

    }
}

function log(msg) {
    console.log()
    console.log(msg)
}


function wrap(msg) {
    return WRAP.defalut.replace('*', msg)
}

function out(type, msg) {
    var _config = config.out.find(item => item.type === type)
    log(INDENT + chalk[_config.typeColor](wrap(type.toUpperCase())) + SPACE + chalk[_config.msgColor](msg))
}

function custom(msg, options) {
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

module.exports = {
    out,
    custom
}
