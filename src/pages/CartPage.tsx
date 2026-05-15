import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const {
    cartItems,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const API_URL = import.meta.env.VITE_API_URL;

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-floating cart-floating--one">💸</div>
        <div className="cart-floating cart-floating--two">🧾</div>
        <div className="cart-floating cart-floating--three">💳</div>

        <section className="cart-empty">
          <div className="cart-empty__icon">🧺</div>
          <h1>Your cart is empty</h1>
          <p>Add some cozy healthy bites and come back here to review your order.</p>
          <Link to="/products" className="cart-empty__button">
            Browse products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="cart-floating cart-floating--one">💸</div>
      <div className="cart-floating cart-floating--two">🧾</div>
      <div className="cart-floating cart-floating--three">💳</div>

      <section className="cart-header">
        <span className="cart-header__eyebrow">Your basket</span>
        <h1>Review your healthy picks</h1>
        <p>
          You have {totalItems} {totalItems === 1 ? "item" : "items"} ready to
          enjoy.
        </p>
      </section>

      <section className="cart-layout">
        <div className="cart-list">
          {cartItems.map((cartItem) => (
            <article className="cart-item" key={cartItem.item.id}>
              <div className="cart-item__image-wrapper">
                {cartItem.item.imageUrl ? (
                  <img
                    src={`${API_URL}${cartItem.item.imageUrl}`}
                    alt={cartItem.item.name}
                    className="cart-item__image"
                  />
                ) : (
                  <div className="cart-item__placeholder">🥣</div>
                )}
              </div>

              <div className="cart-item__info">
                <h2>{cartItem.item.name}</h2>
                <p>{cartItem.item.description}</p>
                <strong>{cartItem.item.price.toFixed(2)} €</strong>
              </div>

              <div className="cart-item__actions">
                <div className="cart-item__quantity">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(cartItem.item.id)}
                  >
                    −
                  </button>

                  <span>{cartItem.quantity}</span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(cartItem.item.id)}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="cart-item__remove"
                  onClick={() => removeFromCart(cartItem.item.id)}
                >
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Order summary</h2>

          <div className="cart-summary__row">
            <span>Items</span>
            <strong>{totalItems}</strong>
          </div>

          <div className="cart-summary__row">
            <span>Total</span>
            <strong>{totalPrice.toFixed(2)} €</strong>
          </div>

          <Link to="/checkout" className="cart-summary__checkout">
            Continue to checkout
          </Link>

          <button
            type="button"
            className="cart-summary__clear"
            onClick={clearCart}
          >
            Clear cart
          </button>
        </aside>
      </section>
    </main>
  );
}