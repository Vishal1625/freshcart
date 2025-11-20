import React, { useState } from "react";
import signupimage from "../../images/signup-g.svg";
import { Link } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import axios from "axios";

// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const MyAccountSignUp = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  // ----------------------------------------------------
  // ✅ SEND OTP
  // ----------------------------------------------------
  const handleSendOtp = async () => {
    if (phone.length !== 10 || !/^[0-9]+$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/api/otp/send", {
        phone,
        email,
      });

      if (res.data.success) {
        setOtpSent(true);
        alert("OTP sent successfully!");
      } else {
        alert(res.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // ✅ VERIFY OTP
  // ----------------------------------------------------
  const handleVerifyOtp = async () => {
    if (otp.length < 4) {
      alert("Please enter a valid OTP.");
      return;
    }

    try {
      const res = await axios.post("/api/otp/verify", {
        phone,
        otp,
      });

      if (res.data.success) {
        setOtpVerified(true);
        alert("OTP verified successfully!");
      } else {
        alert(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Please try again.");
    }
  };

  // ----------------------------------------------------
  // ✅ REGISTER USER
  // ----------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      alert("Please verify OTP before registering.");
      return;
    }

    const formData = new FormData(e.target);
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      phone,
      password: formData.get("password"),
    };

    try {
      const res = await axios.post("/api/auth/register", userData);

      if (res.data.success) {
        alert("Registration successful!");
      } else {
        alert(res.data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Try again.");
    }
  };

  // ----------------------------------------------------
  // RETURN UI
  // ----------------------------------------------------
  return (
    <div>
      <ScrollToTop />

      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center g-5">

            {/* Left Side Image */}
            <div className="col-12 col-md-6 col-lg-4 text-center order-lg-1 order-2">
              <img
                src={signupimage}
                alt="signup"
                className="img-fluid w-100"
                style={{ maxWidth: "380px" }}
              />
            </div>

            {/* Signup Form */}
            <div className="col-12 col-md-6 col-lg-5 order-lg-2 order-1">
              <div className="mb-lg-4 mb-5 text-center text-md-start">
                <h1 className="mb-1 h2 fw-bold">Get Started Shopping</h1>
                <p>Welcome to Freshcart! Enter your details to get started.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="row g-3">

                  {/* First Name */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="firstName"
                      className="form-control"
                      placeholder="First name"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div className="col-md-6">
                    <input
                      type="text"
                      name="lastName"
                      className="form-control"
                      placeholder="Last name"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="col-12">
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Phone + OTP Button */}
                  <div className="col-12 d-flex flex-column flex-md-row">
                    <input
                      type="tel"
                      className="form-control me-md-2 mb-2 mb-md-0"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />

                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={handleSendOtp}
                      disabled={otpVerified || loading}
                    >
                      {loading
                        ? "Sending..."
                        : otpSent && !otpVerified
                          ? "Resend OTP"
                          : "Send OTP"}
                    </button>
                  </div>

                  {/* OTP Verification */}
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

                  {/* Password */}
                  <div className="col-12">
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      placeholder="Password"
                      required
                    />
                  </div>

                  {/* Register Button */}
                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>

                    <span className="navbar-text text-center mt-2">
                      Already have an account?{" "}
                      <Link to="/MyAccountSignIn">Sign in</Link>
                    </span>
                  </div>

                  {/* Terms */}
                  <p className="mt-2 text-center">
                    <small>
                      By continuing, you agree to our{" "}
                      <Link to="#!">Terms of Service</Link> &{" "}
                      <Link to="#!">Privacy Policy</Link>
                    </small>
                  </p>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default MyAccountSignUp;
