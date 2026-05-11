# ============================================
# STAGE 1 : Développement
# ============================================
FROM node:18-alpine AS development

RUN addgroup -S appuser && adduser -S appuser -G appuser

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 3000

CMD ["npm", "start"]


# ============================================
# STAGE 2 : Production
# ============================================
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]