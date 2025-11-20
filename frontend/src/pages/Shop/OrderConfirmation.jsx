
// src/pages/Shop/OrderConfirmation.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import ScrollToTop from "../ScrollToTop";

/* ---------------------------------------
   If backend runs on PORT 5000,  
   set Axios baseURL globally here
----------------------------------------- */
axios.defaults.baseURL = "http://localhost:5000";

/*
Fallback demo order (if no order found)
*/
const demoOrder = {
    _id: "ORD123456",
    user: "USER123",
    items: [
        { name: "Haldiram's Sev Bhujia", qty: 1, price: 50 },
        { name: "NutriChoice Digestive", qty: 1, price: 20 },
        { name: "5 Star Chocolate", qty: 1, price: 15 },
    ],
    subtotal: 85,
    shipping: 5,
    tax: 0,
    total: 90,
    address: {
        firstName: "Vishal",
        lastName: "Kumar",
        addressLine1: "123 Main St",
        city: "Ahmedabad",
        state: "Gujarat",
        zipcode: "380015",
    },
    status: "Order Placed",
    createdAt: new Date().toISOString(),
};

export default function OrderConfirmation() {
    const navigate = useNavigate();
    const location = useLocation();
    const orderIdFromState = location.state?.orderId;
    const [order, setOrder] = useState(null);
    const [sendingEmail, setSendingEmail] = useState(false);

    // Fetch order
    useEffect(() => {
        const fetchOrder = async () => {
            if (orderIdFromState) {
                try {
                    const res = await axios.get(`/api/orders/${orderIdFromState}`);
                    setOrder(res.data.order);
                } catch (err) {
                    console.error("Order fetch error:", err);
                    setOrder(demoOrder);
                }
            } else {
                setOrder(demoOrder);
            }
        };

        fetchOrder();
    }, [orderIdFromState]);

    // Download Invoice
    const handleDownloadInvoice = () => {
        const invoiceHtml = generateInvoiceHtml(order || demoOrder);
        const popup = window.open("", "_blank");
        popup.document.write(invoiceHtml);
        popup.document.close();
        popup.focus();
    };

    const generateInvoiceHtml = (o) => {
        const rows = (o.items || [])
            .map(
                (it) => `
        <tr>
          <td style="padding:8px;border:1px solid #ddd">${it.name}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:center">${it.qty}</td>
          <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${it.price}</td>
        </tr>
      `
            )
            .join("");

        return `
      <html>
      <head><title>Invoice - ${o._id}</title></head>
      <body style="font-family:Arial;margin:20px;">
        <h2>Invoice</h2>
        <p>Order ID: <strong>${o._id}</strong></p>

        <table style="border-collapse:collapse;width:100%;max-width:700px">
          <thead>
            <tr>
              <th style="padding:8px;border:1px solid #ddd;text-align:left">Item</th>
              <th style="padding:8px;border:1px solid #ddd">Qty</th>
              <th style="padding:8px;border:1px solid #ddd;text-align:right">Price</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr>
              <td colspan="2" style="padding:8px;border:1px solid #ddd;text-align:right">Subtotal</td>
              <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${o.subtotal}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px;border:1px solid #ddd;text-align:right">Shipping</td>
              <td style="padding:8px;border:1px solid #ddd;text-align:right">₹${o.shipping}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding:8px;border:1px solid #ddd;text-align:right"><strong>Total</strong></td>
              <td style="padding:8px;border:1px solid #ddd;text-align:right"><strong>₹${o.total}</strong></td>
            </tr>
          </tbody>
        </table>

        <h4>Delivery Address</h4>
        <p>${o.address.firstName} ${o.address.lastName}<br/>
        ${o.address.addressLine1}<br/>
        ${o.address.city}, ${o.address.state} - ${o.address.zipcode}</p>

        <script>setTimeout(() => { window.print(); }, 500);</script>
      </body>
      </html>
    `;
    };

    // Send confirmation email
    const handleSendEmail = async () => {
        if (!order) return;

        setSendingEmail(true);
        try {
            await axios.post("/api/orders/send-confirmation-email", {
                orderId: order._id,
            });
            alert("Confirmation email sent!");
        } catch (err) {
            console.error("Email sending error:", err);
            alert("Failed to send email.");
        } finally {
            setSendingEmail(false);
        }
    };

    if (!order) {
        return (
            <div className="container my-5 text-center">
                <ScrollToTop />
                <p>Loading order...</p>
            </div>
        );
    }

    return (
        <div className="container my-5">
            <ScrollToTop />

            <div className="text-center mb-4">
                <img
                    src="https://cdn-icons-png.flaticon.com/512/190/190411.png"
                    width={96}
                    alt="success"
                />
                <h2 className="mt-3 text-success">Order Confirmed</h2>
                <p className="text-muted">
                    Order ID: <strong>#{order._id}</strong>
                </p>
            </div>

            <div className="row g-4">
                {/* Left Section */}
                <div className="col-md-7">
                    <div className="card p-3 mb-3">
                        <h5>Items</h5>
                        <ul className="list-group">
                            {(order.items || []).map((it, idx) => (
                                <li
                                    key={idx}
                                    className="list-group-item d-flex justify-content-between"
                                >
                                    <div>
                                        <strong>{it.name}</strong>
                                        <br />
                                        <small className="text-muted">Qty: {it.qty}</small>
                                    </div>
                                    <div>₹{it.price}</div>
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

                    <div className="card p-3">
                        <h5>Delivery Address</h5>
                        <p>
                            {order.address.firstName} {order.address.lastName}
                            <br />
                            {order.address.addressLine1}
                            <br />
                            {order.address.city}, {order.address.state} -{" "}
                            {order.address.zipcode}
                        </p>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-md-5">
                    <div className="card p-3 mb-3 text-center">
                        <h5 className="mb-2">Next Steps</h5>

                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-outline-primary"
                                onClick={handleDownloadInvoice}
                            >
                                Download / Print Invoice
                            </button>

                            <button
                                className="btn btn-outline-secondary"
                                onClick={() =>
                                    navigate(`/track-order?orderId=${order._id}`)
                                }
                            >
                                Track Order
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={handleSendEmail}
                                disabled={sendingEmail}
                            >
                                {sendingEmail ? "Sending..." : "Send Confirmation Email"}
                            </button>

                            <Link to="/Shop" className="btn btn-light">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    <div className="card p-3">
                        <h6>Status</h6>
                        <div className="badge bg-info text-dark">{order.status}</div>
                        <p className="mt-2 text-muted">
                            Placed: {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes pop {
          from { transform: translateY(8px) scale(.98); opacity: 0 }
          to { transform: translateY(0) scale(1); opacity: 1 }
        }
      `}</style>
        </div>
    );
}
