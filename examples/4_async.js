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

async function task7() {
    await sleep(100)
}

async function task8() {
    await sleep(100)
}

app.use([task7, task8])
    .catch(err => {
        console.log(err)
    })

module.exports = app