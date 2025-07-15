import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import { AppRoutes } from "./src/routes/index";

const app = express();
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());

// Usar rotas modularizadas
const appRoutes = new AppRoutes(prisma);
app.use("/api", appRoutes.getRouter());

// Rota básica de teste
app.get("/ping", (req, res) => {
  res.send("pong");
});

// Rota de status do sistema
app.get("/", async (req, res) => {
  try {
    // Testar conexão com o banco
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
      error: "Database connection failed",
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
