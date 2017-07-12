var Usync = require('../dist/Usync')
var app = Usync.app('Promise')

function task7() {
    return new Promise(resolve => {
        setTimeout(() => resolve(), 300)
    })
}

function task8() {
    return new Promise(resolve => {
        setTimeout(() => resolve(), 200)
    })
}

 app.use([task7, task8])
    .catch(err => {
        console.log(err)
    })

module.exports = app