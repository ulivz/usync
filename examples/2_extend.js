var Usync = require('../dist/Usync')

var app = Usync.createApp('Plugin')

var task4 = (root, next) => {
    setTimeout(() => next(), 1000)
}

console.log(Object.prototype.toString.call(task4))

var task5 = (root, next) => {
    setTimeout(() => next(), 1000)
}

var task6 = (root, next) => {
    next()
}

app.use([
    task4,
    task5,
    task6,
])

module.exports = app
