# This dockerfile uses the keymetrics/pm2
# VERSION 1
# Author: HeavenXing

FROM keymetrics/pm2:latest-alpine

# Bundle APP files
COPY . /home/serve

ENV NODE_ENV production
EXPOSE 8080
WORKDIR /home/serve

RUN npm i

CMD pm2-runtime start pm2.json