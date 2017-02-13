# A web browser :earth_americas: hosted as a service, to render your JavaScript web pages as HTML

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Build Status](https://travis-ci.org/hfreire/browser-as-a-service.svg?branch=master)](https://travis-ci.org/hfreire/browser-as-a-service)
[![Coverage Status](https://coveralls.io/repos/github/hfreire/browser-as-a-service/badge.svg?branch=master)](https://coveralls.io/github/hfreire/browser-as-a-service?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/hfreire/browser-as-a-service.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/github/release/hfreire/browser-as-a-service.svg)](https://github.com/hfreire/browser-as-a-service/releases)
[![](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Uses [hapi](https://github.com/hapijs/hapijs) to expose [Nightmare](https://github.com/segmentio/nightmare) headless browser through a REST API.

### Features
* Launch :rocket: inside a Docker container :whale: so you don't need to manage the dependencies :raised_hands: :white_check_mark:
* Quickly deploy :runner: and easily scale :two_men_holding_hands: the number of servers by using Rancher :white_check_mark:

### How to use
```
docker run hfreire/browser-as-a-service
```
#### Available environment variables
Variable | Description | Default value
 :---:|:---:|:---:
`API_KEYS` | API keys used to authenticate the clients | `not used`

### How to build
Clone the GitHub repo
```
git clone https://github.com/hfreire/browser-as-a-service.git
```

Change current directory
```
cd browser-as-a-service
```

Run the NPM script that will build the docker container
```
npm run build
```
