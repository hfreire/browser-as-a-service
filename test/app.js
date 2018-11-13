/*
 * Copyright (c) 2018, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

/* eslint-disable no-unused-vars,unicorn/no-process-exit */

describe('App', () => {
  let subject
  let Logger
  let Server

  beforeAll(() => {
    Logger = require('modern-logger')
    jest.mock('modern-logger')

    Server = require('../src/server')
    jest.mock('../src/server')
  })

  describe('when running', () => {
    const VERSION = 'my-version'
    const VERSION_COMMIT = 'my-version-commit'
    const VERSION_BUILD_DATE = 'my-version-build-date'

    beforeAll(() => {
      process.env.VERSION = VERSION
      process.env.VERSION_COMMIT = VERSION_COMMIT
      process.env.VERSION_BUILD_DATE = VERSION_BUILD_DATE
    })

    beforeEach(() => {
      subject = require('../src/app')
    })

    afterAll(() => {
      delete process.env.VERSION
      delete process.env.VERSION_COMMIT
      delete process.env.VERSION_BUILD_DATE
    })

    it('should start the server', () => {
      expect(Server.start).toHaveBeenCalledTimes(1)
    })

    it('should log version information', () => {
      expect(Logger.info).toHaveBeenCalledWith(`Running version ${VERSION} from commit ${VERSION_COMMIT} built on ${VERSION_BUILD_DATE}`)
    })
  })

  describe.skip('when catching an interrupt signal', () => {
    let exit

    beforeAll(() => {
      exit = process.exit

      process.exit = jest.fn()
    })

    beforeEach(() => {
      Server.stop.mockResolvedValue()
    })

    afterAll(() => {
      process.exit = exit
    })

    it('should exit process with return value 0', async () => {
      await process.emit('SIGINT')

      expect(process.exit).toHaveBeenCalledWith(0)
    })
  })

  describe.skip('when catching a termination signal', () => {
    let exit

    beforeAll(() => {
      exit = process.exit
    })

    beforeEach(() => {
      process.exit = jest.fn()

      Server.stop.mockResolvedValue()

      subject = require('../src/app')
    })

    afterAll(() => {
      process.exit = exit
    })

    it('should exit process with return value 0', async () => {
      await process.emit('SIGTERM')

      expect(process.exit).toHaveBeenCalledWith(0)
    })
  })

  describe.skip('when catching a hang up signal', () => {
    let exit

    beforeAll(() => {
      exit = process.exit
    })

    beforeEach(() => {
      process.exit = jest.fn()

      Server.stop.mockResolvedValue()

      subject = require('../src/app')
    })

    afterAll(() => {
      process.exit = exit
    })

    it('should exit process with return value 0', async () => {
      await process.emit('SIGHUP')

      expect(process.exit).toHaveBeenCalledWith(0)
    })
  })

  describe('when catching an abort signal', () => {
    let exit

    beforeAll(() => {
      exit = process.exit
    })

    beforeEach(() => {
      process.exit = jest.fn()

      Server.stop.mockResolvedValue()

      subject = require('../src/app')
    })

    afterAll(() => {
      process.exit = exit
    })

    it('should exit process with return value 1', async () => {
      await process.emit('SIGABRT')

      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

  describe.skip('when catching an uncaught exception', () => {
    const error = new Error('my-error-message')
    let exit

    beforeAll(() => {
      exit = process.exit
    })

    beforeEach(async () => {
      process.exit = jest.fn()

      Logger.error.mockImplementation(() => {})

      subject = require('../src/app')
    })

    afterAll(() => {
      process.exit = exit
    })

    it('should log error', async () => {
      await process.emit('uncaughtException', error)

      expect(Logger.error).toHaveBeenCalledWith(error)
    })

    it('should exit process with return value 1', async () => {
      await process.emit('uncaughtException')

      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })

  describe.skip('when catching an unhandled rejection', () => {
    const error = new Error('my-error-message')
    let exit

    beforeAll(() => {
      exit = process.exit
    })

    beforeEach(() => {
      process.exit = jest.fn()

      Logger.error.mockResolvedValue()

      subject = require('../src/app')
    })

    afterAll(() => {
      process.exit = exit
    })

    it('should log error', async () => {
      await process.emit('unhandledRejection', error)

      expect(Logger.error).toHaveBeenCalledWith(error)
    })

    it('should exit process with return value 1', async () => {
      await process.emit('uncaughtException')

      expect(process.exit).toHaveBeenCalledWith(1)
    })
  })
})
