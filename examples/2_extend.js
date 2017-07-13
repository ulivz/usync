var Usync = require('../dist/Usync')
var app = Usync.app('Plugin')

function task4(root, next) {
    setTimeout(() => next(), 500)
}

function task5(root, next) {
    setTimeout(() => next(), 1000)
}

function task6(root, next) {
    next()
}

app.use([
    task4,
    task5,
    task6,
])

module.exports = app
