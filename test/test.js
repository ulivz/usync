var Usync = require('../dist/Usync')

var addVersion = (U, next) => {
    U.version = '1.0.0'
    console.log('Parent - 1')
    setTimeout(w => {
        U.next()
    }, 1000)
}

var addAuthor = (U) => {
    U.author = 'toxichl'
    console.log('Parent - 2')
    U.next()
}

var lifeEnd = function (U) {
    console.log('Parent - 3')
    console.log('Parent - End')
    U.next()
    console.log('app.$state = ' + app.$state)
}

var U = {
    name: 'Usync'
}

var childApp1 = Usync.app()
    .use(U => {
        console.log('Child - 1')
        setTimeout(() => {
            U.next()
        }, 1000)
    })
    .use(U => {
        console.log('Child - 2')
        console.log('Child - End')
        U.next()
    })


var app = Usync.app(U)
    .use(addVersion)
    .use(addAuthor)
    .use(childApp1)
    .use(lifeEnd)

app.start()

console.log(app)
console.log(childApp1)


function logger(content) {
    console.log('========')
    console.log(content)
    console.log('\n')
}

