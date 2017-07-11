var exec = require('./utils').exec
var exit = require('./utils').exit
var argv = require('yargs').argv
var log = require('./logger')

if (!argv.commit) {
    log('error', 'No commit content')
    exit()
}

exec('git add .')
exec('git commit -m "[' + require('../package.json').name + '] ' + argv.commit + '"')
exec('git push')