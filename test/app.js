/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars */

describe('App', () => {
  let subject
  let Logger
  let Server

  before(() => {
    Logger = td.object([ 'info', 'error' ])

    Server = td.object([ 'start', 'stop' ])
  })

  afterEach(() => td.reset())

  describe('when running', () => {
    beforeEach(() => {
      td.replace('modern-logger', Logger)

      td.replace('../src/server', Server)

      subject = require('../src/app')
    })

    it('should start Server', () => {
      td.verify(Server.start(), { times: 1 })
    })
  })
})
