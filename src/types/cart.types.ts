import type { Item } from "./item.types";

export interface CartItem {
  item: Item;
  quantity: number;
}