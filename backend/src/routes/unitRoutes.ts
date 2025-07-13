import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { UnitController } from "../controllers/UnitControllers";

export class UnitRoutes {
  private router: Router;
  private unitController: UnitController;

  constructor(prisma: PrismaClient) {
    this.router = Router();
    this.unitController = new UnitController(prisma);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Lista pública de unidades
    this.router.get("/", (req, res) =>
      this.unitController.getAllUnits(req, res)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
