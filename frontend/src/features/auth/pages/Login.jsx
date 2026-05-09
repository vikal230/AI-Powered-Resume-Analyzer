import React from "react";
import "../auth.form.scss";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await handleLogin({ email, password });
    if (isSuccess) {
      navigate("/");
    }
  };

  if (loading) {
    return (
      <main
        style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}
      >
        <svg width="44" height="44" viewBox="0 0 50 50" aria-hidden="true">
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="5"
          />
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="#ec4899"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="32 120"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="from-container">
        <h1>login</h1>
        <p className="auth-subtitle">
          Welcome back. Continue your interview preparation from where you left
          off.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              name="email"
              placeholder="enter your email"
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="password-field">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button className="button primary-button">Login</button>
        </form>
        <p>
          Don't have an account? <Link to={"/register"}>Register</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
