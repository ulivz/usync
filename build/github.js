var exec = require('./utils').exec
var exit = require('./utils').exit
var argv = require('yargs').argv
var log = require('./logger')
var draw = require('./utils').drawPackageName

if (!argv.commit || argv.commit === true) {
    log('error', 'No commit content')
    exit()
}

exec('git add .')
exec('git commit -m "' + argv.commit + '"')
exec('git push')

draw()

