FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Gerar o Prisma Client
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
