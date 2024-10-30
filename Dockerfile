FROM node:18 as dependencies
WORKDIR /gift-list
COPY package.json package-lock.json ./
RUN npm ci

FROM node:lts as builder
WORKDIR /gift-list
COPY . .
COPY --from=dependencies /gift-list/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

FROM node:lts as runner
WORKDIR /gift-list
ENV NODE_ENV production

COPY --from=builder /gift-list/.next/standalone .
COPY --from=builder /gift-list/public ./public
COPY --from=builder /gift-list/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
