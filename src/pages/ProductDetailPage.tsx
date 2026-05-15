import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { getItemById } from "../services/itemService";
import type { Item } from "../types/item.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductDetailPage.css";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const API_URL = import.meta.env.VITE_API_URL;

  const { addToCart } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleAddToCart() {
    if (!item) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    addToCart(item);
  }

  useEffect(() => {
    async function loadItem() {
      if (!id) {
        setError("Product not found.");
        setLoading(false);
        return;
      }

      try {
        const data = await getItemById(Number(id));
        setItem(data);
      } catch (error) {
        console.error(error);
        setError("We couldn't load this product.");
      } finally {
        setLoading(false);
      }
    }

    loadItem();
  }, [id]);

  if (loading) {
    return (
      <main className="product-detail-page">
        <p className="product-detail-message" aria-live="polite">Loading product...</p>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="product-detail-page">
        <p className="product-detail-message product-detail-message--error" role="alert">
          {error || "Product not found."}
        </p>
        <Link to="/products" className="product-detail-back">
          Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="product-detail-page">
      <Link to="/products" className="product-detail-back">
        ← Back to products
      </Link>

      <section className="product-detail">
        <motion.div
          className="product-detail__image-wrapper"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          {item.imageUrl ? (
            <img
              src={`${API_URL}${item.imageUrl}`}
              alt={item.name}
              className="product-detail__image"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="product-detail__placeholder">🥣</div>
          )}

          {item.isNew && <span className="product-detail__badge">New</span>}
        </motion.div>

        <motion.div
          className="product-detail__content"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
        >
          <span className="product-detail__eyebrow">Cozy Bites menu</span>

          <h1>{item.name}</h1>

          <p className="product-detail__description">{item.description}</p>

          <div className="product-detail__meta">
            <div>
              <span>Price</span>
              <strong>{item.price.toFixed(2)} €</strong>
            </div>

            <div>
              <span>Released</span>
              <strong>{item.releaseDate}</strong>
            </div>
          </div>

          <button
            type="button"
            className="product-detail__button"
            aria-label={`Add ${item.name} to cart`}
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
        </motion.div>
      </section>
    </main>
  );
}