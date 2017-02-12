/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Route = require('./route')

const Joi = require('joi')

class Ping extends Route {
  constructor () {
    super('GET', '/ping', 'Ping service', 'Returns a pong for every ping')
  }

  handler (request, reply) {
    return reply(null, { answer: 'pong' })
  }

  auth () {
    return false
  }

  plugins () {
    return {
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Service is alive',
            schema: Joi.object({
              answer: 'pong'
            }).label('Reply')
          }
        }
      }
    }
  }
}

module.exports = new Ping()
