
import React, { useState } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";

function App() {
  const [page, setPage] = useState("login");
  const [token, setToken] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // When admin logs in, redirect to admin page; customers to products
  React.useEffect(() => {
    if (token && (page === "login" || page === "register")) {
      if (isAdmin) {
        setPage("admin");
      } else {
        setPage("products");
      }
    }
  }, [token, isAdmin, page]);

  const handleLogout = () => {
    setToken("");
    setIsAdmin(false);
    setPage("login");
  };

  if (!token) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #020617 100%)",
          color: "#e5e7eb",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 420,
            padding: "32px 28px",
            backgroundColor: "rgba(15,23,42,0.92)",
            boxShadow: "0 25px 50px -12px rgba(15,23,42,0.8)",
            borderRadius: 16,
            border: "1px solid rgba(148,163,184,0.4)",
          }}
        >
          <h1
            style={{
              margin: 0,
              marginBottom: 8,
              fontSize: 28,
              fontWeight: 700,
              color: "#f9fafb",
            }}
          >
            Drobo Store
          </h1>
          <p
            style={{
              margin: 0,
              marginBottom: 24,
              fontSize: 14,
              color: "#9ca3af",
            }}
          >
            Sign in to continue to your Drobo Store account.
          </p>
          {page === "login" ? (
            <Login
              setPage={setPage}
              onLogin={(newToken, role) => {
                setToken(newToken);
                setIsAdmin(role === "admin");
              }}
            />
          ) : (
            <Register setPage={setPage} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#020617",
        color: "#e5e7eb",
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 32px",
          backgroundColor: "#020617",
          borderBottom: "1px solid rgba(148,163,184,0.2)",
          boxShadow: "0 10px 30px -15px rgba(15,23,42,0.9)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 30% 20%, #22c55e, #22d3ee)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 16,
              color: "#020617",
            }}
          >
            D
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Drobo Store</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>
              {isAdmin ? "Admin" : "Customer"} dashboard
            </div>
          </div>
        </div>

        <nav style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => setPage("products")}
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid transparent",
              backgroundColor:
                page === "products" ? "#22c55e" : "rgba(15,23,42,0.9)",
              color: page === "products" ? "#020617" : "#e5e7eb",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Products
          </button>
          <button
              onClick={() => setPage("cart")}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid transparent",
                backgroundColor:
                  page === "cart" ? "#22c55e" : "rgba(15,23,42,0.9)",
                color: page === "cart" ? "#020617" : "#e5e7eb",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Cart
            </button>
          {isAdmin && (
            <button
              onClick={() => setPage("admin")}
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                border: "1px solid transparent",
                backgroundColor:
                  page === "admin" ? "#22c55e" : "rgba(15,23,42,0.9)",
                color: page === "admin" ? "#020617" : "#e5e7eb",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              Admin
            </button>
          )}
          <button
            onClick={handleLogout}
            style={{
              marginLeft: 8,
              padding: "8px 14px",
              borderRadius: 999,
              border: "1px solid rgba(148,163,184,0.6)",
              backgroundColor: "transparent",
              color: "#e5e7eb",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
      </header>

      <main
        style={{
          flex: 1,
          padding: "24px 18px 32px",
          maxWidth: 1120,
          width: "100%",
          margin: "0 auto",
        }}
      >
        {page === "products" && <Products token={token} />}
        {page === "cart" && <Cart token={token} />}
        {page === "admin" && isAdmin && <Admin token={token} />}
      </main>
    </div>
  );
}

export default App;
