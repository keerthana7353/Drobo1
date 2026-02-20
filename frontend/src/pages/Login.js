import React, { useState } from "react";
import { login } from "../api";

function Login({ setPage, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mode, setMode] = useState("customer"); // "customer" | "admin"

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const result = await login({ username, password });
      if (result.token && onLogin) {
        onLogin(result.token, result.role || "customer");
      } else if (result.token) {
        setError("Login error: missing callback");
      } else {
        setError(result.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "4px 0" }}>
      <div
        style={{
          display: "flex",
          marginBottom: 16,
          backgroundColor: "rgba(15,23,42,0.9)",
          borderRadius: 999,
          padding: 4,
          border: "1px solid rgba(148,163,184,0.6)",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setMode("customer");
            setUsername("");
            setPassword("");
            setError("");
          }}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 999,
            border: "none",
            backgroundColor: mode === "customer" ? "#22c55e" : "transparent",
            color: mode === "customer" ? "#020617" : "#e5e7eb",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Customer
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("admin");
            setUsername("");
            setPassword("");
            setError("");
          }}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 999,
            border: "none",
            backgroundColor: mode === "admin" ? "#22c55e" : "transparent",
            color: mode === "admin" ? "#020617" : "#e5e7eb",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Admin
        </button>
      </div>

      <h2 style={{ marginTop: 0, marginBottom: 12 }}>
        {mode === "admin" ? "Admin login" : "Customer login"}
      </h2>
      {mode === "admin" && (
        <p
          style={{
            marginTop: 0,
            marginBottom: 12,
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          Admins can manage products. Customers can browse and buy.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "10px", fontSize: "16px" }}
          />
        </div>
        {error && (
          <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
      {mode === "customer" && (
        <button
          onClick={() => setPage("register")}
          style={{
            marginTop: "10px",
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            backgroundColor: "transparent",
            border: "1px solid #007bff",
            color: "#007bff",
            cursor: "pointer",
          }}
        >
          Don't have an account? Register
        </button>
      )}
    </div>
  );
}

export default Login;
