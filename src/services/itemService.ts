import { apiFetch } from "../api/apiFetch";
import type { Item, ItemInDto } from "../types/item.types.ts";

export function getItems(): Promise<Item[]> {
  return apiFetch<Item[]>("/items");
}

export function getItemById(id: number): Promise<Item> {
  return apiFetch<Item>(`/items/${id}`);
}

export function createItem(itemData: ItemInDto): Promise<Item> {
  return apiFetch<Item>("/items", {
    method: "POST",
    body: JSON.stringify(itemData),
  });
}

export function updateItem(id: number, itemData: ItemInDto): Promise<Item> {
  return apiFetch<Item>(`/items/${id}`, {
    method: "PUT",
    body: JSON.stringify(itemData),
  });
}

export function deleteItem(id: number): Promise<void> {
  return apiFetch<void>(`/items/${id}`, {
    method: "DELETE",
  });
}