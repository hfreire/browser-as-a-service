/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ENVIRONMENT = process.env.ENVIRONMENT || 'local'
const VERSION = process.env.VERSION
const VERSION_COMMIT = process.env.VERSION_COMMIT
const LOG_LEVEL = process.env.LOG_LEVEL || 'info'

const ROLLBAR_API_KEY = process.env.ROLLBAR_API_KEY

const util = require('util')

const moment = require('moment')
const winston = require('winston')

const timeFormat = function () {
  return moment().format('YYYY-MM-DDTHH:mm:ss,SSSZ')
}

const transports = []

transports.push(new winston.transports.Console({
  level: LOG_LEVEL,
  json: false,
  colorize: true,
  timestamp: timeFormat,
  handleExceptions: true,
  humanReadableUnhandledException: true
}))

switch (ENVIRONMENT) {
  case 'development':
  case 'production':
    if (ROLLBAR_API_KEY) {
      const rollbar = require('rollbar')
      rollbar.init(ROLLBAR_API_KEY, {
        environment: ENVIRONMENT,
        branch: VERSION,
        codeVersion: VERSION_COMMIT
      })

      const RollbarLogger = function (options) {
        this.name = 'rollbar'
        this.level = options && options.level || 'error'
        this.handleExceptions = true
        this.humanReadableUnhandledException = true
      }

      util.inherits(RollbarLogger, winston.Transport)

      RollbarLogger.prototype.log = function (level, msg, meta, callback) {
        if (level === 'error') {
          let error
          let payload = { level }
          if (msg !== '' && meta) {
            error = new Error()
            error.stack = msg

            if (msg.indexOf('\n') > -1) {
              error.message = msg.substring(7, msg.indexOf('\n'))
            }

            payload.session = meta
          } else {
            error = meta
          }

          rollbar.handleErrorWithPayloadData(error, payload, function (error) {
            if (error) {
              return callback(error)
            } else {
              return callback(null, true)
            }
          })
        }
      }

      transports.push(new RollbarLogger())
    }

    break

  default:
}

const Logger = new winston.Logger({
  transports: transports,
  exitOnError: false
})

module.exports = Logger

module.exports.stream = {
  'write': function (message) {
    Logger.info(message)
  }
}
