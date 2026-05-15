import { createContext, useContext, useState } from "react";
import { login as loginRequest, logout as logoutRequest } from "../services/authService";
import type { JwtResponse, LoginRequest, Role } from "../types/auth.types";

interface AuthContextValue {
  token: string | null;
  customerId: number | null;
  email: string | null;
  roles: Role[];
  login: (credentials: LoginRequest) => Promise<JwtResponse>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: Role) => boolean;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const [customerId, setCustomerId] = useState<number | null>(() => {
    const storedCustomerId = localStorage.getItem("customerId");
    return storedCustomerId ? Number(storedCustomerId) : null;
  });

  const [email, setEmail] = useState<string | null>(localStorage.getItem("email"));

  const [roles, setRoles] = useState<Role[]>(() => {
    const storedRoles = localStorage.getItem("roles");
    return storedRoles ? JSON.parse(storedRoles) : [];
  });

  async function login(credentials: LoginRequest): Promise<JwtResponse> {
    const data = await loginRequest(credentials);

    localStorage.setItem("token", data.token);
    localStorage.setItem("customerId", String(data.customerId));
    localStorage.setItem("email", data.email);
    localStorage.setItem("roles", JSON.stringify(data.roles));

    setToken(data.token);
    setCustomerId(data.customerId);
    setEmail(data.email);
    setRoles(data.roles);

    return data;
  }

  function logout(): void {
    logoutRequest();

    localStorage.removeItem("customerId");

    setToken(null);
    setCustomerId(null);
    setEmail(null);
    setRoles([]);
  }

  const isAuthenticated = Boolean(token);

  function hasRole(role: Role): boolean {
    return roles.includes(role);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        customerId,
        email,
        roles,
        login,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}