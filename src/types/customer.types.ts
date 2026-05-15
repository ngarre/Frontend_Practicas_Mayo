export type CustomerRole = "ROLE_USER" | "ROLE_ADMIN" | "USER" | "ADMIN";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: CustomerRole;
  age: number;
  advertising: boolean;
  registrationDate: string;
  profileImageUrl?: string;
}

export interface CustomerProfileUpdateDto {
  name: string;
  phone?: string;
  age: number;
  advertising: boolean;
  profileImageUrl?: string;
}