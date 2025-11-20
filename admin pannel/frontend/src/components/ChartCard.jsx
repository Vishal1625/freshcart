

import React from "react";

export default function Topbar() {
    return (
        <div
            style={{
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 18px",
                borderBottom: "1px solid #e2e8f0",
                background: "#fff",
            }}
        >
            <h3 style={{ margin: 0 }}>Admin Dashboard</h3>
            <div>{new Date().toLocaleString()}</div>
        </div>
    );
}
