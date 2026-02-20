import React, { useEffect, useState } from "react";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../api";

function Admin({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      setMessage("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price.toString(),
      description: product.description || "",
      imageUrl: product.imageUrl || "",
    });
    setMessage("");
  };

  const handleCancel = () => {
    setEditingId(null);
    setForm({ name: "", price: "", description: "", imageUrl: "" });
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    const priceNumber = Number(form.price);
    if (!form.name || Number.isNaN(priceNumber)) {
      setMessage("Please provide a name and numeric price.");
      return;
    }
    try {
      if (editingId) {
        // Update existing product
        const updated = await updateProduct(token, editingId, {
          name: form.name,
          price: priceNumber,
          description: form.description,
          imageUrl: form.imageUrl,
        });
        if (updated && updated.id) {
          setMessage("Product updated successfully.");
          setEditingId(null);
          setForm({ name: "", price: "", description: "", imageUrl: "" });
          loadProducts();
        } else {
          setMessage("Failed to update product.");
        }
      } else {
        // Create new product
        const created = await createProduct(token, {
          name: form.name,
          price: priceNumber,
          description: form.description,
          imageUrl: form.imageUrl,
        });
        if (created && created.id) {
          setMessage("Product added successfully.");
          setForm({ name: "", price: "", description: "", imageUrl: "" });
          loadProducts();
        } else {
          setMessage(created.message || "Failed to add product.");
        }
      }
    } catch (err) {
      setMessage(err.message || "Operation failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      const result = await deleteProduct(token, id);
      if (result.message) {
        setMessage("Product deleted successfully.");
        loadProducts();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(result.message || "Failed to delete product.");
      }
    } catch (err) {
      setMessage(err.message || "Failed to delete product.");
    }
  };

  if (!token) {
    return (
      <div style={{ padding: 24, color: "#fecaca" }}>
        Session expired. Please log out and log in again as admin.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 24, gridTemplateColumns: "1.1fr 1.4fr" }}>
      <section
        style={{
          padding: 20,
          borderRadius: 12,
          backgroundColor: "#020617",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>
          {editingId ? "Edit existing product" : "Add new product"}
        </h2>
        <p style={{ marginTop: 0, marginBottom: 16, fontSize: 13, color: "#9ca3af" }}>
          {editingId
            ? "Update product name, price, description, and photo below."
            : "Add a new product with name, price, description, and image URL."}
        </p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: "#9ca3af" }}>Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9ca3af" }}>Price (₹)</label>
            <input
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              type="number"
              min="0"
              style={{
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9ca3af" }}>Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              placeholder="https://…"
              style={{
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                backgroundColor: "#020617",
                color: "#e5e7eb",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, color: "#9ca3af" }}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              style={{
                width: "100%",
                marginTop: 4,
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid rgba(148,163,184,0.6)",
                backgroundColor: "#020617",
                color: "#e5e7eb",
                resize: "vertical",
              }}
            />
          </div>
          {message && (
            <div
              style={{
                padding: 8,
                borderRadius: 8,
                backgroundColor: message.includes("success")
                  ? "#022c22"
                  : "#451a1a",
                color: message.includes("success") ? "#bbf7d0" : "#fecaca",
                fontSize: 13,
              }}
            >
              {message}
            </div>
          )}
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "9px 14px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg, #22c55e 0%, #16a34a 45%, #15803d 100%)",
                color: "#020617",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {editingId ? "Save changes" : "Add new product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: "9px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background: "transparent",
                  color: "#e5e7eb",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section
        style={{
          padding: 20,
          borderRadius: 12,
          backgroundColor: "#020617",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 12 }}>Edit existing products</h2>
        <p style={{ marginTop: 0, marginBottom: 12, fontSize: 13, color: "#9ca3af" }}>
          Click Edit on a product to modify it, or Delete to remove it.
        </p>
        {loading ? (
          <div style={{ padding: 8 }}>Loading…</div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  borderRadius: 10,
                  border: "1px solid rgba(148,163,184,0.4)",
                  overflow: "hidden",
                  background:
                    "radial-gradient(circle at top, rgba(34,197,94,0.12), transparent 55%)",
                }}
              >
                {p.imageUrl && (
                  <div
                    style={{
                      width: "100%",
                      height: 140,
                      overflow: "hidden",
                      backgroundColor: "#020617",
                    }}
                  >
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                )}
                <div style={{ padding: 12 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {p.name}
                  </div>
                  {p.description && (
                    <div
                      style={{
                        fontSize: 13,
                        color: "#9ca3af",
                        marginBottom: 6,
                      }}
                    >
                      {p.description}
                    </div>
                  )}
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#22c55e",
                      marginBottom: 8,
                    }}
                  >
                    ₹{p.price}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => handleEdit(p)}
                      style={{
                        flex: 1,
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "#007bff",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      style={{
                        flex: 1,
                        padding: "6px 12px",
                        borderRadius: 6,
                        border: "none",
                        background: "#dc3545",
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Admin;

