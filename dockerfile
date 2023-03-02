FROM node:18.13.0-alpine
WORKDIR /app


COPY . . 
RUN npm install 
RUN apk update
RUN apk add redis
RUN redis-server &
# CMD ["node", "server.js"]
# CMD ["redis-server"]
CMD ["sh", "-c", "redis-server & node server.js"]
