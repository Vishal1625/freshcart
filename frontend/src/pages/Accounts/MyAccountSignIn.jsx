import React, { useState } from "react";
import signinimage from "../../images/signin-g.svg";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";
import axios from "axios";

// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

const MyAccountSignIn = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      const res = await axios.post("/api/auth/login", {
        phone,
        password,
      });

      if (res.data.success) {
        alert("Login successful!");
        localStorage.setItem("userToken", res.data.token);
        navigate("/"); // redirect after login
      } else if (res.data.message === "User not found") {
        if (
          window.confirm(
            "This phone number is not registered. Would you like to sign up first?"
          )
        ) {
          navigate("/MyAccountSignUp");
        }
      } else {
        alert(res.data.message || "Invalid credentials.");
      }
    } catch (error) {
      alert("Server error. Please try again.");
      console.error("Login Error:", error);
    }
  };

  return (
    <div>
      <ScrollToTop />
      <section className="my-lg-14 my-8">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-md-6 col-lg-4 order-lg-1 order-2">
              <img src={signinimage} alt="signin" className="img-fluid" />
            </div>

            <div className="col-12 col-md-6 offset-lg-1 col-lg-4 order-lg-2 order-1">
              <div className="mb-lg-9 mb-5">
                <h1 className="mb-1 h2 fw-bold">Sign in to freshcart</h1>
                <p>Welcome back! Use your phone number to continue.</p>
              </div>

              <form onSubmit={handleSignIn}>
                <div className="row g-3">
                  <div className="col-12">
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                      />
                      <label className="form-check-label" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    <div>
                      Forgot password?{" "}
                      <Link to="/MyAccountForgetPassword">Reset it</Link>
                    </div>
                  </div>

                  <div className="col-12 d-grid">
                    <button type="submit" className="btn btn-primary">
                      Sign In
                    </button>
                  </div>

                  <div>
                    Don’t have an account?{" "}
                    <Link to="/MyAccountSignUp">Sign Up</Link>
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

export default MyAccountSignIn;
