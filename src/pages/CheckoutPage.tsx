import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService.ts";
import { useAuth } from "../context/AuthContext";
import "./CheckoutPage.css";

interface CheckoutForm {
  fullName: string;
  address: string;
  city: string;
  phone: string;
  notes: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, totalItems, totalPrice, clearCart } = useCart();
  const { customerId } = useAuth();

  const [formData, setFormData] = useState<CheckoutForm>({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    notes: "",
  });

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    if (!customerId) {
      setLoading(false);
      return;
    }

    try {
      const today = new Date().toISOString().split("T")[0];

      await Promise.all(
        cartItems.map((cartItem) =>
          createOrder({
            orderDate: today,
            totalPrice: cartItem.item.price * cartItem.quantity,
            customerId,
            itemId: cartItem.item.id,
          })
        )
      );

      clearCart();
      setSuccessMessage("Your order has been placed successfully!");

      setTimeout(() => {
        navigate("/");
      }, 1400);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0 && !successMessage) {
    return (
      <main className="checkout-page">
        <section className="checkout-empty">
          <div className="checkout-empty__icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>Add some healthy bites before continuing to checkout.</p>
          <Link to="/products" className="checkout-empty__button">
            Browse products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <section className="checkout-header">
        <span className="checkout-header__eyebrow">Checkout</span>
        <h1>Almost ready to enjoy</h1>
        <p>
          Review your order and add your delivery details. This checkout is a
          frontend simulation for now.
        </p>
      </section>

      {successMessage ? (
        <section className="checkout-success">
          <div className="checkout-success__icon">✨</div>
          <h2>{successMessage}</h2>
          <p>Redirecting you back home...</p>
        </section>
      ) : (
        <section className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h2>Delivery details</h2>

            <div className="checkout-form__field">
              <label htmlFor="fullName">Full name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Jason Heathybites"
                required
              />
            </div>

            <div className="checkout-form__field">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street, number, floor..."
                required
              />
            </div>

            <div className="checkout-form__field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                placeholder="Your city"
                required
              />
            </div>

            <div className="checkout-form__field">
              <label htmlFor="phone">Phone</label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                placeholder="600123123"
                required
              />
            </div>

            <div className="checkout-form__field">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any allergies, delivery notes or preferences?"
                rows={4}
              />
            </div>

            <button
              type="submit"
              className="checkout-form__button"
              disabled={loading}
            >
              {loading ? "Placing order..." : "Place order"}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Order summary</h2>

            <div className="checkout-summary__items">
              {cartItems.map((cartItem) => (
                <div className="checkout-summary__item" key={cartItem.item.id}>
                  <span>
                    {cartItem.quantity} × {cartItem.item.name}
                  </span>
                  <strong>
                    {(cartItem.item.price * cartItem.quantity).toFixed(2)} €
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary__row">
              <span>Items</span>
              <strong>{totalItems}</strong>
            </div>

            <div className="checkout-summary__row checkout-summary__row--total">
              <span>Total</span>
              <strong>{totalPrice.toFixed(2)} €</strong>
            </div>
          </aside>
        </section>
      )}
    </main>
  );
}