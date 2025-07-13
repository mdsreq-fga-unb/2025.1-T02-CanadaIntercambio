import { Request, Response } from 'express';

export class TestController {
  async publicRoute(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Esta é uma rota pública',
      timestamp: new Date().toISOString(),
    });
  }

  async authenticatedRoute(req: Request, res: Response): Promise<void> {
    const authReq = req as any;
    res.json({
      success: true,
      message: 'Esta é uma rota autenticada',
      user: authReq.user,
      timestamp: new Date().toISOString(),
    });
  }

  async adminOnlyRoute(req: Request, res: Response): Promise<void> {
    const authReq = req as any;
    res.json({
      success: true,
      message: 'Esta é uma rota apenas para administradores',
      user: authReq.user,
      timestamp: new Date().toISOString(),
    });
  }

  async intercambistaOrAdminRoute(req: Request, res: Response): Promise<void> {
    const authReq = req as any;
    res.json({
      success: true,
      message: 'Esta é uma rota para intercambistas ou administradores',
      user: authReq.user,
      timestamp: new Date().toISOString(),
    });
  }
}
