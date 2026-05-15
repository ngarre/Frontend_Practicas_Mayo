import { apiFetch } from "../api/apiFetch.ts";
import type {
  JwtResponse,
  LoginRequest,
  RegisterRequest,
} from "../types/auth.types";

export function register(userData: RegisterRequest): Promise<string> {
  return apiFetch<string>("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
}

export function login(credentials: LoginRequest): Promise<JwtResponse> {
  return apiFetch<JwtResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function logout(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("roles");
}