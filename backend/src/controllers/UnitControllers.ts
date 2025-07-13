import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export class UnitController {
  constructor(private prisma: PrismaClient) {}

  async getAllUnits(req: Request, res: Response) {
    try {
      const units = await this.prisma.unit.findMany({
        select: {
          id: true,
          name: true,
        },
      });
      res.status(200).json({ success: true, data: units });
    } catch (error) {
      console.error("Erro ao buscar unidades:", error);
      res
        .status(500)
        .json({ success: false, message: "Erro ao buscar unidades" });
    }
  }
}
