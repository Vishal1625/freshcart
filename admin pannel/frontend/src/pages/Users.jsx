import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Users() {
    const user = JSON.parse(localStorage.getItem("authUser") || "null");

    const [users, setUsers] = useState(() => {
        return JSON.parse(localStorage.getItem("users") || "[]");
    });

    const [form, setForm] = useState({ name: "", email: "" });

    // Save users to localStorage
    useEffect(() => {
        localStorage.setItem("users", JSON.stringify(users));
    }, [users]);

    // Logout function
    const doLogout = () => {
        localStorage.removeItem("authUser");
        localStorage.removeItem("token");
        window.location.href = "/login";
    };

    // Add user
    const add = () => {
        if (!form.name.trim() || !form.email.trim()) {
            alert("Name and Email required!");
            return;
        }

        const newUser = {
            id: Math.random().toString(36).slice(2, 9),
            name: form.name,
            email: form.email,
        };

        setUsers([newUser, ...users]);
        setForm({ name: "", email: "" });
    };

    // Delete user
    const remove = (id) => {
        setUsers(users.filter((u) => u.id !== id));
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar onLogout={doLogout} />

            <div style={{ flex: 1 }}>
                <Topbar user={user} />

                <div style={{ padding: 18 }}>
                    {/* Add User Box */}
                    <div
                        style={{
                            background: "#fff",
                            padding: 16,
                            borderRadius: 10,
                            marginBottom: 12,
                        }}
                    >
                        <h4>Add User</h4>

                        <div style={{ display: "flex", gap: 8 }}>
                            <input
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                style={{ padding: 6, flex: 1 }}
                            />
                            <input
                                placeholder="Email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                style={{ padding: 6, flex: 1 }}
                            />
                            <button onClick={add}>Add</button>
                        </div>
                    </div>

                    {/* Users Table */}
                    <div
                        style={{
                            background: "#fff",
                            padding: 16,
                            borderRadius: 10,
                        }}
                    >
                        <h4>Users</h4>

                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr
                                    style={{ borderBottom: "1px solid #eef2f7", textAlign: "left" }}
                                >
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: "center", padding: 10 }}>
                                            No users found
                                        </td>
                                    </tr>
                                )}

                                {users.map((u) => (
                                    <tr
                                        key={u.id}
                                        style={{ borderBottom: "1px solid #eef2f7" }}
                                    >
                                        <td>{u.name}</td>
                                        <td>{u.email}</td>
                                        <td>
                                            <button onClick={() => remove(u.id)}>Remove</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
