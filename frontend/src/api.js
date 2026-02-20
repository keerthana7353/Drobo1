
const API = "http://localhost:5000/api";

export const register = (data) =>
  fetch(`${API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const getMe = (token) =>
  fetch(`${API}/me`, {
    headers: {
      Authorization: token,
    },
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to get user");
    return data;
  });

export const login = (data) =>
  fetch(`${API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(async (res) => {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Login failed");
    }
    return data;
  });

export const getProducts = () =>
  fetch(`${API}/products`).then(res => res.json());

export const getCart = (token) =>
  fetch(`${API}/cart`, {
    headers: { Authorization: token },
  }).then(res => res.json());

export const addToCart = (token, product) =>
  fetch(`${API}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(product),
  }).then(res => res.json());

export const removeFromCart = (token, id) =>
  fetch(`${API}/cart/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  }).then(res => res.json());

export const createProduct = (token, data) =>
  fetch(`${API}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to add product");
    return result;
  });

export const checkoutCart = (token) =>
  fetch(`${API}/checkout`, {
    method: "POST",
    headers: { Authorization: token },
  }).then(res => res.json());

export const updateProduct = (token, id, data) =>
  fetch(`${API}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  }).then(async (res) => {
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || "Update failed");
    }
    return result;
  });

export const deleteProduct = (token, id) =>
  fetch(`${API}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  }).then(async (res) => {
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Failed to delete");
    return result;
  });
