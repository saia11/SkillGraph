import { Service, Container } from 'typedi';
import { User } from '@/dto';
import { CreateUserRequest } from '@/schemas';
import { UserDAO } from '@/dao';
import * as admin from 'firebase-admin';
import Bcrypt from 'bcrypt';

@Service()
class UserService {

  constructor(private readonly userDAO: UserDAO) {
    this.userDAO = Container.get(UserDAO);
  }

  public async createUser(userId: string, userData: CreateUserRequest): Promise<User> {
    const { email } = userData;

    // Check if user already exists should be enought to check if user exists
    const emailExists = await this.userDAO.checkEmailExists(email);
    if (emailExists) {
      throw new Error('User with this email already exists');
    }

    try {
      return await this.userDAO.create(userId, userData);
    } catch (error) {
      throw new Error('Failed to create user');
    }


  }

  public async findById(id: string): Promise<User> {
    return await this.userDAO.findById(id);
  }

  public async findByEmail(email: string): Promise<User> {
    return await this.userDAO.findByEmail(email);
  }

  public async updateUser(
    id: string, 
    updates: Partial<Pick<User, 'name' | 'bio' | 'avatarUrl'>>
  ): Promise<User> {
    if (Object.keys(updates).length === 0) {
      throw new Error('No valid fields to update');
    }

    return await this.userDAO.update(id, updates);
  }

  public async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    
    const hashedCurrentPassword = await this.userDAO.getPasswordHash(id);
    const isValid = await Bcrypt.compare(currentPassword, hashedCurrentPassword);
    if (!isValid) {
      throw new Error('Current password is incorrect');
    }

    await admin.auth().updateUser(id, {
      password: newPassword,
    });

    const newPasswordHash = await Bcrypt.hash(newPassword, 10);
    await this.userDAO.updatePassword(id, newPasswordHash);
  }

  public async deleteUser(id: string): Promise<void> {
    await admin.auth().deleteUser(id);
    await this.userDAO.delete(id);
  }
}

export default UserService;