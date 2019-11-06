# A web browser :earth_americas: hosted as a service, to render your JavaScript web pages as HTML

[![](https://github.com/hfreire/browser-as-a-service/workflows/ci/badge.svg)](https://github.com/hfreire/browser-as-a-service/actions?workflow=ci)
[![](https://github.com/hfreire/browser-as-a-service/workflows/cd/badge.svg)](https://github.com/hfreire/browser-as-a-service/actions?workflow=cd)
[![Known Vulnerabilities](https://snyk.io/test/github/hfreire/browser-as-a-service/badge.svg)](https://snyk.io/test/github/hfreire/browser-as-a-service)
[![](https://img.shields.io/github/release/hfreire/browser-as-a-service.svg)](https://github.com/hfreire/browser-as-a-service/releases)
[![Docker Stars](https://img.shields.io/docker/stars/hfreire/browser-as-a-service.svg)](https://hub.docker.com/r/hfreire/browser-as-a-service/)
[![Docker Pulls](https://img.shields.io/docker/pulls/hfreire/browser-as-a-service.svg)](https://hub.docker.com/r/hfreire/browser-as-a-service/)

> Uses [serverful](https://github.com/hfreire/serverful) to expose [puppeteer](https://github.com/GoogleChrome/puppeteer) headless browser through a REST API.

### Features
* Launch :rocket: inside a Docker container :whale: so you don't need to manage the dependencies :raised_hands: :white_check_mark:
* Deploy on [AWS](https://aws.amazon.com) using an [Antifragile Infrastructure](https://github.com/antifragile-systems/antifragile-infrastructure) that allows you to easily monitor activity and scale :chart_with_upwards_trend: capacity :white_check_mark:

### How to use

#### Use it in your terminal
Using it in your terminal requires [Docker](https://www.docker.com) installed in your system.

##### Run the Docker image in a container 
Detach from the container and expose port `9453`.
```
docker run -d -p "9453:3000" hfreire/browser-as-a-service
```

##### Browse Google's website (https://www.google.com)
Use `curl` to fetch Google's website
```
curl 'http://localhost:9453/open?url=https%3A%2F%2Fwww.google.com'
```

#### Available REST API endpoints
Swagger documentation available at `http://localhost:9453/docs`.

#### Available usage environment variables
Variable | Description | Required | Default value
:---:|:---:|:---:|:---:
PORT | The port to be used by the HTTP server. | false | `3000`
API_KEYS | The secret keys that should be used when securing endpoints. | false | `undefined`
SO_TIMEOUT | TCP socket connection timeout. | false | `120000`
BASE_PATH | Base path to be prefixed to all available endpoint paths. | false | `/`
PING_PATH | Endpoint path for pinging app. | false | `/ping`
HEALTHCHECK_PATH | Endpoint for checking app health. | false | `/healthcheck`
LOG_LEVEL | The log level verbosity. | false | `info`
ENVIRONMENT | The environment the app is running on. | false | `undefined`
ROLLBAR_API_KEY | The server API key used to talk with Rollbar. | false | `undefined`

### How to build
##### Clone the GitHub repo
```
git clone https://github.com/hfreire/browser-as-a-service.git
```

##### Change current directory
```
cd browser-as-a-service
```

##### Run the NPM script that will build the Docker image
```
npm run build
```

### How to deploy

#### Deploy it from your terminal
Deploying it from your terminal requires [terraform](https://www.terraform.io) installed on your system and an [antifragile infrastructure](https://github.com/antifragile-systems/antifragile-infrastructure) setup available in your [AWS](https://aws.amazon.com) account.

##### Clone the GitHub repo
```
git clone https://github.com/hfreire/browser-as-a-service.git
```

##### Change current directory
```
cd browser-as-a-service
```

##### Run the NPM script that will deploy all functions
```
npm run deploy
```

#### Available deployment environment variables
Variable | Description | Required | Default value
:---:|:---:|:---:|:---:
VERSION | The version of the app. | false | `latest`
ANTIFRAGILE_STATE_AWS_REGION | The AWS region used for the antifragile state . | false | `undefined`
ANTIFRAGILE_STATE_AWS_S3_BUCKET | The AWS S3 bucket used for the antifragile state. | false | `undefined`
ANTIFRAGILE_STATE_AWS_DYNAMODB_TABLE | The AWS DynamoDB table used for the antifragile state. | false | `undefined`
ANTIFRAGILE_INFRASTRUCTURE_DOMAIN_NAME | The domain used for the antifragile infrastructure. | true | `undefined`

### How to contribute
You can contribute either with code (e.g., new features, bug fixes and documentation) or by [donating 5 EUR](https://paypal.me/hfreire/5). You can read the [contributing guidelines](CONTRIBUTING.md) for instructions on how to contribute with code. 

All donation proceedings will go to the [Sverige för UNHCR](https://sverigeforunhcr.se), a swedish partner of the [UNHCR - The UN Refugee Agency](http://www.unhcr.org), a global organisation dedicated to saving lives, protecting rights and building a better future for refugees, forcibly displaced communities and stateless people.

### License
Read the [license](./LICENSE.md) for permissions and limitations.
