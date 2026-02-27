import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import API from "../api/axios.js";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      const {user,token} = response.data;
      

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login Successful");
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "volunteer") {
        navigate("/volunteer-dashboard");
      } else {
        navigate("/dashboard"); // normal user
      }

    } catch (error) {
      alert(error.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login to CleanStreet</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Forgot Password Link */}
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <Link to="/forgot-password" style={{ fontSize: "14px" }}>
              Forgot Password?
            </Link>
          </div>

          <button className="auth-btn">Login</button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;