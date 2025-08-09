import { useState } from "react";
import "../styles/productForm.css";

function ProductForm({ product, onSave, onClose }) {
  const [form, setForm] = useState(
    product
      ? { name: product.name, price: product.price, image: product.image, _id: product._id }
      : { name: "", price: "", image: "" }
  );

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h3>{product ? "Update Product" : "Add Product"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={!!product}
          />
          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            required
          />
          <div>
            <button type="submit">{product ? "Update" : "Add"}</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
