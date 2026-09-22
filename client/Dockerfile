# Publishable Stripe keys are public by design, so the build-arg check doesn't apply
# check=skip=SecretsUsedInArgOrEnv
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
RUN npm ci --workspace client
COPY client ./client
# Vite inlines these at build time, so they are build args, not runtime env
ARG VITE_API_URL=""
ARG VITE_STRIPE_PUBLISHABLE_KEY=""
RUN npm run build --workspace client

FROM nginx:1.29-alpine
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
