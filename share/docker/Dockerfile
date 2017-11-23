FROM node:8.9.0-slim

MAINTAINER hugo@exec.sh

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
ENV HOME /opt/$NAME
RUN mkdir -p $HOME
WORKDIR $HOME

# Install app runtime and build dependencies
RUN apt-get update &&\
    apt-get install -y libgtk2.0-0 libgconf-2-4 libasound2 libxtst6 libxss1 libnss3 xvfb &&\
    apt-get install -y git &&\
    apt-get install -y netcat &&\
    apt-get clean
COPY package.json $HOME
RUN npm install --production

# Copy app source
COPY src $HOME/src

# Remove app build dependencies
RUN apt-get remove --purge -y git &&\
    apt-get autoremove --purge -y

COPY share/docker/start.sh /start.sh
RUN chmod +x /start.sh
COPY share/docker/test.sh /test.sh
RUN chmod +x /test.sh

EXPOSE 3000
ENTRYPOINT [ "/start.sh" ]

HEALTHCHECK --start-period=10s --interval=5m --timeout=3s \
  CMD nc -z localhost 3000 || exit 1
