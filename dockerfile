FROM node:18.13.0-alpine
WORKDIR /app


COPY . . 
RUN npm install 
CMD ["node", "app.js"]
