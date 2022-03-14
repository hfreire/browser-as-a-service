FROM node:17.7.1-alpine AS node

# Install base utils
RUN set -x \
  && apk --no-cache add \
    su-exec \
    curl \
    netcat-openbsd

# Install chromium
RUN set -x \
  && apk update && apk upgrade \
  && echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories \
  && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories \
  && apk --no-cache add \
      chromium@edge \
      nss@edge

FROM node AS build
ARG NAME
ARG NPM_TOKEN
USER node

RUN mkdir /home/node/$NAME
WORKDIR /home/node/$NAME

# Install npm packages
COPY --chown=node:node package.json package-lock.json .snyk ./
RUN NODE_ENV= npm ci

# Build app
COPY --chown=node:node src src/
RUN set -x \
  && npm run build --if-present \
  && npm prune --production \
  && npm cache clean --force

FROM node
LABEL maintainer="hugo@exec.sh"
ARG NAME
ARG VERSION
ARG VERSION_COMMIT
ARG VERSION_BUILD_DATE

RUN su-exec node mkdir /home/node/$NAME
WORKDIR /home/node/$NAME

# Copy app build
COPY --from=build --chown=node:node /home/node/$NAME /home/node/$NAME
COPY --chown=node:node share/docker/start.sh start.sh
COPY --chown=node:node share/docker/test.sh test.sh

# Set app runtime environment variables
ENV NAME $NAME
ENV VERSION $VERSION
ENV VERSION_COMMIT $VERSION_COMMIT
ENV VERSION_BUILD_DATE $VERSION_BUILD_DATE
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]

HEALTHCHECK --start-period=10s --interval=5m --timeout=3s \
  CMD nc -z localhost 3000 || exit 1
