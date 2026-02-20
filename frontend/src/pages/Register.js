import React, { useState } from "react";
import { register } from "../api";

function Register({ setPage }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const result = await register({ username, password });
      if (result.message) {
        setSuccess("Registration successful! Please login.");
        setTimeout(() => setPage("login"), 2000);
      } else {
        setError(result.message || "Registration failed");
      }
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "50px auto" }}>
      <h2>Register</h2>
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
        {success && (
          <div style={{ color: "green", marginBottom: "15px" }}>{success}</div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>
      <button
        onClick={() => setPage("login")}
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
        Already have an account? Login
      </button>
    </div>
  );
}

export default Register;
