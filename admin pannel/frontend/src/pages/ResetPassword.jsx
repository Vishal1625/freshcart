
import React, { useState } from "react";
import api from "./api/axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/reset-password", {
        id,
        token,
        newPassword: password
      });

      alert("Password reset, please login.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Reset failed");
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
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Reset Password</button>
    </form>
  );
}
