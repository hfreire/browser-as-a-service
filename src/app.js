/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const VERSION = process.env.VERSION
const VERSION_COMMIT = process.env.VERSION_COMMIT
const VERSION_BUILD_DATE = process.env.VERSION_BUILD_DATE

const Logger = require('./utils/logger')

if (VERSION && VERSION_COMMIT && VERSION_BUILD_DATE) {
  Logger.info(`Running version ${VERSION} from commit ${VERSION_COMMIT} built on ${VERSION_BUILD_DATE}`)
}

const Server = require('./server')

// shutdown gracefully
function _shutdown () {
  return Server.stop()
    .timeout(1000)
    .finally(() => {
      process.exit(0)
    })
}

process.on('SIGINT', _shutdown)
process.on('SIGTERM', _shutdown)

// force immediate shutdown, i.e. systemd watchdog?
process.on('SIGABRT', function () {
  process.exit(1)
})

process.on('SIGHUP', function () { // reload
  _shutdown()
})

// stop and then shutdown, i.e. forever daemon
process.once('SIGUSR2', function () {
  Server.stop(function () {
    process.kill(process.pid, 'SIGUSR2')
  })
})

process.on('exit', function () {
})

process.on('uncaughtException', error => {
  Logger.error(error, _shutdown)
})
process.on('unhandledRejection', error => {
  Logger.error(error, _shutdown)
})

Server.start()
