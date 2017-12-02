/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Open', () => {
  let subject
  let serverful
  let Joi
  let Boom
  let Browser

  before(() => {
    serverful = td.object([])
    serverful.Route = td.constructor([])

    Joi = td.object([ 'string', 'object' ])

    Boom = td.object([ 'badImplementation' ])

    Browser = td.object([ 'open' ])
  })

  afterEach(() => td.reset())

  describe('when handling a request to open a webpage', () => {
    const report = {}
    const query = {}
    const request = { query }
    let reply

    before(() => {
      reply = td.function()
    })

    beforeEach(() => {
      td.replace('serverful', serverful)

      td.replace('joi', Joi)

      td.replace('boom', Boom)

      td.replace('../../src/browser', Browser)
      td.when(Browser.open(), { ignoreExtraArgs: true }).thenResolve(report)

      subject = require('../../src/routes/open')
    })

    it('should return webpage report', () => {
      return subject.handler(request, reply)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(reply(td.matchers.anything(), captor.capture()), { times: 1 })

          const response = captor.value
          response.should.be.equal(report)
        })
    })
  })

  describe('when handling a request that fails to open a webpage', () => {
    const error = new Error('my-error-message')
    const query = {}
    const request = { query }
    let reply

    before(() => {
      reply = td.function()
    })

    beforeEach(() => {
      td.replace('serverful', serverful)

      td.replace('joi', Joi)

      td.replace('boom', Boom)

      td.replace('../../src/browser', Browser)
      td.when(Browser.open(), { ignoreExtraArgs: true }).thenReject(error)

      subject = require('../../src/routes/open')
    })

    it('should call boom bad implementation', () => {
      return subject.handler(request, reply)
        .then(() => {
          td.verify(Boom.badImplementation(error), { times: 1 })
        })
    })
  })
})
