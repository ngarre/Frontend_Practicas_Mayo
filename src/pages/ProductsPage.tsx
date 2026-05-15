import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getItems } from "../services/itemService";
import type { Item } from "../types/item.types";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  type SortField = "name" | "price" | "releaseDate";
  type SortDirection = "asc" | "desc";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("releaseDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  useEffect(() => {
    async function loadItems() {
      try {
        const data = await getItems();
        setItems(data);
      } catch (error) {
        console.error(error);
        setError("We couldn't load the products.");
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);


  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return items
      .filter((item) => {
        const matchesSearch =
          item.name.toLowerCase().includes(normalizedSearch) ||
          item.description.toLowerCase().includes(normalizedSearch);

        const matchesNew = !newOnly || item.isNew;

        return matchesSearch && matchesNew;
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;

        if (sortField === "price") {
          return (a.price - b.price) * direction;
        }

        if (sortField === "releaseDate") {
          return (
            (new Date(a.releaseDate).getTime() -
              new Date(b.releaseDate).getTime()) *
            direction
          );
        }

        return a.name.localeCompare(b.name) * direction;
      });
  }, [items, searchTerm, newOnly, sortField, sortDirection]);

  return (
    <main className="products-page">
      <div className="products-floating products-floating--one">🥑</div>
      <div className="products-floating products-floating--two">🍓</div>
      <div className="products-floating products-floating--three">🥗</div>
      <div className="products-floating products-floating--four">🍋</div>

      <section className="products-page__header">
        <span className="products-page__eyebrow">Full menu</span>
        <h1>All healthy bites</h1>
        <p>
          Explore all our bowls, snacks and fresh plates made to keep your day
          balanced, cozy and delicious.
        </p>
      </section>

      {!loading && !error && items.length > 0 && (
        <section className="products-page__controls">
          <div className="products-page__control">
            <label htmlFor="productSearch">Search</label>
            <input
              id="productSearch"
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name or description..."
            />
          </div>

          <div className="products-page__control">
            <label htmlFor="sortField">Sort by</label>
            <select
              id="sortField"
              value={sortField}
              onChange={(event) => setSortField(event.target.value as SortField)}
            >
              <option value="releaseDate">Release date</option>
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>

          <div className="products-page__control">
            <label htmlFor="sortDirection">Direction</label>
            <select
              id="sortDirection"
              value={sortDirection}
              onChange={(event) =>
                setSortDirection(event.target.value as SortDirection)
              }
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>

          <label className="products-page__checkbox" htmlFor="newOnly">
            <input
              id="newOnly"
              type="checkbox"
              checked={newOnly}
              onChange={(event) => setNewOnly(event.target.checked)}
            />
            <span>New products only</span>
          </label>
        </section>
      )}

      {loading && <p className="products-page__message">Loading products...</p>}

      {error && (
        <p className="products-page__message products-page__message--error">
          {error}
        </p>
      )}

      {!loading && !error && filteredItems.length === 0 && (
        <section className="products-page__empty">
          <div className="products-page__empty-icon">🔎</div>
          <h2>No matching products</h2>
          <p>Try changing your search, filters or sorting options.</p>
        </section>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <section className="products-page__grid">
          {filteredItems.map((item, index) => (
            <ProductCard key={item.id} item={item} index={index} />
          ))}
        </section>
      )}
    </main>
  );
}