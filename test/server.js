/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Server', () => {
  let subject
  let httpServer

  before(() => {
    httpServer = td.object([ 'connection', 'auth', 'on', 'route', 'start', 'stop', 'register' ])
    httpServer.auth.scheme = td.function()
    httpServer.auth.strategy = td.function()
    httpServer.auth.default = td.function()
    httpServer.app = td.object([])
  })

  afterEach(() => td.reset())

  describe('when constructing a server', () => {
    let pingRoute
    let healthcheckRoute
    let openRoute

    before(() => {
      subject = require('../src/server')
    })

    beforeEach(() => {
      td.replace('hapi', { 'Server': function () { return httpServer } })

      pingRoute = td.object([])
      const ping = td.replace('../src/routes/ping', td.object([ 'toRoute' ]))
      td.when(ping.toRoute()).thenReturn(pingRoute)

      healthcheckRoute = td.object([])
      const healthcheck = td.replace('../src/routes/healthcheck', td.object([ 'toRoute' ]))
      td.when(healthcheck.toRoute()).thenReturn(healthcheckRoute)

      openRoute = td.object([])
      const open = td.replace('../src/routes/open', td.object([ 'toRoute' ]))
      td.when(open.toRoute()).thenReturn(openRoute)
    })

    afterEach(() => {
      delete require.cache[ require.resolve('../src/server') ]
    })

    it('should listen on hapi server start event', () => {
      subject = require('../src/server')

      td.verify(httpServer.on('start'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server stop event', () => {
      subject = require('../src/server')

      td.verify(httpServer.on('stop'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server response event', () => {
      subject = require('../src/server')

      td.verify(httpServer.on('response'), { times: 1, ignoreExtraArgs: true })
    })

    it('should listen on hapi server request-error', () => {
      subject = require('../src/server')

      td.verify(httpServer.on('request-error'), { times: 1, ignoreExtraArgs: true })
    })

    it('should configure route to ping ', () => {
      subject = require('../src/server')

      td.verify(httpServer.route(pingRoute), { times: 1 })
    })

    it('should configure route to healthcheck ', () => {
      subject = require('../src/server')

      td.verify(httpServer.route(healthcheckRoute), { times: 1 })
    })

    it('should configure route to open ', () => {
      subject = require('../src/server')

      td.verify(httpServer.route(openRoute), { times: 1 })
    })
  })

  describe('when starting server', () => {
    before(() => {
      td.when(httpServer.start()).thenCallback()

      td.replace('hapi', { 'Server': function () { return httpServer } })

      subject = require('../src/server')
    })

    after(() => {
    })

    it('should invoke hapi server start', () => {
      return subject.start()
        .finally(() => {
          td.verify(httpServer.start(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })

  describe('when stopping a running server', () => {
    before(() => {
      td.when(httpServer.start()).thenCallback()
      td.when(httpServer.stop()).thenCallback()

      td.replace('hapi', { 'Server': function () { return httpServer } })

      subject = require('../src/server')
      return subject.start()
    })

    after(() => {
    })

    it('should invoke hapi server stop', () => {
      return subject.stop()
        .finally(() => {
          td.verify(httpServer.stop(), { times: 1, ignoreExtraArgs: true })
        })
    })
  })
})
