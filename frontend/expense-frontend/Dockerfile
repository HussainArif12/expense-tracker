FROM node:lts-alpine3.24 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
#RUN npm run build
#RUN rm -rf node_modules
EXPOSE 3000
CMD ["npm", "run", "build"]

# FROM node:lts-alpine3.24 AS runner
# WORKDIR /app
# COPY --from=builder /app/package*.json ./
# COPY --from=builder /app/.output ./.output