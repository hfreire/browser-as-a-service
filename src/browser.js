/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/* eslint-disable no-undef */

const _ = require('lodash')
const RandomHttpUserAgent = require('random-http-useragent')
const puppeteer = require('puppeteer-core')

const { PUPPETEER_EXECUTABLE_PATH } = process.env

const defaultOptions = {
  puppeteer: {
    executablePath: PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox', '--disable-dev-shm-usage']
  },
  'random-http-useragent': {}
}

class Browser {
  constructor() {
    this._options = _.defaultsDeep({}, defaultOptions)

    RandomHttpUserAgent.configure(_.get(this._options, 'random-http-useragent'))
  }

  async open(url) {
    if (!url) {
      throw new Error('invalid arguments')
    }

    const result = {}

    const userAgent = await RandomHttpUserAgent.get()

    const browser = await puppeteer.launch(_.get(this._options, 'puppeteer'))

    const page = await browser.newPage()
    await page.setUserAgent(userAgent)

    page.on('console', consoleMessage => {
      if (!result.console) {
        result.console = []
      }

      result.console.push({
        type: consoleMessage.type(),
        text: consoleMessage.text()
      })
    })
    await page.goto(url)

    result.elements = await page.evaluate(() => {
      return (
        new XMLSerializer().serializeToString(document.doctype) +
        document.documentElement.outerHTML
      )
    })

    await browser.close()

    return result
  }
}

module.exports = new Browser()
