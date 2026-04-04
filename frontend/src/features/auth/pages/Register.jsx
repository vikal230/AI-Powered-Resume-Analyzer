import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [userName, setUserame] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <main><h1>loading...</h1></main>
    )
  }

  return (
    <main>
      <div className="from-container">
        <h1>Register</h1>
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
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              name="password"
              placeholder="enter your password"
            />
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
