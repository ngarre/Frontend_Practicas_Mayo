export type Role = "ROLE_USER" | "ROLE_ADMIN";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  age: number;
  advertising: boolean;
}

export interface JwtResponse {
  token: string;
  customerId: number;
  email: string;
  roles: Role[];
}