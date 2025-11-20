import React, { useState } from "react";
import axios from "axios";
import forgetpassword from "../../images/fp-g.svg";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

// Backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const MyAccountForgetPassword = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // ============================
  // ✅ SEND OTP
  // ============================
  const handleSendOtp = async () => {
    if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const { data } = await axios.post("/api/auth/send-otp", { phone });

      if (data.success) {
        setOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while sending OTP");
    }
  };

  // ============================
  // ✅ VERIFY OTP
  // ============================
  const handleVerifyOtp = async () => {
    try {
      const { data } = await axios.post("/api/auth/verify-otp", { phone, otp });

      if (data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while verifying OTP");
    }
  };

  // ============================
  // ✅ RESET PASSWORD
  // ============================
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify your OTP first.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const { data } = await axios.post("/api/auth/reset-password", {
        phone,
        password,
      });

      if (data.success) {
        alert("Password reset successful! Please login again.");
        navigate("/MyAccountSignIn");
      } else {
        alert(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      alert("Server error while resetting password");
    }
  };

  return (
    <div>
      <ScrollToTop />

      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center">

            {/* Illustration */}
            <div className="col-12 col-md-6 col-lg-4 text-center order-lg-1 order-2 mb-4">
              <img src={forgetpassword} alt="forgot password" className="img-fluid" />
            </div>

            {/* Form */}
            <div className="col-12 col-md-6 col-lg-5 order-lg-2 order-1">
              <div className="mb-lg-4 mb-3">
                <h1 className="h2 fw-bold">Reset your password</h1>
                <p>Verify your phone number using OTP to reset your password.</p>
              </div>

              <form onSubmit={handleResetPassword}>
                <div className="row g-3">

                  {/* Phone Input */}
                  <div className="col-12 d-flex flex-column flex-md-row">
                    <input
                      type="tel"
                      className="form-control me-md-2 mb-2 mb-md-0"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleSendOtp}
                      disabled={otpSent && !otpVerified}
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  </div>

                  {/* OTP */}
                  {otpSent && !otpVerified && (
                    <div className="col-12 d-flex flex-column flex-md-row">
                      <input
                        type="text"
                        className="form-control me-md-2 mb-2 mb-md-0"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={handleVerifyOtp}
                      >
                        Verify
                      </button>
                    </div>
                  )}

                  {/* New Password */}
                  {otpVerified && (
                    <>
                      <div className="col-12">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="New password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="col-12">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Re-enter new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Buttons */}
                  <div className="col-12 d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={!otpVerified}
                    >
                      Reset Password
                    </button>

                    <Link to="/MyAccountSignIn" className="btn btn-light">
                      Back to Login
                    </Link>
                  </div>

                </div>
              </form>

            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountForgetPassword;
