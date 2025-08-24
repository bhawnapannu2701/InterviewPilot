# Build a small Node server image
FROM node:18-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json* ./
RUN npm install --production=false

# Build
COPY tsconfig.json ./tsconfig.json
COPY src ./src
RUN npm run build

# Runtime: only prod deps + built files
RUN npm prune --production

EXPOSE 5000

ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
