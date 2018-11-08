/*
 * Copyright (c) 2017, Hugo Freire <hugo@exec.sh>.
 *
 * This source code is licensed under the license found in the
 * LICENSE.md file in the root directory of this source tree.
 */

const { Route } = require('serverful')

const Joi = require('joi')

const Browser = require('../browser')

class Open extends Route {
  constructor () {
    super('GET', '/open', 'Opens web page in headless browser', 'Returns opened web page')
  }

  async handler ({ query }, h) {
    const { url } = query

    return Browser.open(url)
  }

  validate () {
    return {
      query: {
        key: Joi.string()
          .optional()
          .description('the access API key'),
        url: Joi.string()
          .required()
          .description('the web page URL to open')
      },
      headers: Joi.object({
        'x-api-key': Joi.string()
          .optional()
          .description('the access API key')
      }).unknown()
    }
  }
}

module.exports = new Open()
