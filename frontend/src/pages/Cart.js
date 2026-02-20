import React, { useEffect, useState } from "react";
import { checkoutCart, getCart, removeFromCart } from "../api";

function Cart({ token }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    try {
      const data = await getCart(token);
      setItems(data);
    } catch (e) {
      setMessage("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (id) => {
    try {
      await removeFromCart(token, id);
      setMessage("Item removed from cart");
      loadCart();
      setTimeout(() => setMessage(""), 3000);
    } catch (e) {
      setMessage("Failed to remove item");
    }
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  const handleCheckout = async () => {
    try {
      const result = await checkoutCart(token);
      if (result && result.message) {
        setMessage(result.message);
        setItems([]);
      } else {
        setMessage(result.message || "Checkout failed");
      }
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Checkout failed");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading) {
    return <div style={{ padding: 20 }}>Loading cart…</div>;
  }

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>Cart</h2>
      {message && (
        <div
          style={{
            marginBottom: 16,
            padding: 10,
            borderRadius: 4,
            background: "#fff3cd",
          }}
        >
          {message}
        </div>
      )}
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div>
                  <div>{item.name}</div>
                  <div style={{ fontWeight: "bold" }}>₹{item.price}</div>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 4,
                    border: "none",
                    background: "#dc3545",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                padding: 12,
                borderRadius: 4,
                background: "#f8f9fa",
                fontWeight: "bold",
                color: "#020617",
              }}
            >
              Total: ₹{total}
            </div>
            <button
              onClick={handleCheckout}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                border: "none",
                background:
                  "linear-gradient(135deg, #22c55e 0%, #16a34a 45%, #15803d 100%)",
                color: "#020617",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Buy now
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
