import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm";
import { getItemById, updateItem } from "../../services/itemService";
import type { Item, ItemInDto } from "../../types/item.types";
import "../ProtectedPages.css";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  async function handleSubmit(itemData: ItemInDto): Promise<void> {
    if (!id) {
      return;
    }

    await updateItem(Number(id), itemData);
    navigate("/admin/items");
  }

  if (loading) {
    return (
      <main className="protected-page">
        <p className="admin-items-message">Loading product...</p>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="protected-page">
        <section className="protected-card">
          <div className="protected-card__eyebrow">Admin area</div>
          <h1>Product not found</h1>
          <p>{error || "We couldn't find this product."}</p>

          <Link to="/admin/items" className="protected-card__button">
            Back to products
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="protected-page">
      <section className="protected-card">
        <div className="protected-card__eyebrow">Admin area</div>
        <h1>Edit product</h1>
        <p>Update this product information and image.</p>

        <Link to="/admin/items" className="protected-card__button">
          Back to products
        </Link>
      </section>

      <ProductForm
        initialItem={item}
        submitLabel="Save changes"
        onSubmit={handleSubmit}
      />
    </main>
  );
}