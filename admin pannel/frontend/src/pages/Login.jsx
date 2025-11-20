import React, { useState } from "react";
import api from "./api/axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const nav = useNavigate();

  // ✅ Correct submit function
  const submit = async (e) => {
    e.preventDefault();

    try {
      const res =
        await api.post("/auth/login", form);


      // Save token + user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("authUser", JSON.stringify(res.data.user));

      // Set default authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

      nav("/Dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "300px",
        gap: "10px",
        margin: "70px auto",
        padding: "20px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        background: "#fff"
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>

      <input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      <div style={{ marginTop: "10px", textAlign: "center" }}>
        <a href="/register">Create new account</a>
        <br />
        <a href="/forgot-password">Forgot password?</a>
      </div>
    </form>
  );
}
const submit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.post("/auth/test-login", { email });
    console.log(res.data);
    alert("Test Login Success!");
    nav("/dashboard");
  } catch (err) {
    alert("Test login failed");
  }
};