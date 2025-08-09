import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";

import ProductGrid from "./components/ProductGrid";
import ProductForm from "./components/ProductForm";
import EmptyState from "./components/EmptyState";
import Login from "./components/Login";
import Register from "./components/Register";
import "./styles/App.css";

const API_URL = "http://localhost:5000/api/products";
const VERIFY_URL = "http://localhost:5000/api/auth/verify";

function MainApp({ user, setUser, theme, toggleTheme }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const navigate = useNavigate();
  const isAdmin = user.role === "admin";

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setProducts(data.data || data));
  }, []);

  const handleSave = async (product) => {
    if (!isAdmin) return;
    if (product._id) {
      const res = await fetch(`${API_URL}/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: product.image, price: product.price }),
      });
      const data = await res.json();
      setProducts(products.map((p) => (p._id === product._id ? { ...p, ...(data.data || data) } : p)));
    } else {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      setProducts([...products, data.data || data]);
    }
    setShowForm(false);
    setEditProduct(null);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className={`app ${theme}`}>
      <nav className="navbar">
        <Link to="/" className="brand">
          ProductList
        </Link>
        <div className="nav-actions">
          <span className="welcome-text">
            Welcome, {user.email} ({user.role})
          </span>
          {isAdmin && (
            <button
              className="icon-btn"
              title="Add Product"
              onClick={() => {
                setShowForm(true);
                setEditProduct(null);
              }}
            >
              +
            </button>
          )}
          <button className="icon-btn" title="Toggle Theme" onClick={toggleTheme}>
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          <button onClick={handleLogout} className="logout-btn" title="Logout">
            Logout
          </button>
        </div>
      </nav>

      {showForm && isAdmin && (
        <ProductForm
          product={editProduct}
          onSave={handleSave}
          onClose={() => {
            setShowForm(false);
            setEditProduct(null);
          }}
        />
      )}

      <main>
        {products.length === 0 ? (
          <EmptyState onAdd={isAdmin ? () => { setShowForm(true); setEditProduct(null); } : undefined} />
        ) : (
          <ProductGrid
            products={products}
            onEdit={isAdmin ? (product) => { setShowForm(true); setEditProduct(product); } : undefined}
            onDelete={isAdmin ? handleDelete : undefined}
            canBuy={!isAdmin}
          />
        )}
      </main>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const navigate = useNavigate();

  useEffect(() => {
    // Secure: verify token with backend before restoring user state
    const token = localStorage.getItem("token");
    const userStored = localStorage.getItem("user");
    if (token && userStored) {
      fetch(VERIFY_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setUser(JSON.parse(userStored));
          } else {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setUser(null);
        });
    }
  }, []);

  // Persist theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <MainApp user={user} setUser={setUser} theme={theme} toggleTheme={toggleTheme} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/" />
          ) : (
            <Login
              onLogin={(user) => {
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
              }}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          user ? (
            <Navigate to="/" />
          ) : (
            <Register
              onRegister={() => {
                window.location.href = "/login";
              }}
            />
          )
        }
      />
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
