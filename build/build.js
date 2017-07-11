var config = require('./config')
var webpack = require('webpack')
var ora = require('ora')
var chalk = require('chalk')
var webpackConf, env
var figlet = require('figlet')


if (process.argv.indexOf(config.prod.argv) >= 0) {
    env = 'prod'
} else if (process.argv.indexOf(config.dev.argv) >= 0) {
    env = 'dev'
} else {
    console.log('  ' + chalk.red('[Error]') + chalk.yellow(' Need to set env'))
    process.exit(0)
}
webpackConf = require('./webpack.' + env + '.conf')

var spinner = ora('Building for ' + env + '...')

spinner.start()

webpack(webpackConf, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
            colors: true,
            modules: false,
            children: false,
            chunks: false,
            chunkModules: false
        }) + '\n\n')
    console.log(chalk.cyan('  ' + config[env].output.filename + ' Build complete.\n'))
    figlet('USYNC', {
            horizontalLayout: 'fitted',
        },
        function(err, data) {
            if (err) {
                console.log('Something went wrong...');
                console.dir(err);
                return;
            }
            console.log(data)
        });

})
