var log = require('./logger')

log('github', 'node build/github.js --version [--disableVersionCheck]')
log('release', 'node build/release.js --commit')
