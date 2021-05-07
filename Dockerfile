FROM node:lts-alpine

RUN mkdir -p /opt/afip-api
WORKDIR /opt/afip-api

COPY . /opt/afip-api
RUN npm install --prod

RUN apk --update add openssl

EXPOSE 5000
CMD ["npm", "start"]

# sudo docker build --pull --rm -f "./Dockerfile" -t registry.gitlab.com/fedecoraglio/venta-control-app/afip-api:latest .
# sudo docker push registry.gitlab.com/fedecoraglio/venta-control-app/afip-api:latest
# sudo docker run --name afip-api --network host registry.gitlab.com/fedecoraglio/venta-control-app/afip-api:latest