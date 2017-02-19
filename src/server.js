/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NAME = process.env.NAME
const VERSION = process.env.VERSION
const PORT = process.env.PORT || 3000
const API_KEYS = process.env.API_KEYS || ''

const _ = require('lodash')
const Promise = require('bluebird')

const Logger = require('modern-logger')

const Health = require('health-checkup')

const Hapi = require('hapi')
const Boom = require('boom')
const Inert = require('inert')
const Vision = require('vision')

const apiKeys = _.words(API_KEYS, /[^, ]+/g)

const apiKeyScheme = () => {
  return {
    authenticate: function (request, reply) {
      const { headers, query } = request

      const apiKey = headers[ 'x-api-key' ] || query && query.key
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

const HapiSwagger = {
  register: require('hapi-swagger'),
  options: {
    info: { title: NAME, version: VERSION },
    documentationPath: '/docs',
    tags: [
      { name: 'open', description: 'Open URL' },
      { name: 'ping', description: 'Query service status' },
      { name: 'healthcheck', description: 'Query service health' }
    ]
  }
}

class Server {
  constructor (options = { port: PORT }) {
    this._httpServer = new Hapi.Server({ debug: false, load: { sampleInterval: 60000 } })

    this._httpServer.connection(options)

    this._httpServer.on('start', () => Logger.info(`Started :rocket: HTTP server on port ${PORT}`))
    this._httpServer.on('stop', () => Logger.info('Stopped HTTP server'))
    this._httpServer.on('response', ({ info, method, url, response, headers, query }) => {
      const remoteAddress = info.remoteAddress
      const path = url.path
      const statusCode = response.statusCode
      const duration = Date.now() - info.received
      const userAgent = headers[ 'user-agent' ]
      const apiKey = headers[ 'x-api-key' ] || query.key || '-'

      Logger.info(`${remoteAddress} - "${method.toUpperCase()} ${path}" ${statusCode} ${duration} "${userAgent}" "${apiKey}"`)
    })
    this._httpServer.on('request-error', (request, error) => Logger.error(error))

    this._httpServer.auth.scheme('apiKey', apiKeyScheme)
    this._httpServer.auth.strategy('default', 'apiKey')
    this._httpServer.auth.default('default')

    this._httpServer.register([ Inert, Vision, HapiSwagger ])

    this._httpServer.route(require('./routes/open').toRoute())
    this._httpServer.route(require('./routes/ping').toRoute())
    this._httpServer.route(require('./routes/healthcheck').toRoute())

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
