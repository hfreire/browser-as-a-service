/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Browser', () => {
  let subject
  let Nightmare
  let NightmareIframeManager
  let RandomHttpUserAgent

  before(() => {
    Nightmare = td.object([ 'useragent', 'on', 'goto', 'enterIFrame', 'evaluate', 'end', 'then' ])

    NightmareIframeManager = td.function()

    RandomHttpUserAgent = td.object([ 'get' ])
  })

  afterEach(() => td.reset())

  describe('when opening web page without an iframe', () => {
    const url = 'my-url'
    const options = {}
    const userAgent = 'my-user-agent'

    beforeEach(() => {
      td.when(Nightmare.useragent(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.on(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.goto(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.enterIFrame(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.evaluate(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.end(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.then(), { ignoreExtraArgs: true }).thenResolve()
      td.replace('nightmare', () => Nightmare)

      td.replace('nightmare-iframe-manager', NightmareIframeManager)

      td.when(RandomHttpUserAgent.get()).thenResolve(userAgent)
      td.replace('random-http-useragent', RandomHttpUserAgent)

      subject = require('../src/browser')
    })

    it('should get a random http user-agent', () => {
      return subject.open(url, options)
        .then(() => {
          td.verify(RandomHttpUserAgent.get(), { times: 1 })
        })
    })

    it('should use random http user-agent', () => {
      return subject.open(url, options)
        .then(() => {
          td.verify(Nightmare.useragent(userAgent), { times: 1 })
        })
    })

    it('should listen to console events', () => {
      return subject.open(url, options)
        .then(() => {
          td.verify(Nightmare.on('console'), { ignoreExtraArgs: true, times: 1 })
        })
    })

    it('should go to url', () => {
      return subject.open(url, options)
        .then(() => {
          td.verify(Nightmare.goto(url), { times: 1 })
        })
    })

    it('should evaluate javascript code', () => {
      return subject.open(url, options)
        .then(() => {
          td.verify(Nightmare.evaluate(), { ignoreExtraArgs: true, times: 1 })
        })
    })

    it('should close nightmare', () => {
      return subject.open(url, options)
        .then(() => {
          td.verify(Nightmare.end(), { times: 1 })
        })
    })
  })

  describe('when opening web page with an iframe', () => {
    const url = 'my-url'
    const options = {}
    const iframe = 'my-iframe'
    const userAgent = 'my-user-agent'

    beforeEach(() => {
      td.when(Nightmare.useragent(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.on(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.goto(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.enterIFrame(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.evaluate(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.end(), { ignoreExtraArgs: true }).thenReturn(Nightmare)
      td.when(Nightmare.then(), { ignoreExtraArgs: true }).thenResolve()
      td.replace('nightmare', () => Nightmare)

      td.replace('nightmare-iframe-manager', NightmareIframeManager)

      td.when(RandomHttpUserAgent.get()).thenResolve(userAgent)
      td.replace('random-http-useragent', RandomHttpUserAgent)

      subject = require('../src/browser')
    })

    it('should get a random http user-agent', () => {
      return subject.open(url, options, iframe)
        .then(() => {
          td.verify(RandomHttpUserAgent.get(), { times: 1 })
        })
    })

    it('should use random http user-agent', () => {
      return subject.open(url, options, iframe)
        .then(() => {
          td.verify(Nightmare.useragent(userAgent), { times: 1 })
        })
    })

    it('should listen to console events', () => {
      return subject.open(url, options, iframe)
        .then(() => {
          td.verify(Nightmare.on('console'), { ignoreExtraArgs: true, times: 1 })
        })
    })

    it('should go to url', () => {
      return subject.open(url, options, iframe)
        .then(() => {
          td.verify(Nightmare.goto(url), { times: 1 })
        })
    })

    it('should select iframe', () => {
      return subject.open(url, options, iframe)
        .then(() => {
          td.verify(Nightmare.enterIFrame(iframe), { times: 1 })
        })
    })

    it('should evaluate javascript code', () => {
      return subject.open(url, options, iframe)
        .then(() => {
          td.verify(Nightmare.evaluate(), { ignoreExtraArgs: true, times: 1 })
        })
    })

    it('should close nightmare', () => {
      return subject.open(url, options, iframe)
        .then(() => {
          td.verify(Nightmare.end(), { times: 1 })
        })
    })
  })
})
