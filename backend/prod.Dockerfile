# Build stage
FROM node:20 AS build-stage
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run tsc

# Run stage
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY --from=build-stage /usr/src/app/build ./build
COPY --from=build-stage /usr/src/app/data ./data

EXPOSE 3001
CMD ["node", "build/index.js"]