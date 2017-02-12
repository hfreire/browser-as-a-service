/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

const _ = require('lodash')

const Nightmare = require('nightmare')
require('nightmare-iframe-manager')(Nightmare)

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

  open (url, iframe) {
    const report = {}

    return RandomUserAgent.get()
      .then((userAgent) => {
        const nightmare = Nightmare(this.options)

        if (iframe) {
          return nightmare
            .useragent(userAgent)
            .on('console', (type, message) => {
              if (!report.console) {
                report.console = []
              }

              report.console.push({ type, message })
            })
            .goto(url)
            .enterIFrame(iframe)
            .evaluate(() => {
              /* eslint-disable */
              return document.documentElement.outerHTML
              /* eslint-enable */
            })
            .end()
            .then((elements) => {
              report.elements = elements

              return report
            })
        } else {
          return nightmare
            .useragent(userAgent)
            .on('console', (type, message) => {
              if (!report.console) {
                report.console = []
              }

              report.console.push({ type, message })
            })
            .goto(url)
            .evaluate(() => {
              /* eslint-disable */
              return document.documentElement.outerHTML
              /* eslint-enable */
            })
            .end()
            .then((elements) => {
              report.elements = elements

              return report
            })
        }
      })
  }
}

module.exports = new Browser()
