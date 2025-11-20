

import React from "react";

export default function Topbar({ user }) {
    return (
        <div
            style={{
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
                borderBottom: "1px solid #eef2f7",
                background: "#fff",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <h3 style={{ margin: 0 }}>Admin Dashboard</h3>

                {user && (
                    <div style={{ color: "#64748b" }}>
                        Welcome, <strong>{user.name}</strong>
                    </div>
                )}
            </div>

            <div style={{ color: "#64748b" }}>
                {new Date().toLocaleString()}
            </div>
        </div>
    );
} 