import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import axios from "axios";

export default function Offers() {
    const [user, setUser] = useState(null);
    const [offers, setOffers] = useState([]);
    const [form, setForm] = useState({
        code: "",
        description: "",
        type: "PERCENT",
        value: 10,
        minCartAmount: 0,
        maxDiscount: 0,
        startDate: "",
        endDate: "",
        active: true,
    });
    const [editingId, setEditingId] = useState(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("authUser"));
            setUser(storedUser);
        } catch {
            setUser(null);
        }
    }, []);

    const doLogout = () => {
        localStorage.removeItem("authUser");
        localStorage.removeItem("loggedIn");
        window.location.href = "/login";
    };

    const loadOffers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/offers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setOffers(res.data.offers || []);
        } catch (err) {
            console.error("Offers load error:", err);
        }
    };

    useEffect(() => {
        loadOffers();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const resetForm = () => {
        setForm({
            code: "",
            description: "",
            type: "PERCENT",
            value: 10,
            minCartAmount: 0,
            maxDiscount: 0,
            startDate: "",
            endDate: "",
            active: true,
        });
        setEditingId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await axios.put(
                    `http://localhost:5000/api/offers/${editingId}`,
                    form,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                alert("Offer updated");
            } else {
                await axios.post("http://localhost:5000/api/offers", form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Offer created");
            }

            resetForm();
            loadOffers();
        } catch (err) {
            console.error("Offer save error:", err);
            alert("Error saving offer");
        }
    };

    const editOffer = (offer) => {
        setEditingId(offer._id);
        setForm({
            code: offer.code,
            description: offer.description || "",
            type: offer.type,
            value: offer.value,
            minCartAmount: offer.minCartAmount || 0,
            maxDiscount: offer.maxDiscount || 0,
            startDate: offer.startDate ? offer.startDate.slice(0, 10) : "",
            endDate: offer.endDate ? offer.endDate.slice(0, 10) : "",
            active: offer.active,
        });
    };

    const toggleActive = async (offer) => {
        try {
            await axios.put(
                `http://localhost:5000/api/offers/${offer._id}`,
                { active: !offer.active },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            loadOffers();
        } catch (err) {
            console.error("Toggle active error:", err);
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar onLogout={doLogout} />

            <div style={{ flex: 1 }}>
                <Topbar user={user} />

                <div style={{ padding: 18 }}>
                    <h2>Offers / Coupons</h2>

                    {/* FORM CARD */}
                    <div
                        style={{
                            background: "#fff",
                            padding: 16,
                            borderRadius: 12,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            marginBottom: 18,
                        }}
                    >
                        <h3 style={{ marginBottom: 10 }}>
                            {editingId ? "Edit Offer" : "Create New Offer"}
                        </h3>

                        <form onSubmit={handleSubmit}>
                            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label>Code</label>
                                    <input
                                        name="code"
                                        value={form.code}
                                        onChange={handleChange}
                                        className="form-control"
                                        placeholder="FRESH50"
                                        required
                                        disabled={!!editingId}
                                    />
                                </div>

                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label>Type</label>
                                    <select
                                        name="type"
                                        value={form.type}
                                        onChange={handleChange}
                                        className="form-control"
                                    >
                                        <option value="PERCENT">Percentage (%)</option>
                                        <option value="FLAT">Flat (₹)</option>
                                    </select>
                                </div>

                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label>Value</label>
                                    <input
                                        type="number"
                                        name="value"
                                        value={form.value}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />
                                </div>

                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label>Min Cart Amount</label>
                                    <input
                                        type="number"
                                        name="minCartAmount"
                                        value={form.minCartAmount}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label>Max Discount (optional)</label>
                                    <input
                                        type="number"
                                        name="maxDiscount"
                                        value={form.maxDiscount}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label>Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={form.startDate}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>

                                <div style={{ flex: 1, minWidth: 200 }}>
                                    <label>End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={form.endDate}
                                        onChange={handleChange}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: 8 }}>
                                <label style={{ marginRight: 8 }}>
                                    <input
                                        type="checkbox"
                                        name="active"
                                        checked={form.active}
                                        onChange={handleChange}
                                        style={{ marginRight: 4 }}
                                    />
                                    Active
                                </label>
                            </div>

                            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    style={{ padding: "6px 14px" }}
                                >
                                    {editingId ? "Update Offer" : "Create Offer"}
                                </button>

                                {editingId && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* LIST CARD */}
                    <div
                        style={{
                            background: "#fff",
                            padding: 16,
                            borderRadius: 12,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        }}
                    >
                        <h3 style={{ marginBottom: 10 }}>Existing Offers</h3>

                        <table width="100%">
                            <thead>
                                <tr style={{ background: "#f4f4f4" }}>
                                    <th style={{ padding: 6 }}>Code</th>
                                    <th>Type</th>
                                    <th>Value</th>
                                    <th>Min Cart</th>
                                    <th>Max Discount</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {offers.map((o) => (
                                    <tr key={o._id}>
                                        <td style={{ padding: 6 }}>{o.code}</td>
                                        <td>{o.type}</td>
                                        <td>
                                            {o.type === "PERCENT"
                                                ? `${o.value}%`
                                                : `₹${o.value}`}
                                        </td>
                                        <td>₹{o.minCartAmount || 0}</td>
                                        <td>
                                            {o.maxDiscount ? `₹${o.maxDiscount}` : "-"}
                                        </td>
                                        <td>
                                            <span
                                                style={{
                                                    padding: "2px 8px",
                                                    borderRadius: 20,
                                                    fontSize: 12,
                                                    color: "#fff",
                                                    background: o.active ? "#0aad0a" : "#888",
                                                }}
                                            >
                                                {o.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-1"
                                                onClick={() => editOffer(o)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => toggleActive(o)}
                                            >
                                                {o.active ? "Deactivate" : "Activate"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {offers.length === 0 && (
                                    <tr>
                                        <td colSpan={7} style={{ textAlign: "center", padding: 10 }}>
                                            No offers found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
