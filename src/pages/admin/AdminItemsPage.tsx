import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteItem, getItems } from "../../services/itemService";
import type { Item } from "../../types/item.types";
import "../ProtectedPages.css";
import "./AdminItemsPage.css";

export default function AdminItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  type SortField = "name" | "price" | "releaseDate";
  type SortDirection = "asc" | "desc";

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [newOnly, setNewOnly] = useState<boolean>(false);
  const [sortField, setSortField] = useState<SortField>("releaseDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const API_URL = import.meta.env.VITE_API_URL;

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

  async function handleDelete(itemId: number) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteItem(itemId);
      setItems((currentItems) =>
        currentItems.filter((item) => item.id !== itemId)
      );
    } catch (error) {
      console.error(error);
      setError("We couldn't delete this product.");
    }
  }

  const totalProducts = items.length;

  const newProducts = items.filter((item) => item.isNew).length;

  const averagePrice =
    items.length > 0
      ? items.reduce((total, item) => total + item.price, 0) / items.length
      : 0;

  const latestReleaseDate = items.length
    ? [...items].sort(
      (a, b) =>
        new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
    )[0].releaseDate
    : "-";

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
    <main className="protected-page">
      <section className="protected-card">
        <div className="protected-card__eyebrow">Admin area</div>
        <h1>Product management</h1>
        <p>
          Create, edit and manage Cozy Bites products, including their images.
        </p>

        <Link to="/admin/items/new" className="protected-card__button">
          Create product
        </Link>
      </section>

      {!loading && !error && items.length > 0 && (
        <>
          <section className="admin-products-summary">
            <article>
              <span>Total products</span>
              <strong>{totalProducts}</strong>
            </article>

            <article>
              <span>New products</span>
              <strong>{newProducts}</strong>
            </article>

            <article>
              <span>Average price</span>
              <strong>{averagePrice.toFixed(2)} €</strong>
            </article>

            <article>
              <span>Latest release</span>
              <strong>{latestReleaseDate}</strong>
            </article>
          </section>

          <section className="admin-products-controls">
            <div className="admin-products-control">
              <label htmlFor="productSearch">Search</label>
              <input
                id="productSearch"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by name or description..."
              />
            </div>

            <div className="admin-products-control">
              <label htmlFor="sortField">Sort by</label>
              <select
                id="sortField"
                value={sortField}
                onChange={(event) =>
                  setSortField(event.target.value as SortField)
                }
              >
                <option value="releaseDate">Release date</option>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
            </div>

            <div className="admin-products-control">
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

            <label className="admin-products-checkbox" htmlFor="newOnly">
              <input
                id="newOnly"
                type="checkbox"
                checked={newOnly}
                onChange={(event) => setNewOnly(event.target.checked)}
              />
              <span>New products only</span>
            </label>
          </section>
        </>
      )}

      {loading && (
        <p className="admin-items-message" aria-live="polite">
          Loading products...
        </p>
      )}

      {error && (
        <p className="admin-items-message admin-items-message--error"
          role="alert"
        >
          {error}
        </p>
      )}

      {!loading && !error && filteredItems.length === 0 && (
        <section className="admin-items-empty">
          <div className="admin-items-empty__icon">🔎</div>
          <h2>No matching products</h2>
          <p>Try changing your search, filters or sorting options.</p>
        </section>
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <section className="admin-items-grid">
          {filteredItems.map((item) => (
            <article className="admin-product-card" key={item.id}>
              <div className="admin-product-card__image-wrapper">
                {item.imageUrl ? (
                  <img
                    src={`${API_URL}${item.imageUrl}`}
                    alt={item.name}
                    className="admin-product-card__image"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="admin-product-card__placeholder">🥗</div>
                )}

                {item.isNew && (
                  <span className="admin-product-card__badge">New</span>
                )}
              </div>

              <div className="admin-product-card__body">
                <span className="admin-product-card__id">#{item.id}</span>

                <h2>{item.name}</h2>
                <p>{item.description}</p>

                <div className="admin-product-card__footer">
                  <strong>{item.price.toFixed(2)} €</strong>

                  <div className="admin-product-card__actions">
                    <Link
                      to={`/admin/items/${item.id}/edit`}
                      className="admin-product-card__button admin-product-card__button--edit"
                      aria-label={`Edit product ${item.name}`}
                    >
                      Edit
                    </Link>

                    <button
                      type="button"
                      className="admin-product-card__button admin-product-card__button--delete"
                      aria-label={`Delete product ${item.name}`}
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}