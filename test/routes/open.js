/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Open', () => {
  let subject
  let Browser

  before(() => {
    Browser = td.object([ 'open' ])
  })

  afterEach(() => td.reset())

  describe('when handling a request to open a webpage', () => {
    const report = {}
    const query = {}
    const request = { query }
    let reply

    beforeEach(() => {
      reply = td.function()

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

    beforeEach(() => {
      reply = td.function()

      td.replace('../../src/browser', Browser)
      td.when(Browser.open(), { ignoreExtraArgs: true }).thenReject(error)

      subject = require('../../src/routes/open')
    })

    it('should return 500', () => {
      return subject.handler(request, reply)
        .then(() => {
          const captor = td.matchers.captor()

          td.verify(reply(captor.capture()), { times: 1 })

          const response = captor.value
          response.should.be.instanceOf(Error)
          response.isBoom.should.be.equal(true)
          response.message.should.contain(error.message)
          response.output.statusCode.should.be.equal(500)
        })
    })
  })
})
