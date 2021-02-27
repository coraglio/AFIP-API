FROM node:lts-alpine

RUN mkdir -p /opt/afip-api
WORKDIR /opt/afip-api

COPY . /opt/afip-api
RUN npm install --prod

RUN apk --update add openssl

EXPOSE 5000
CMD ["npm", "run", "dev"]
