import { useState } from "react";
import type { Item, ItemInDto } from "../../types/item.types";
import { fileToBase64 } from "../../utils/fileToBase64.ts";
import "./ProductForm.css";

interface ProductFormProps {
  initialItem?: Item;
  submitLabel: string;
  onSubmit: (itemData: ItemInDto) => Promise<void>;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  isNew: boolean;
  releaseDate: string;
  image?: string;
}

export default function ProductForm({
  initialItem,
  submitLabel,
  onSubmit,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: initialItem?.name || "",
    description: initialItem?.description || "",
    price: initialItem ? String(initialItem.price) : "",
    isNew: initialItem?.isNew || false,
    releaseDate: initialItem?.releaseDate || new Date().toISOString().split("T")[0],
  });

  const [imagePreview, setImagePreview] = useState<string>(
    initialItem?.imageUrl
      ? `${import.meta.env.VITE_API_URL}${initialItem.imageUrl}`
      : ""
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handleCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;

    setFormData({
      ...formData,
      [name]: checked,
    });
  }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const base64 = await fileToBase64(file);

      setFormData({
        ...formData,
        image: base64,
      });

      setImagePreview(URL.createObjectURL(file));
    } catch (error) {
      console.error(error);
      setError("We couldn't load this image.");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const itemData: ItemInDto = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        isNew: formData.isNew,
        releaseDate: formData.releaseDate,
        image: formData.image,
      };

      await onSubmit(itemData);
    } catch (error) {
      console.error(error);
      setError("We couldn't save this product.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="product-form__grid">
        <div className="product-form__fields">
          <div className="product-form__field">
            <label htmlFor="name">Product name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Green smoothie bowl"
              required
            />
          </div>

          <div className="product-form__field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Fresh, balanced and cozy..."
              rows={4}
              required
            />
          </div>

          <div className="product-form__row">
            <div className="product-form__field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="9.99"
                required
              />
            </div>

            <div className="product-form__field">
              <label htmlFor="releaseDate">Release date</label>
              <input
                id="releaseDate"
                name="releaseDate"
                type="date"
                value={formData.releaseDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label className="product-form__checkbox" htmlFor="isNew">
            <input
              id="isNew"
              name="isNew"
              type="checkbox"
              checked={formData.isNew}
              onChange={handleCheckboxChange}
            />
            <span>Mark as new product</span>
          </label>

          <div className="product-form__field">
            <label htmlFor="image">Product image</label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>

          {error && <p className="product-form__error">{error}</p>}

          <button className="product-form__button" type="submit" disabled={loading}>
            {loading ? "Saving..." : submitLabel}
          </button>
        </div>

        <div className="product-form__preview">
          {imagePreview ? (
            <img src={imagePreview} alt="Product preview" />
          ) : (
            <div className="product-form__placeholder">🥗</div>
          )}
        </div>
      </div>
    </form>
  );
}