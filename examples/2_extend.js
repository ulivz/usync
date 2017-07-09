var Usync = require('../dist/Usync')

var app = Usync.createApp('Plugin')

app.lifecycle({
    start(root) {
        console.log(`Start ${root.$name}`)
    },
    end (root) {
        console.log(`Finished ${root.$name}`)
    }
})

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
    console.log(root)
    console.log(app)
    next()
}

app.use([
    task3,
    task2,
    task1,
])

module.exports = app
