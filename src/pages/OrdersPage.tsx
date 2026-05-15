import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getOrders } from "../services/orderService";
import type { OrderOutDto } from "../types/order.types";
import "./ProtectedPages.css";

export default function OrdersPage() {
  const { email, customerId } = useAuth();

  const [orders, setOrders] = useState<OrderOutDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();

        const userOrders = data.filter(
          (order) => order.customer?.id === customerId
        );

        setOrders(userOrders);
      } catch (error) {
        console.error(error);
        setError("We couldn't load your orders.");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [customerId]);

  return (
    <main className="protected-page">
      <div className="orders-floating orders-floating--one">🧾</div>
      <div className="orders-floating orders-floating--two">🥗</div>
      <div className="orders-floating orders-floating--three">📦</div>
      <div className="orders-floating orders-floating--four">✨</div>
      
      <section className="protected-card">
        <div className="protected-card__eyebrow">Private area</div>
        <h1>My orders</h1>
        <p>Signed in as: {email}</p>
      </section>

      {loading && <p className="orders-message">Loading your orders...</p>}

      {error && <p className="orders-message orders-message--error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <section className="orders-empty">
          <div className="orders-empty__icon">🧾</div>
          <h2>No orders yet</h2>
          <p>Your cozy healthy orders will appear here once you place them.</p>
        </section>
      )}

      {!loading && !error && orders.length > 0 && (
        <section className="orders-list">
          {orders.map((order) => (
            <article className="order-card" key={order.id}>
              <div>
                <span className="order-card__eyebrow">Order #{order.id}</span>
                <h2>{order.item?.name}</h2>
                <p>{order.item?.description}</p>
              </div>

              <div className="order-card__meta">
                <div>
                  <span>Date</span>
                  <strong>{order.orderDate}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>{order.totalPrice.toFixed(2)} €</strong>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}