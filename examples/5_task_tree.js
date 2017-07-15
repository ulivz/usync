var Usync = require('../dist/Usync')
var parent = Usync.app('Parent')
var child1 = Usync.app('child1')
var child2 = Usync.app('child2')

function task9(root, next) {
    setTimeout(() => next(), 100)
}

function task10(root, next) {
    setTimeout(() => next(), 100)
}

function task11(root, next) {
    setTimeout(() => next(), 100)
}

function task12(root, next) {
    setTimeout(() => next(), 100)
}

child2.use([task9, task10])
child1.use([task11, task12])

parent.use([child1, child2])

module.exports = parent