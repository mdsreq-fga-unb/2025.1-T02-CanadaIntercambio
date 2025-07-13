import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ProfileService } from '../services/ProfileService';

interface AuthenticatedRequest extends Request {
  user?: {
    userId: number;
    userType: 'visitante' | 'intercambista' | 'admin';
  };
}

export class ProfileController {
  private profileService: ProfileService;

  constructor(prisma: PrismaClient) {
    this.profileService = new ProfileService(prisma);
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const profile = await this.profileService.getProfile(userId);
      res.status(200).json({ success: true, data: profile });
    } catch (err) {
      res.status(404).json({ success: false, message: (err as Error).message });
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.userId;
      const userType = req.user!.userType;
      const updatedProfile = await this.profileService.updateProfile(userId, userType, req.body);
      res.status(200).json({ success: true, message: 'Perfil atualizado com sucesso', data: updatedProfile });
    } catch (err) {
      res.status(400).json({ success: false, message: (err as Error).message });
    }
  }
}
