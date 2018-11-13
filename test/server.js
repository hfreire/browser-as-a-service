/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Server', () => {
  let subject
  let Serverful

  beforeAll(() => {
    ({ Serverful } = require('serverful'))
    jest.mock('serverful')
  })

  describe('when exporting', () => {
    beforeEach(() => {
      subject = require('../src/server')
    })

    it('should be instance of serverful', () => {
      expect(subject).toBeInstanceOf(Serverful)
    })
  })
})
