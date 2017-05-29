/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

describe('Server', () => {
  let subject
  const { Serverful } = require('serverful')

  describe('when exporting', () => {
    beforeEach(() => {
      subject = require('../src/server')
    })

    it('should be instance of serverful', () => {
      subject.should.be.instanceOf(Serverful)
    })
  })
})
