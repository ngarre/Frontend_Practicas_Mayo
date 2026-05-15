import { apiFetch } from "../api/apiFetch";
import type { OrderInDto, OrderOutDto } from "../types/order.types.ts";

export function createOrder(orderData: OrderInDto): Promise<OrderOutDto> {
  return apiFetch<OrderOutDto>("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export function getOrders(): Promise<OrderOutDto[]> {
  return apiFetch<OrderOutDto[]>("/orders");
}