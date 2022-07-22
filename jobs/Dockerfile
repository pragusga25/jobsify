FROM node:alpine

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install --omit=dev
COPY . .

CMD [ "npm", "start" ]
