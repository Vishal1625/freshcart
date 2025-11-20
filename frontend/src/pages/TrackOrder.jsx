

// src/pages/TrackOrder.jsx
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "./ScrollToTop";

/* Optional: import io from "socket.io-client"; and uncomment socket code
   if you enable socket.io on your backend.
*/// Set backend base URL
axios.defaults.baseURL = "http://localhost:5000";

export default function TrackOrder() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId") || "ORD123456";
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const pollRef = useRef(null);

    // timeline mapping (render-friendly)
    const buildTimeline = (status) => {
        const steps = ["Order Placed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
        return steps.map((s) => ({ label: s, done: steps.indexOf(s) <= steps.indexOf(status) }));
    };

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get(`/api/orders/${orderId}`);
                setOrder(res.data.order);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setOrder({
                    _id: orderId,
                    status: "Order Placed",
                    estimated: "Tomorrow, 6 PM",
                });
                setLoading(false);
            }
        };

        fetch();

        // Poll every 5s
        pollRef.current = setInterval(fetch, 5000);

        // Optional: socket.io live updates
        // const socket = io("http://localhost:5000");
        // socket.emit("joinOrderRoom", orderId);
        // socket.on("orderUpdated", (updatedOrder) => setOrder(updatedOrder));
        // return () => { socket.disconnect(); clearInterval(pollRef.current); };

        return () => clearInterval(pollRef.current);
    }, [orderId]);

    if (loading) return <div className="container my-5 text-center">Loading...</div>;

    const timeline = buildTimeline(order.status || "Order Placed");

    return (
        <div className="container my-5">
            <ScrollToTop />
            <h3>Track Order</h3>
            <p>Order ID: <strong>{order._id}</strong></p>
            <p>Estimated Delivery: <strong>{order.estimated || "Tomorrow, 5 PM"}</strong></p>

            <div className="mt-4">
                {timeline.map((t, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-3">
                        <div style={{
                            width: 28, height: 28, borderRadius: 14,
                            background: t.done ? "linear-gradient(90deg,#22c55e,#16a34a)" : "#e6e6e6",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: "#fff", marginRight: 12, transition: "all .3s ease"
                        }}>
                            {t.done ? "✓" : idx + 1}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600 }}>{t.label}</div>
                            <div style={{ fontSize: 13, color: "#666" }}>{t.done ? "Completed" : "Pending"}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card p-3 mt-4">
                <h6>Order Details</h6>
                <p className="mb-0">Current status: <strong>{order.status}</strong></p>
            </div>
        </div>
    );
}

