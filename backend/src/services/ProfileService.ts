import { PrismaClient, Prisma } from "@prisma/client";
import { AuthService } from "./AuthService"; // ajuste o caminho se necessário
import { UserRepository } from "../repositories/UserRepository";

export class ProfileService {
  private prisma: PrismaClient;
  private userRepository: UserRepository;
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.userRepository = new UserRepository(prisma);
    this.authService = new AuthService(prisma);
  }

  async updateProfile(
    userId: number,
    userType: "visitante" | "intercambista" | "admin",
    data: any
  ) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("Usuário não encontrado");

    const oldEmail = user.email;

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        city: data.city,
        phone: data.phone,
        nearestUnitId: data.nearestUnitId,
        email: data.email ?? user.email,
        ...(data.password && {
          passwordHash: await this.hashPassword(data.password),
        }),
      },
    });

    const updatedProfile = await this.getProfile(userId);
    const newUserType = this.userRepository.getUserType(updatedProfile);

    let newToken: string | undefined;
    if (oldEmail !== updatedUser.email || userType !== newUserType) {
      if (!newUserType) throw new Error("Tipo de usuário não identificado");
      newToken = this.authService["generateToken"]({
        userId: updatedUser.id,
        email: updatedUser.email,
        userType: newUserType,
      });
    }

    return { user: updatedProfile, token: newToken };
  }

  private async hashPassword(password: string): Promise<string> {
    const bcrypt = await import("bcryptjs");
    return bcrypt.hash(password, 10);
  }

  async getProfile(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { visitante: true, intercambista: true, admin: true },
    });
  }
}
