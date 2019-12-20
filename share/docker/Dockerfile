FROM node:13.5.0-alpine

LABEL maintainer="hugo@exec.sh"

# Set app runtime environment variables
ARG NPM_TOKEN
ARG NAME
ENV NAME $NAME
ARG VERSION
ENV VERSION $VERSION
ARG VERSION_COMMIT
ENV VERSION_COMMIT $VERSION_COMMIT
ARG VERSION_BUILD_DATE
ENV VERSION_BUILD_DATE $VERSION_BUILD_DATE

# Create app directory
RUN set -eux; \
  mkdir /home/node/$NAME; \
  chown node:node /home/node/$NAME
WORKDIR /home/node/$NAME

# Install utils
RUN set -x \
  && apk --no-cache add \
    su-exec \
    curl \
    netcat-openbsd

# Install chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
RUN set -x \
  && apk update && apk upgrade \
  && echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories \
  && echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories \
  && apk --no-cache add \
      chromium@edge \
      nss@edge

# Copy app source
COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json
COPY --chown=node:node src src/
COPY --chown=node:node share/docker/start.sh start.sh
COPY --chown=node:node share/docker/test.sh test.sh

# Install npm packages
RUN set -x \
  && su-exec node npm install --production \
  && su-exec node npm cache clean --force && npm cache clean --force

EXPOSE 3000

ENTRYPOINT [ "./start.sh" ]

HEALTHCHECK --start-period=10s --interval=5m --timeout=3s \
  CMD nc -z localhost 3000 || exit 1
