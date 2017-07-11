var Usync = require('../dist/Usync')

var app = Usync.createApp('Base')

var task1 = (root, next) => {
    setTimeout(() => next(), 2000)
}

task.prototype.name = 'task1'

var task2 = (root, next) => {
    setTimeout(() => next(), 300)
}

var task3 = (root, next) => {
    setTimeout(() => next(), 500)
}

app.use([
    task1,
    task2,
    task3
])

app.nameMap({
    task1,
    task2,
    task3
})

module.exports = app
