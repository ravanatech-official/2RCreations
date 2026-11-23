# Multi-stage zero-bloat Cloud Run image for 2R Creations
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --legacy-peer-deps

COPY . .

# Build-time public Vite configuration passed safely via Cloud Build / GitHub Actions args
ARG VITE_APP_URL=https://2rcreations.web.app
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN=ravanatek.firebaseapp.com
ARG VITE_FIREBASE_PROJECT_ID=ravanatek
ARG VITE_FIREBASE_STORAGE_BUCKET=ravanatek.firebasestorage.app
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID
ARG VITE_FIREBASE_MEASUREMENT_ID
ARG VITE_FIREBASE_DATABASE_ID=two-r-creations-db
ARG VITE_FIRESTORE_COLLECTION_PREFIX=
ARG VITE_ENABLE_MARKETPLACE=false

ENV VITE_APP_URL=$VITE_APP_URL
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_FIREBASE_AUTH_DOMAIN=$VITE_FIREBASE_AUTH_DOMAIN
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_STORAGE_BUCKET=$VITE_FIREBASE_STORAGE_BUCKET
ENV VITE_FIREBASE_MESSAGING_SENDER_ID=$VITE_FIREBASE_MESSAGING_SENDER_ID
ENV VITE_FIREBASE_APP_ID=$VITE_FIREBASE_APP_ID
ENV VITE_FIREBASE_MEASUREMENT_ID=$VITE_FIREBASE_MEASUREMENT_ID
ENV VITE_FIREBASE_DATABASE_ID=$VITE_FIREBASE_DATABASE_ID
ENV VITE_FIRESTORE_COLLECTION_PREFIX=$VITE_FIRESTORE_COLLECTION_PREFIX
ENV VITE_ENABLE_MARKETPLACE=$VITE_ENABLE_MARKETPLACE

RUN npm run build
RUN npx esbuild server.ts --bundle --platform=node --packages=external --format=esm --outfile=dist-server/server.mjs

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080
ENV ENABLE_MARKETPLACE=false
ENV ENABLE_GEMINI_AI=false
ENV VITE_FIREBASE_DATABASE_ID=two-r-creations-db

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --legacy-peer-deps && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server/server.mjs ./dist-server/server.mjs

RUN chown -R node:node /app
USER node

EXPOSE 8080
CMD ["node", "dist-server/server.mjs"]
