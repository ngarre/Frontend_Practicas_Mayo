import { apiFetch } from "../api/apiFetch";
import type { Customer, CustomerProfileUpdateDto } from "../types/customer.types";

export function getCustomers(): Promise<Customer[]> {
  return apiFetch<Customer[]>("/customers");
}

export function deleteCustomer(customerId: number): Promise<void> {
  return apiFetch<void>(`/customers/${customerId}`, {
    method: "DELETE",
  });
}

export function getMyProfile(): Promise<Customer> {
  return apiFetch<Customer>("/customers/me");
}

export function updateMyProfile(
  profileData: CustomerProfileUpdateDto
): Promise<Customer> {
  return apiFetch<Customer>("/customers/me", {
    method: "PUT",
    body: JSON.stringify(profileData),
  });
}

export function deleteMyProfile(): Promise<void> {
  return apiFetch<void>("/customers/me", {
    method: "DELETE",
  });
}