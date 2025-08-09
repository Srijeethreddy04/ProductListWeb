import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css"// <-- Import the CSS file

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("token", data.token);
      onLogin(data.user);
      if (data.user.role === "admin") navigate("/admin");
      else navigate("/");
    } else {
      setMsg(data.message || "Login failed");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-title">Login</h2>
      <input
        className="login-input"
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        className="login-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button className="login-btn" type="submit">
        Login
      </button>
      {msg && <div className="login-error">{msg}</div>}
      <p className="login-text">
        No account?{" "}
        <Link className="login-link" to="/register">
          Register
        </Link>
      </p>
    </form>
  );
}

export default Login;
