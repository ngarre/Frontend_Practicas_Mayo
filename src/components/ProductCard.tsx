import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import type { Item } from "../types/item.types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "./ProductCard.css";

interface ProductCardProps {
  item: Item;
  index?: number;
}

export default function ProductCard({ item, index = 0 }: ProductCardProps) {
  const API_URL = import.meta.env.VITE_API_URL;

  const { addToCart } = useCart();

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleAddToCart() {
    if (!isAuthenticated) {
      navigate("/login", {
        state: { from: location.pathname },
      });
      return;
    }

    addToCart(item);
  }

  return (
    <motion.article
      className="product-card"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.45,
        delay: index * 0.08,
        ease: "easeOut",
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
    >
      <Link to={`/products/${item.id}`} className="product-card__image-link">
        <div className="product-card__image-wrapper">
          {item.imageUrl ? (
            <img
              className="product-card__image"
              src={`${API_URL}${item.imageUrl}`}
              alt={item.name}
            />
          ) : (
            <div className="product-card__placeholder">🥣</div>
          )}

          {item.isNew && <span className="product-card__badge">New</span>}
        </div>
      </Link>

      <div className="product-card__body">
        <div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>

        <div className="product-card__footer">
          <span className="product-card__price">
            {item.price.toFixed(2)} €
          </span>

          <div className="product-card__actions">
            <Link to={`/products/${item.id}`} className="product-card__details">
              View details
            </Link>

            <button type="button" onClick={handleAddToCart}>
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}