// Authentication Request/Response Schemas

export interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface UpdateUserProfileRequest {
  name?: string;
  bio?: string;
  avatar_url?: string;
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
