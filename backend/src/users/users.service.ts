import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        department: true,
        role: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async update(id: string, data: Record<string, unknown>) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });
    const { passwordHash: _, ...result } = user;
    return result;
  }

  async remove(id: string) {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
    return { success: true };
  }
}
