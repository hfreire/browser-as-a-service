/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Browser', () => {
  let subject
  let puppeteer
  let RandomHttpUserAgent

  beforeEach(() => {
    puppeteer = require('puppeteer-core')
    jest.mock('puppeteer-core')

    RandomHttpUserAgent = require('random-http-useragent')
    jest.mock('random-http-useragent')
  })

  describe('when opening a url', () => {
    const url = 'my-url'
    const userAgent = 'my-user-agent'
    let browser
    let page

    beforeEach(() => {
      browser = { newPage: jest.fn(), close: jest.fn() }
      page = {
        setUserAgent: jest.fn(),
        on: jest.fn(),
        goto: jest.fn(),
        evaluate: jest.fn()
      }

      browser.newPage.mockResolvedValue(page)
      puppeteer.launch.mockResolvedValue(browser)

      RandomHttpUserAgent.get.mockResolvedValue(userAgent)

      subject = require('../src/browser')
    })

    it('should use random http user-agent', async () => {
      await subject.open(url)

      expect(page.setUserAgent).toHaveBeenCalledWith(userAgent)
    })

    it('should listen to console events', async () => {
      await subject.open(url)

      expect(page.on).toHaveBeenCalledWith('console', expect.anything())
    })

    it('should go to url', async () => {
      await subject.open(url)

      expect(page.goto).toHaveBeenCalledWith(url)
    })

    it('should evaluate javascript code', async () => {
      await subject.open(url)

      expect(page.evaluate).toHaveBeenCalled()
    })

    it('should close browser', async () => {
      await subject.open(url)

      expect(browser.close).toHaveBeenCalled()
    })
  })
})
