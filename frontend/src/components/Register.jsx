import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/register.css";

function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      onRegister();

      // Show toast popup
      setShowPopup(true);
      setVisible(true);

      // Start fade out after 1.8 sec
      setTimeout(() => setVisible(false), 1800);
      
      // Hide popup and navigate after 2 sec
      setTimeout(() => {
        setShowPopup(false);
        navigate("/login");
      }, 2000);
    } else {
      setMsg(data.message || "Registration failed");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-title">Register</h2>
        <input
          type="email"
          className="register-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="register-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="register-btn">
          Register
        </button>
        {msg && <div className="register-error">{msg}</div>}
        <p className="register-text">
          Already have an account?{" "}
          <Link className="register-link" to="/login">
            Login
          </Link>
        </p>
      </form>

      {showPopup && (
        <div className={`toast-notification ${visible ? "visible" : "hidden"}`}>
          Registered Successfully!
        </div>
      )}
    </>
  );
}

export default Register;
