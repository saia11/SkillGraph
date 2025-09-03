// User Data Transfer Objects

export interface User {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  role: 'admin' | 'member' | 'guest';
  created_at: Date;
  updated_at: Date;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface UserProfile extends Omit<User, 'created_at' | 'updated_at'> {
  created_at: string;
  updated_at: string;
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
