import React, { useState } from "react";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user"
  });

  const nav = useNavigate();

  // ✅ Correct submit function (Frontend only)
  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/auth/register", form);
      alert("Registered! Now login.");
      nav("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        width: "320px",
        margin: "70px auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#fff"
      }}
    >
      <h2 style={{ textAlign: "center" }}>Register</h2>

      <input
        type="text"
        placeholder="Full name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      <select
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit">Register</button>

      <div style={{ textAlign: "center" }}>
        <a href="/login">Already have an account?</a>
      </div>
    </form>
  );
}
