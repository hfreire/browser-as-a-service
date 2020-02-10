FROM node:13.8.0-alpine AS node

FROM node AS build

ARG NPM_TOKEN

WORKDIR /tmp/build

# Install npm packages
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --production

# Build app
COPY src src/
RUN set -x \
  && npm run build --if-present \
  && npm cache clean --force

FROM node
LABEL maintainer="hugo@exec.sh"

ARG NAME
ARG VERSION
ARG VERSION_COMMIT
ARG VERSION_BUILD_DATE

WORKDIR /home/node/$NAME

# Copy app build
RUN chown node:node /home/node/$NAME
COPY --from=build --chown=node:node /tmp/build /home/node/$NAME
COPY share/docker/start.sh start.sh
COPY share/docker/test.sh test.sh

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
