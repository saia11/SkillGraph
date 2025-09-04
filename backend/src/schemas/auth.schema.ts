// Authentication Request/Response Schemas

export interface CreateUserRequest {
  id?: string;
  email: string;
  password: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  role?: 'admin' | 'member' | 'guest';
}