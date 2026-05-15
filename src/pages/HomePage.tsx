import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard.tsx";
import { getItems } from "../services/itemService";
import type { Item } from "../types/item.types";
import { motion } from "motion/react";
import "./HomePage.css";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await getItems();

        const shuffledItems = [...data].sort(() => Math.random() - 0.5);
        const featuredItems = shuffledItems.slice(0, 3);

        setItems(featuredItems);
      } catch (error) {
        console.error(error);
        setError("No se han podido cargar los productos.");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  return (
    <main>
      <div className="home-floating home-floating--one">🌿</div>
      <div className="home-floating home-floating--two">✨</div>
      <div className="home-floating home-floating--three">🥑</div>

      <section className="hero">
        <div className="page hero__content">
          <motion.div
            className="hero__text"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            <span className="hero__eyebrow">Healthy food · Cozy mood</span>

            <h1>Healthy food to nourish beautifully</h1>

            <p>
              Bowls, snacks and fresh plates crafted to help you eat well,
              feel good and enjoy a cozy experience right from home.
            </p>

            <div className="hero__actions">
              <a href="#catalog" className="hero__button hero__button--primary">
                Browse menu
              </a>

              <a href="/register" className="hero__button hero__button--secondary">
                Create account
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero__card"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: "easeOut" }}
          >
            <img
              src="/images/branding/cozy-bites-logo-square-transparent.png"
              alt="Cozy Bites logo"
              className="hero__logo"
            />
            <p>Fresh bowls, smoothies & mindful bites</p>
          </motion.div>
        </div>
      </section>

      <section id="catalog" className="page catalog">
        <div className="catalog__header">
          <div>
            <h2 className="section-title">Our favorites</h2>
            <p className="section-subtitle">
              A small selection of healthy bites loaded from our menu. Discover more fresh
              bowls, snacks and smoothies in the full catalog 💚
            </p>
          </div>
        </div>

        {loading && <p className="catalog__message">Loading dishes...</p>}

        {error && (
          <p className="catalog__message catalog__message--error">{error}</p>
        )}

        {!loading && !error && (
          <div className="catalog__grid">
            
          </div>
        )}
        {!loading && !error && (
          <div className="catalog__actions">
            <a href="/products" className="catalog__button">
              View all products
            </a>
          </div>
        )}
      </section>
    </main>
  );
}