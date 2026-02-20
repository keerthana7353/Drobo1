🛒 Minimal E-Commerce Web Application
A minimal full-stack e-commerce web application built using:

Frontend: React.js
Backend: Node.js + Express
Authentication: JSON Web Token (JWT)
Storage: In-memory (for simplicity)

📌 Features
✅ User Registration
✅ User Login (JWT Authentication)
✅ Product Listing (Static products from backend)
✅ Add to Cart
✅ Remove from Cart
✅ Protected Cart APIs
✅ RESTful API architecture

🏗️ Architecture
Frontend (React)
        ↓
   REST API Calls
        ↓
Backend (Node.js + Express)
        ↓
In-memory storage (Users, Products, Cart)

Backend Responsibilities
  Handle authentication (register/login)
  Generate and verify JWT tokens
  Provide product API
  Provide protected cart API

Frontend Responsibilities
  User interface
  Store JWT token in state
  Consume backend APIs using fetch
  Manage navigation between pages

📁 Project Structure
ecommerce-app/
│
├── backend/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   └── src/
│        ├── App.js
│        ├── api.js
│        └── pages/
│
└── README.md

⚙️ Setup Instructions
1️⃣ Clone or Extract the Project


cd ecommerce-app
🚀 Backend Setup
cd backend
npm install
npm start

Server will start at:http://localhost:5000

Available APIs:
Method	Endpoint	Description
POST	/api/register	Register new user
POST	/api/login	Login user
GET	/api/products	Get product list
GET	/api/cart	Get cart (Protected)
POST	/api/cart	Add to cart (Protected)
DELETE	/api/cart/:id	Remove item (Protected)

💻 Frontend Setup
If React app is not initialized:
npx create-react-app frontend
Replace the src folder with the provided src folder.

Then run:
cd frontend
npm install
npm start

Frontend runs at:
http://localhost:3000

🔐 Authentication Flow
User registers
User logs in
Backend returns JWT token
Token is stored in React state
Token is sent in Authorization header for protected APIs

Example header:

Authorization: <token>
🛍️ Product Data (Static Example)
[
  { id: 1, name: "Laptop", price: 60000 },
  { id: 2, name: "Phone", price: 25000 },
  { id: 3, name: "Headphones", price: 2000 }
]

⚠️ Notes
This project uses in-memory storage (data resets when server restarts).
Passwords are not hashed (for simplicity).
Intended for learning/demo purposes.

🌟 Future Improvements
MongoDB integration
Password hashing (bcrypt)
Persistent cart storage
Proper UI design (Material UI / Bootstrap)
Redux for state management
Role-based authentication
Deployment (Render + Vercel)

👩‍💻 Author

Developed as a minimal full-stack React + Node.js assessment project.
KEERTHANA R

