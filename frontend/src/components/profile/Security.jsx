import React, { useState } from "react";
import Swal from "sweetalert2";
import API from "../../api/axios";


const Security = ({ user }) => {
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
   
  const sendOtp = async () => {
    try {
      const response = await API.post("/auth/send-otp", {
        email: user.email,
      });

      if (response.data.success) {
        setOtpSent(true);
        Swal.fire("OTP Sent");
      }
    } catch (error) {
      Swal.fire("Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await API.post("/auth/verify-otp-only", {
        email: user.email,
        otp,
      });

      if (response.data.success) {
        setOtpVerified(true);
        Swal.fire("OTP Verified");
      }
    } catch (error) {
      Swal.fire("Invalid OTP");
    }
  };

  const updatePassword = async () => {
    if (newPassword !== confirmPassword) {
      Swal.fire("Passwords do not match");
      return;
    }

    try {
      const response = await API.post("/auth/reset-password", {
        email: user.email,
        otp,
        newPassword,
      });

      if (response.data.success) {
        Swal.fire("Password updated");
        setOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setOtpSent(false);
        setOtpVerified(false);
      }
    } catch (error) {
      Swal.fire("Error updating password");
    }
  };

  return (
    <div>
      <h2>Security</h2>

      <p>Email: {user?.email}</p>

      {!otpSent && <button onClick={sendOtp}>Send OTP</button>}

      {otpSent && !otpVerified && (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </>
      )}

      {otpVerified && (
        <>
          <input
            type="password"
            placeholder="New Password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button onClick={updatePassword}>
            Update Password
          </button>
        </>
      )}
    </div>
  );
};

export default Security;
