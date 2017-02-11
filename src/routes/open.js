/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Route = require('./route')

const Boom = require('boom')

const Browser = require('../browser')

class Open extends Route {
  constructor () {
    super('GET', '/open')
  }

  handler ({ query }, reply) {
    const url = query.url

    if (!url) {
      return reply(Boom.badRequest('Missing URL parameter'))
    }

    return Browser.open(url)
      .then((page) => reply(null, { page }))
  }

  auth () {
    return false
  }
}

module.exports = new Open()
