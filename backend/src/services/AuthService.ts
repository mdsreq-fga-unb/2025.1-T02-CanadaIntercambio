import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "../repositories/UserRepository";
import {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  JwtPayload,
} from "../types/auth";

export class AuthService {
  private userRepository: UserRepository;
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.userRepository = new UserRepository(prisma);
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("E-mail já está em uso");
    }

    // Validar campos obrigatórios
    if (!data.firstName || !data.lastName || !data.email || !data.password) {
      throw new Error("Campos obrigatórios não preenchidos");
    }

    // Validar formato do e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error("Formato de e-mail inválido");
    }

    // Validar senha (mínimo 6 caracteres)
    if (data.password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }

    // Validar tipo de usuário
    if (!["visitante", "intercambista", "admin"].includes(data.userType)) {
      throw new Error("Tipo de usuário inválido");
    }

    // Validar campos específicos do admin
    if (data.userType === "admin" && !data.internalRole) {
      throw new Error("Campo internalRole é obrigatório para administradores");
    }

    // Hash da senha
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    try {
      // Usar transação para garantir consistência
      const result = await this.prisma.$transaction(async (prisma) => {
        // Criar usuário
        const user = await this.userRepository.create({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          passwordHash,
          phone: data.phone,
          city: data.city,
          nearestUnitId: data.nearestUnitId,
        });

        // Criar registro específico do tipo de usuário
        switch (data.userType) {
          case "visitante":
            await this.userRepository.createVisitante(user.id);
            break;
          case "intercambista":
            await this.userRepository.createIntercambista(user.id, {
              emergencyContactName: data.emergencyContactName,
              emergencyContactPhone: data.emergencyContactPhone,
            });
            break;
          case "admin":
            await this.userRepository.createAdmin(user.id, data.internalRole!);
            break;
        }

        return user;
      });

      // Gerar token JWT
      const token = this.generateToken({
        userId: result.id,
        email: result.email,
        userType: data.userType,
      });

      return {
        user: {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          email: result.email,
          userType: data.userType,
        },
        token,
      };
    } catch (error) {
      throw new Error("Erro ao criar usuário: " + (error as Error).message);
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    // Validar campos obrigatórios
    if (!data.email || !data.password) {
      throw new Error("E-mail e senha são obrigatórios");
    }

    // Buscar usuário
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Credenciais inválidas");
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(
      data.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas");
    }

    // Determinar tipo de usuário
    const userType = this.userRepository.getUserType(user);
    if (!userType) {
      throw new Error("Tipo de usuário não encontrado");
    }

    // Gerar token JWT
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      userType,
    });

    return {
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType,
      },
      token,
    };
  }

  private generateToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não está configurado");
    }

    return jwt.sign(
      {
        userId: payload.userId,
        email: payload.email,
        userType: payload.userType,
      },
      secret,
      { expiresIn: "7d" }
    );
  }

  async verifyToken(token: string): Promise<JwtPayload> {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET não está configurado");
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      return decoded;
    } catch (error) {
      throw new Error("Token inválido");
    }
  }
}
