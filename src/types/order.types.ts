import type { Item } from "./item.types";

export interface OrderInDto {
  orderDate: string;
  totalPrice: number;
  customerId: number;
  itemId: number;
}

export interface CustomerOrderDto {
  id: number;
  name: string;
  email: string;
}

export interface OrderOutDto {
  id: number;
  orderDate: string;
  totalPrice: number;
  customer: CustomerOrderDto;
  item: Item;
}