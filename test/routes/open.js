/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

describe('Open', () => {
  let subject
  let Browser

  beforeEach(() => {
    const { Route } = require('serverful')
    jest.mock('serverful')
    Route.BASE_PATH = '/'

    Browser = require('../../src/browser')
    jest.mock('../../src/browser')
  })

  describe('when handling a request to open a url', () => {
    const query = {}
    const request = { query }
    let h

    beforeEach(() => {
      h = jest.fn()

      Browser.open.mockResolvedValue({})

      subject = require('../../src/routes/open')
    })

    it('should return result', async () => {
      const result = await subject.handler(request, h)

      expect(result).toEqual({})
    })
  })

  describe('when handling a request that fails to open a url', () => {
    const query = {}
    const request = { query }
    const error = new Error('my-message')
    let h

    beforeEach(() => {
      h = jest.fn()

      Browser.open.mockRejectedValue(error)

      subject = require('../../src/routes/open')
    })

    it('should propagate error', async () => {
      await expect(subject.handler(request, h)).rejects.toThrow(error)
    })
  })
})
