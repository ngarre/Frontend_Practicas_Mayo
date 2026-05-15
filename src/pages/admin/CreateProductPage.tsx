import { useNavigate } from "react-router-dom";
import ProductForm from "../../components/admin/ProductForm.tsx";
import { createItem } from "../../services/itemService";
import type { ItemInDto } from "../../types/item.types";
import "../ProtectedPages.css";

export default function CreateProductPage() {
  const navigate = useNavigate();

  async function handleCreateProduct(itemData: ItemInDto) {
    await createItem(itemData);
    navigate("/admin/items");
  }

  return (
    <main className="protected-page">
      <section className="protected-card">
        <div className="protected-card__eyebrow">Admin area</div>
        <h1>Create product</h1>
        <p>
          Add a new healthy product to the Cozy Bites catalog, including its
          image, price and release date.
        </p>
      </section>

      <ProductForm submitLabel="Create product" onSubmit={handleCreateProduct} />
    </main>
  );
}