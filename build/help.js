var log = require('./logger')

log('github', 'node build/github.js --commit')
log('release', 'node build/release.js --version [--disableVersionCheck]')
