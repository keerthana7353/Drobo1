
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "mysecretkey";

// In-memory stores (demo only)
let users = [];
let cart = {};

let products = [
  {
    id: 1,
    name: "Laptop",
    price: 60000,
    description: "Powerful laptop for work and gaming.",
    imageUrl:
      "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&w=600",
  },
  {
    id: 2,
    name: "Phone",
    price: 25000,
    description: "Smartphone with great camera and battery life.",
    imageUrl:
      "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg?auto=compress&w=600",
  },
  {
    id: 3,
    name: "Headphones",
    price: 2000,
    description: "Comfortable headphones with rich sound.",
    imageUrl:
      "https://images.pexels.com/photos/159643/headphones-music-earpads-earphones-159643.jpeg?auto=compress&w=600",
  },
];

app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  // Prevent anyone from registering as the reserved admin user
  if (username === "admin") {
    return res
      .status(400)
      .json({ message: "This username is reserved. Please choose another." });
  }

  // All registered users are customers
  users.push({ username, password, role: "customer" });
  res.json({ message: "User registered successfully" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  let user =
    users.find((u) => u.username === username && u.password === password) ||
    null;

  // Simple hard-coded admin account (demo)
  if (!user && username === "admin" && password === "1234") {
    user = { username: "admin", role: "admin" };
  }

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const role = user.role || (user.username === "admin" ? "admin" : "customer");
  const token = jwt.sign({ username: user.username, role }, SECRET, {
    expiresIn: "1h",
  });
  res.json({ token, role });
});

function authenticate(req, res, next) {
  let token = req.headers.authorization;
  if (!token) return res.status(403).json({ message: "No token" });
  if (typeof token === "string" && token.startsWith("Bearer ")) {
    token = token.slice(7);
  }

  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded.username;
    req.role = decoded.role || "customer";
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Get current user info (username, role) from token
app.get("/api/me", authenticate, (req, res) => {
  res.json({ username: req.user, role: req.role });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

// Admin-only: add a new product
app.post("/api/products", authenticate, (req, res) => {
  const isAdmin = req.role === "admin" || req.user === "admin";
  if (!isAdmin) {
    return res.status(403).json({ message: "Only admin can add products" });
  }

  const { name, price, description, imageUrl } = req.body;
  if (!name || typeof price !== "number") {
    return res
      .status(400)
      .json({ message: "Name and numeric price are required" });
  }

  const nextId = products.length
    ? Math.max(...products.map((p) => p.id)) + 1
    : 1;
  const product = {
    id: nextId,
    name,
    price,
    description: description || "",
    imageUrl: imageUrl || "",
  };
  products.push(product);
  res.json(product);
});

// Admin-only: update a product
app.put("/api/products/:id", authenticate, (req, res) => {
  const isAdmin = req.role === "admin" || req.user === "admin";
  if (!isAdmin) {
    return res.status(403).json({ message: "Only admin can edit products" });
  }

  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { name, price, description, imageUrl } = req.body;
  if (!name || typeof price !== "number") {
    return res
      .status(400)
      .json({ message: "Name and numeric price are required" });
  }

  products[index] = {
    ...products[index],
    name,
    price,
    description: description || "",
    imageUrl: imageUrl || "",
  };
  res.json(products[index]);
});

// Admin-only: delete a product
app.delete("/api/products/:id", authenticate, (req, res) => {
  const isAdmin = req.role === "admin" || req.user === "admin";
  if (!isAdmin) {
    return res.status(403).json({ message: "Only admin can delete products" });
  }

  const id = parseInt(req.params.id);
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Product not found" });
  }

  products.splice(index, 1);
  res.json({ message: "Product deleted successfully" });
});

app.get("/api/cart", authenticate, (req, res) => {
  res.json(cart[req.user] || []);
});

app.post("/api/cart", authenticate, (req, res) => {
  const product = req.body;
  if (!cart[req.user]) cart[req.user] = [];
  cart[req.user].push(product);
  res.json({ message: "Item added to cart" });
});

app.delete("/api/cart/:id", authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  cart[req.user] = (cart[req.user] || []).filter(p => p.id !== id);
  res.json({ message: "Item removed" });
});

// Simple checkout endpoint for customers
app.post("/api/checkout", authenticate, (req, res) => {
  const items = cart[req.user] || [];
  if (!items.length) {
    return res.status(400).json({ message: "Cart is empty" });
  }
  cart[req.user] = [];
  res.json({ message: "Purchase successful", items });
});

app.listen(5000, () => console.log("Server running on port 5000"));
