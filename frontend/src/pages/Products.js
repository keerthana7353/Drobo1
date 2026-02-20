import React, { useEffect, useState } from "react";
import { addToCart, getProducts } from "../api";

function Products({ token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        setMessage("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(token, product);
      setMessage(`Added ${product.name} to cart`);
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setMessage("Failed to add to cart");
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading products…</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Products</h2>
      {message && (
        <div
          style={{
            marginBottom: 16,
            padding: 10,
            borderRadius: 4,
            background: "#e6ffed",
          }}
        >
          {message}
        </div>
      )}
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
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: 16,
              textAlign: "center",
            }}
          >
            <h3>{p.name}</h3>
            {p.description && (
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
                {p.description}
              </p>
            )}
            <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
            <button
              onClick={() => handleAddToCart(p)}
              style={{
                padding: "8px 16px",
                borderRadius: 4,
                border: "none",
                background: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
