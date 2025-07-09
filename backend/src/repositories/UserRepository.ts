import { PrismaClient, User } from '@prisma/client';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        visitante: true,
        intercambista: true,
        admin: true,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        visitante: true,
        intercambista: true,
        admin: true,
      },
    });
  }

  async create(userData: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    phone?: string;
    city?: string;
    nearestUnit?: string;
  }): Promise<User> {
    return await this.prisma.user.create({
      data: userData,
    });
  }

  async createVisitante(userId: number): Promise<void> {
    await this.prisma.visitante.create({
      data: {
        userId,
      },
    });
  }

  async createIntercambista(userId: number, data?: {
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  }): Promise<void> {
    await this.prisma.intercambista.create({
      data: {
        userId,
        emergencyContactName: data?.emergencyContactName,
        emergencyContactPhone: data?.emergencyContactPhone,
      },
    });
  }

  async createAdmin(userId: number, internalRole: string): Promise<void> {
    await this.prisma.admin.create({
      data: {
        userId,
        internalRole,
      },
    });
  }

  getUserType(user: any): 'visitante' | 'intercambista' | 'admin' | null {
    if (user.admin) return 'admin';
    if (user.intercambista) return 'intercambista';
    if (user.visitante) return 'visitante';
    return null;
  }
}
