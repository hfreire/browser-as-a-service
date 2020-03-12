/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const { Serverful } = require('serverful')
const subject = require('../src/server')

jest.mock('serverful')

describe('Server', () => {
  describe('when exporting', () => {
    it('should be instance of serverful', () => {
      expect(subject).toBeInstanceOf(Serverful)
    })
  })
})
