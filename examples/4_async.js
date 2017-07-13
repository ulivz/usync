var Usync = require('../dist/Usync')
var app = Usync.app('Async')

// ***************************************************
// Warning: async/await supported from node 7.10.0
// Please confirm your node version
// ***************************************************
function sleep(duration) {
    return new Promise(resolve => {
        setTimeout(() => resolve(), duration);
    })
}

async function task9() {
    await sleep(100)
}

async function task10() {
    await sleep(100)
}

 app.use([task9, task10])
    .catch(err => {
        console.log(err)
    })

module.exports = app