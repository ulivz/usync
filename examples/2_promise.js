var Usync = require('../dist/Usync')
var app = Usync.app('Promise')

function task4() {
    return new Promise(resolve => {
        setTimeout(() => resolve(), 300)
    })
}

function task5() {
    return new Promise(resolve => {
        setTimeout(() => resolve(), 200)
    })
}

 app.use([task4, task5])
    .catch(err => {
        console.log(err)
    })

module.exports = app