/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Route = require('./route')

class Ping extends Route {
  constructor () {
    super('GET', '/ping')
  }

  handler (request, reply) {
    return reply(null, { answer: 'pong' })
  }

  auth () {
    return false
  }
}

module.exports = new Ping()
