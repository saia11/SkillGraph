// User Data Transfer Objects

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  role: 'admin' | 'member' | 'guest';
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface UserProfile extends Omit<User, 'createdAt' | 'updatedAt'> {
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: Omit<User, 'password_hash'>;
  token: string;
  refreshToken: string;
}

export interface JWTPayload {
  user_id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}
