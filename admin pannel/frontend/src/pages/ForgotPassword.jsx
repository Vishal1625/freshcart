

import React, { useState } from "react";
import api from "./api/axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      alert("Password reset link sent to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        width: "320px",
        margin: "70px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      }}
    >
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit">Send reset link</button>
    </form>
  );
}
