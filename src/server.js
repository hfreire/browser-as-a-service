/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const PORT = process.env.PORT || 3000
const API_KEYS = process.env.API_KEYS || ''

const _ = require('lodash')
const Promise = require('bluebird')

const Logger = require('./utils/logger')

const Health = require('health-checkup')

const Hapi = require('hapi')
const Boom = require('boom')

const apiKeys = _.words(API_KEYS)

const apiKeyScheme = () => {
  return {
    authenticate: function (request, reply) {
      const req = request.raw.req

      const apiKey = req.headers[ 'x-api-key' ]
      if (!apiKey) {
        return reply(Boom.unauthorized('Missing API key'))
      }

      if (!_.includes(apiKeys, apiKey)) {
        return reply(Boom.unauthorized('Invalid API key'))
      }

      return reply.continue({ credentials: { apiKey } })
    }
  }
}

class Server {
  constructor (options = { port: PORT }) {
    this._httpServer = new Hapi.Server({ debug: false, load: { sampleInterval: 1000 } })

    this._httpServer.connection(options)

    this._httpServer.on('start', () => Logger.info(`Started HTTP server on port ${PORT}`))
    this._httpServer.on('stop', () => Logger.info('Stopped HTTP server'))
    this._httpServer.on('response', (request) => {
      Logger.info(`${request.info.remoteAddress} - "${request.method.toUpperCase()} ${request.url.path}" ${request.response.statusCode} ${Date.now() - request.info.received} "${request.headers[ 'user-agent' ]}" "${request.headers[ 'x-api-key' ]}"`)
    })
    this._httpServer.on('request-error', (request, error) => Logger.error(error))
    this._httpServer.on('log', (event, tags) => {
      if (tags.error) {
        Logger.error(event.data)
      }
    })

    this._httpServer.auth.scheme('apiKey', apiKeyScheme)
    this._httpServer.auth.strategy('default', 'apiKey')
    this._httpServer.auth.default('default')

    this._httpServer.route(require('./routes/ping').toRoute())
    this._httpServer.route(require('./routes/healthcheck').toRoute())
    this._httpServer.route(require('./routes/open').toRoute())

    Health.addCheck('server', () => new Promise((resolve, reject) => {
      if (!this._httpServer.load) {
        return reject(new Error('Unable to read server load metrics'))
      }

      resolve()
    }))
  }

  start () {
    return new Promise((resolve, reject) => {
      if (this._httpServer.app.isRunning) {
        return resolve()
      }

      this._httpServer.start((error) => {
        if (error) {
          return reject(error)
        }

        this._httpServer.app.isRunning = true

        resolve()
      })
    })
  }

  stop () {
    return new Promise((resolve, reject) => {
      if (!this._httpServer.app.isRunning) {
        return resolve()
      }

      this._httpServer.stop((error) => {
        delete this._httpServer.app.isRunning

        if (error) {
          return reject(error)
        }

        resolve()
      })
    })
  }
}

module.exports = new Server()
