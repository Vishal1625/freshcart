// src/pages/Shop/Invoice.jsx
import React from "react";
// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";
export default function Invoice({ order }) {
    if (!order) return null;
    return (
        <div style={{ padding: 20, fontFamily: "Arial" }}>
            <h2>Invoice #{order._id}</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th style={{ border: "1px solid #ddd", padding: 8 }}>Item</th>
                        <th style={{ border: "1px solid #ddd", padding: 8 }}>Qty</th>
                        <th style={{ border: "1px solid #ddd", padding: 8 }}>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((it, i) => (
                        <tr key={i}>
                            <td style={{ border: "1px solid #ddd", padding: 8 }}>{it.name}</td>
                            <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "center" }}>{it.qty}</td>
                            <td style={{ border: "1px solid #ddd", padding: 8, textAlign: "right" }}>₹{it.price}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
