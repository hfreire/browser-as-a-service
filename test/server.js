/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Server', () => {
  let subject
  let serverful

  before(() => {
    serverful = td.object([])
    serverful.Serverful = td.constructor([])
  })

  after(() => td.reset())

  describe('when exporting', () => {
    beforeEach(() => {
      td.replace('serverful', serverful)

      subject = require('../src/server')
    })

    it('should be instance of serverful', () => {
      subject.should.be.instanceOf(serverful.Serverful)
    })
  })
})
