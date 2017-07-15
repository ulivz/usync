var Usync = require('../dist/Usync')
var app = Usync.app('Base')

function task1(root, next) {
    setTimeout(() => next(), 200)
}

function task2(root, next) {
    setTimeout(() => next(), 300)
}

function task3(root, next) {
    setTimeout(() => next(), 200)
}

app.use([
    task1,
    task2,
    task3
])

module.exports = app
