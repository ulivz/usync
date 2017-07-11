var path = require('path')

function resolve(filePath) {
    return path.resolve(__dirname, '../../', filePath)
}

module.exports = {
    prod: {
        env: {
            NODE_ENV: 'development'
        },
        argv: '-p',
        entry: resolve('src/index.ts'),
        output: {
            path: resolve('dist'),
            filename: 'Usync.min.js',
            library: 'Usync',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
    },
    dev: {
        env: {
            NODE_ENV: 'production'
        },
        argv: '-d',
        entry: resolve('src/index.ts'),
        output: {
            path: resolve('dist'),
            filename: 'Usync.js',
            library: 'Usync',
            libraryTarget: 'umd',
            umdNamedDefine: true
        },
    }
}
