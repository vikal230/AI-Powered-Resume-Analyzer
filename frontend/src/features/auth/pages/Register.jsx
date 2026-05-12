import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserame] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { loading, handleRegister } = useAuth();


  const handleSubmit = async (e) => {
    e.preventDefault();
    const isSuccess = await handleRegister({ userName, email, password });
    if (isSuccess) {
      navigate("/");
    }
  };

  
  if (loading) {
    return (
      <main
        style={{ minHeight: "100vh", display: "grid", placeItems: "center", gap: "10px" }}
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
        <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>Loading Register...</p>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="from-container">
        <h1>Register</h1>
        <p className="auth-subtitle">
          Create your account and start generating role-based interview plans.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              value={userName}
              onChange={(e) => setUserame(e.target.value)}
              type="username"
              id="username"
              name="username"
              placeholder="enter your username"
            />
          </div>
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
          <button className="button primary-button">Register</button>
        </form>
        <p>
          Already Have an Account? <Link to={"/login"}>Login</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
