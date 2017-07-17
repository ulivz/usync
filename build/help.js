var log = require('./logger')

log('github', 'node build/github.js --commit')
log('release', 'node build/release --version [--disableVersionCheck]')
