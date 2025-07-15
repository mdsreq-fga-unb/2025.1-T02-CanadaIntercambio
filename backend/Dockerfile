FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build da aplicação TypeScript
RUN npm run build

# Gerar o Prisma Client
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "start"]
