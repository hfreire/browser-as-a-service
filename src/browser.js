/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const _ = require('lodash')
const Promise = require('bluebird')

const Nightmare = require('nightmare')
Nightmare.Promise = Promise
require('nightmare-iframe-manager')(Nightmare)

const RandomHttpUserAgent = require('random-http-useragent')

const defaultOptions = {
  nightmare: {
    show: false,
    webPreferences: {
      webSecurity: false
    }
  }
}

class Browser {
  open (url, options = {}, iframe) {
    const report = {}

    this._options = _.defaultsDeep({}, options, defaultOptions)

    return RandomHttpUserAgent.get()
      .then((userAgent) => {
        const nightmare = Nightmare(this._options.nightmare)

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
            .evaluate(() => document.documentElement.outerHTML)
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
            .evaluate(() => document.documentElement.outerHTML)
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
