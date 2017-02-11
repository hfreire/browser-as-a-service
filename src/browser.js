/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash')

const Nightmare = require('nightmare')

const RandomUserAgent = require('random-http-useragent')

class Browser {
  constructor (options = {}) {
    this.options = _.defaults(options, {
      show: true,
      webPreferences: {
        webSecurity: false
      }
    })
  }

  open (url) {
    return RandomUserAgent.get()
      .then((userAgent) => {
        const nightmare = Nightmare(this.options)
        return nightmare
          .useragent(userAgent)
          .goto(url)
          .evaluate(() => {
            /* eslint-disable */
            return document.documentElement.outerHTML
            /* eslint-enable */
          })
          .end()
          .then((page) => page)
      })
  }
}

module.exports = new Browser()
