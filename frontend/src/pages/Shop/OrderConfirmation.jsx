// src/pages/Shop/OrderConfirmation.jsx

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "../ScrollToTop";
import confetti from "canvas-confetti";

// Base URL
axios.defaults.baseURL = "http://localhost:5000";

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderIdFromState = location.state?.orderId;

    const [order, setOrder] = useState(null);
    const [sendingEmail, setSendingEmail] = useState(false);

    // -------------------------------
    // Fetch Order
    // -------------------------------
    useEffect(() => {
        if (!orderIdFromState) {
            navigate("/shop");
            return;
        }

        const fetchOrder = async () => {
            try {
                const res = await axios.get(`/api/orders/${orderIdFromState}`);
                setOrder(res.data.order);

                // Celebration Effect
                setTimeout(() => {
                    confetti({ particleCount: 200, spread: 80 });
                }, 800);

            } catch (err) {
                console.error("Order fetch error:", err);
            }
        };

        fetchOrder();
    }, [orderIdFromState]);

    // -------------------------------
    // Download Invoice
    // -------------------------------
    const handleDownloadInvoice = () => {
        window.open(`/api/orders/invoice/${order._id}`, "_blank");
    };

    // -------------------------------
    // Email Confirmation
    // -------------------------------
    const handleSendEmail = async () => {
        try {
            setSendingEmail(true);
            await axios.post("/api/orders/send-confirmation-email", {
                orderId: order._id,
            });
            alert("Email sent successfully!");
        } catch (err) {
            alert("Failed to send email");
        } finally {
            setSendingEmail(false);
        }
    };

    // -------------------------------
    // Re-order Feature
    // -------------------------------
    const handleReOrder = async () => {
        try {
            await axios.post("/api/orders/reorder", {
                orderId: order._id,
            });
            alert("Items added to cart!");
            navigate("/shopcart");
        } catch (err) {
            console.log(err);
        }
    };

    if (!order) {
        return (
            <div className="container text-center my-5">
                <ScrollToTop />
                <p>Loading your order...</p>
            </div>
        );
    }

    const estDelivery = new Date();
    estDelivery.setDate(estDelivery.getDate() + 3);

    return (
        <div className="container my-5">
            <ScrollToTop />

            {/* Success Icon */}
            <div className="text-center mb-4">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                    width={90}
                    alt="success"
                />
                <h2 className="text-success mt-3">Order Confirmed 🎉</h2>
                <p className="text-muted">
                    Order ID: <strong>#{order._id}</strong>
                </p>
                <p className="text-primary">
                    Estimated Delivery: <strong>{estDelivery.toDateString()}</strong>
                </p>
            </div>

            <div className="row g-4">
                {/* Left Section */}
                <div className="col-md-7">

                    {/* Items Card */}
                    <div className="card p-3 mb-3 shadow-sm">
                        <h5>Order Items</h5>
                        <ul className="list-group">
                            {order.items.map((item, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between">
                                    <div>
                                        <strong>{item.name}</strong>
                                        <br />
                                        <small className="text-muted">Qty: {item.qty}</small>
                                    </div>
                                    <div>₹{item.price}</div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-3 text-end">
                            <div>Subtotal: ₹{order.subtotal}</div>
                            <div>Shipping: ₹{order.shipping}</div>
                            <div className="fs-5">
                                <strong>Total: ₹{order.total}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="card p-3 shadow-sm">
                        <h5>Delivery Address</h5>
                        <p className="mb-0">
                            {order.address.firstName} {order.address.lastName} <br />
                            {order.address.addressLine1} <br />
                            {order.address.city}, {order.address.state} - {order.address.zipcode}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-md-5">

                    {/* Action Buttons */}
                    <div className="card p-3 mb-3 text-center shadow-sm">
                        <h5>Next Steps</h5>

                        <div className="d-grid gap-2">
                            <button className="btn btn-outline-primary" onClick={handleDownloadInvoice}>
                                Download Invoice (PDF)
                            </button>

                            <button className="btn btn-outline-secondary" onClick={() => navigate(`/track-order/${order._id}`)}>
                                Track Order
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={handleSendEmail}
                                disabled={sendingEmail}
                            >
                                {sendingEmail ? "Sending Email..." : "Send Confirmation Email"}
                            </button>

                            <button className="btn btn-warning text-dark" onClick={handleReOrder}>
                                Re-Order Items
                            </button>

                            <Link to="/shop" className="btn btn-light">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Status Card */}
                    <div className="card p-3 shadow-sm">
                        <h6>Order Status</h6>
                        <span className="badge bg-info text-dark">{order.status}</span>

                        <p className="mt-2 text-muted">
                            Placed on: {new Date(order.createdAt).toLocaleString()}
                        </p>

                        <h6 className="mt-3">Payment</h6>
                        <p className="mb-1">
                            Method: <strong>{order.paymentInfo?.method}</strong>
                        </p>
                        <p className="mb-0">
                            Status:{" "}
                            <span className="badge bg-success">{order.paymentInfo?.status}</span>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        .card {
          animation: fadeIn .4s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}
