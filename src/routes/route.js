/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

class Route {
  constructor (method, path) {
    this.method = method
    this.path = path
  }

  handler (request, reply) {
    return reply(null)
  }

  auth () {}

  toRoute () {
    return {
      method: this.method,
      path: this.path,
      config: {
        handler: this.handler,
        auth: this.auth()
      }
    }
  }
}

module.exports = Route

