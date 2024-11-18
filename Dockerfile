ARG node_version=20.9.0
ARG node_image=node:${node_version}-alpine3.18

FROM $node_image as dependencies
WORKDIR /gift-list
COPY package.json package-lock.json ./
RUN npm ci

FROM $node_image as builder
WORKDIR /gift-list
COPY . .
COPY --from=dependencies /gift-list/node_modules ./node_modules
RUN npx prisma generate
RUN npm run build

FROM $node_image as runner
WORKDIR /gift-list
ENV NODE_ENV production

COPY --from=builder /gift-list/.next/standalone .
COPY --from=builder /gift-list/public ./public
COPY --from=builder /gift-list/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
