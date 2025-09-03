import { Service } from 'typedi';
import { User } from '@/dto';
import { CreateUserRequest } from '@/schemas';
import PrismaClientSingleton from '@/db/prisma';
import type { PrismaClient } from '../generated/prisma';

@Service()
export class UserDAO {
  private prisma: PrismaClient = PrismaClientSingleton.getInstance();

  async create(userData: CreateUserRequest & { passwordHash: string }): Promise<Omit<User, 'password_hash'>> {
    const { email, passwordHash, name, bio } = userData;
    
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        bio,
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  async findById(id: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  async findByEmailWithPassword(email: string): Promise<(User & { password_hash: string }) | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      password_hash: user.passwordHash,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  async update(
    id: string,
    updates: Partial<Pick<User, 'name' | 'bio' | 'avatar_url'>>
  ): Promise<Omit<User, 'password_hash'> | null> {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.bio !== undefined && { bio: updates.bio }),
        ...(updates.avatar_url !== undefined && { avatarUrl: updates.avatar_url }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        avatarUrl: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatar_url: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  async findMany(
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: Omit<User, 'password_hash'>[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatarUrl,
        role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      })),
      total,
    };
  }

  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: Omit<User, 'password_hash'>[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        { email: { contains: searchTerm, mode: 'insensitive' as const } },
      ],
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          bio: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatar_url: user.avatarUrl,
        role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
        created_at: user.createdAt,
        updated_at: user.updatedAt,
      })),
      total,
    };
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async getPasswordHash(id: string): Promise<string | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true },
    });
    return user?.passwordHash || null;
  }
}