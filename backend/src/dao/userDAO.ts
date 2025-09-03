import { Service, Container } from 'typedi';
import { User } from '@/dto';
import { CreateUserRequest } from '@/schemas';
import PrismaClientSingleton from '@/db/prisma';

@Service()
class UserDAO {

  constructor(private readonly prismaClient: PrismaClientSingleton) {
    this.prismaClient = Container.get(PrismaClientSingleton);
  }

  async create(userData: CreateUserRequest & { passwordHash: string }): Promise<User> {
    const { id, email, name, bio, avatarUrl, role, passwordHash } = userData;
    
    const user = await this.prismaClient.prisma.user.create({
      data: {
        id,
        email,
        passwordHash,
        name,
        bio,
        avatarUrl,
        role,
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
      avatarUrl: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } as User;
  }

  async findById(id: string): Promise<User> {
    const user = await this.prismaClient.prisma.user.findUnique({
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

    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.prismaClient.prisma.user.findUnique({
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

    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async update(
    id: string,
    updates: Partial<Pick<User, 'name' | 'bio' | 'avatarUrl'>>
  ): Promise<User> {
    const user = await this.prismaClient.prisma.user.update({
      where: { id },
      data: {
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.bio !== undefined && { bio: updates.bio }),
        ...(updates.avatarUrl !== undefined && { avatarUrl: updates.avatarUrl }),
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
      avatarUrl: user.avatarUrl,
      role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updatePassword(id: string, newPasswordHash: string): Promise<void> {
    await this.prismaClient.prisma.user.update({
      where: { id },
      data: { passwordHash: newPasswordHash },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prismaClient.prisma.user.delete({
      where: { id },
    });
  }

  async findMany(
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prismaClient.prisma.user.findMany({
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
      this.prismaClient.prisma.user.count(),
    ]);

    return {
      users: users.map((user: User) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      total,
    };
  }

  async search(
    searchTerm: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const where = {
      OR: [
        { name: { contains: searchTerm, mode: 'insensitive' as const } },
        { email: { contains: searchTerm, mode: 'insensitive' as const } },
      ],
    };

    const [users, total] = await Promise.all([
      this.prismaClient.prisma.user.findMany({
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
      this.prismaClient.prisma.user.count({ where }),
    ]);

    return {
      users: users.map((user: User) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        role: user.role.toLowerCase() as 'admin' | 'member' | 'guest',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      })),
      total,
    };
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const count = await this.prismaClient.prisma.user.count({
      where: { email },
    });
    return count > 0;
  }

  async getPasswordHash(id: string): Promise<string | null> {
    const user = await this.prismaClient.prisma.user.findUnique({
      where: { id },
      select: { passwordHash: true },
    });
    return user?.passwordHash || null;
  }
}

export default UserDAO;