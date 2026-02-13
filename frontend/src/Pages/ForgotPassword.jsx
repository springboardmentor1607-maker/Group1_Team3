import React, { useState } from "react";
import "./Auth.css";
import API from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/user/forgot-password", { email });
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Enter your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="auth-btn">Send Reset Link</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;