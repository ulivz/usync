var Usync = require('../dist/Usync')

Usync.lifecycle({
    start(root) {
        console.log(`Start ${root.$name}`)
    },
    end (root) {
        console.log(`Finished ${root.$name}`)
    }
})

var app = Usync.createApp('Plugin')

var task1 = (root, next) => {
    root.name = 'Usync'
    console.log('Task 1')
    setTimeout(() => next(), 1000)
}

var task2 = (root, next) => {
    root.desc = 'Serial task control'
    console.log('Task 2')
    setTimeout(() => next(), 1000)
}

var task3 = (root, next) => {
    console.log('Task 3')
    next()
}

app.use(task1).use(task2).use(task3)

module.exports = app
