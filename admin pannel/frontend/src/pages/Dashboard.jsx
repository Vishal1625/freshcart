/* ---------------- ANALYTICS DASHBOARD ---------------- */

import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChartCard from "../components/ChartCard";
import axios from "axios";

export default function AnalyticsDashboard() {
    const [user, setUser] = useState(null);
    const [heatmapPoints, setHeatmapPoints] = useState([]);
    const [topCities, setTopCities] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const [heatRes, citiesRes] = await Promise.all([
                axios.get("http://localhost:5000/api/analytics/heatmap", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get("http://localhost:5000/api/analytics/top-cities", {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            setHeatmapPoints(heatRes.data || []);
            setTopCities(citiesRes.data || []);
        } catch (err) {
            console.error("Analytics Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const normalizePoints = () => {
        if (!heatmapPoints.length) return [];

        const lats = heatmapPoints.map((p) => p.lat);
        const lngs = heatmapPoints.map((p) => p.lng);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        return heatmapPoints.map((p) => ({
            ...p,
            top: maxLat === minLat ? 50 : ((maxLat - p.lat) / (maxLat - minLat)) * 100,
            left: maxLng === minLng ? 50 : ((p.lng - minLng) / (maxLng - minLng)) * 100,
        }));
    };

    const normalizedHeat = normalizePoints();

    return (
        <div style={{ display: "flex" }}>
            <Sidebar onLogout={doLogout} />
            <div style={{ flex: 1 }}>
                <Topbar user={user} />

                <div style={{ padding: 18 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 16,
                        }}
                    >
                        <h2>Analytics Dashboard</h2>
                        <button
                            onClick={fetchAnalytics}
                            style={{
                                background: "#0aad0a",
                                border: "none",
                                color: "#fff",
                                padding: "6px 12px",
                                borderRadius: 8,
                                cursor: "pointer",
                            }}
                        >
                            Refresh
                        </button>
                    </div>

                    {/* HEATMAP */}
                    <div
                        style={{
                            background: "#fff",
                            padding: 18,
                            borderRadius: 12,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            marginBottom: 18,
                        }}
                    >
                        <h3>Order Heatmap (approx)</h3>
                        <p style={{ fontSize: 13, color: "#666" }}>
                            Each dot represents a cluster of orders based on customer location.
                        </p>

                        <div
                            style={{
                                position: "relative",
                                height: 350,
                                background:
                                    "linear-gradient(135deg, #e0f7fa, #f1f8e9, #fff3e0)",
                                borderRadius: 12,
                                overflow: "hidden",
                            }}
                        >
                            {normalizedHeat.map((p, idx) => {
                                const size = Math.min(60, 15 + p.count * 3);
                                return (
                                    <div
                                        key={idx}
                                        style={{
                                            position: "absolute",
                                            top: `${p.top}%`,
                                            left: `${p.left}%`,
                                            transform: "translate(-50%, -50%)",
                                            width: size,
                                            height: size,
                                            borderRadius: "50%",
                                            background:
                                                "radial-gradient(circle, rgba(255,0,0,0.85), rgba(255,0,0,0))",
                                        }}
                                        title={`Orders: ${p.count}`}
                                    />
                                );
                            })}

                            {!heatmapPoints.length && !loading && (
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#777",
                                    }}
                                >
                                    No location data available.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* TOP CITIES + SALES CHART */}
                    <div style={{ display: "flex", gap: 16 }}>
                        <div
                            style={{
                                flex: 1,
                                background: "#fff",
                                padding: 18,
                                borderRadius: 12,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            }}
                        >
                            <h3>Top Cities by Orders</h3>
                            <table width="100%">
                                <thead>
                                    <tr style={{ background: "#f4f4f4" }}>
                                        <th style={{ padding: 6 }}>City</th>
                                        <th>Orders</th>
                                        <th>Total Sales</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topCities.map((c, i) => (
                                        <tr key={i}>
                                            <td style={{ padding: 6 }}>{c.city}</td>
                                            <td>{c.orders}</td>
                                            <td>₹{c.totalSales}</td>
                                        </tr>
                                    ))}

                                    {!loading && topCities.length === 0 && (
                                        <tr>
                                            <td colSpan={3} style={{ textAlign: "center", padding: 8 }}>
                                                No data available
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div style={{ flex: 1 }}>
                            <ChartCard
                                title="Top Cities by Sales"
                                data={topCities.map((c) => ({
                                    name: c.city,
                                    sales: c.totalSales,
                                }))}
                                dataKey="sales"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- DASHBOARD ---------------- */

export function Dashboard() {   // ← FIXED HERE ONLY
    const [user, setUser] = useState(null);
    const [overview, setOverview] = useState({
        products: 0,
        orders: 0,
        totalSales: 0,
        todayOrders: 0,
        todayRevenue: 0,
        customers: 0,
        lowStock: 0,
        pendingOrders: 0,
        processingOrders: 0,
        shippedOrders: 0,
        deliveredOrders: 0,
    });
    const [chartData, setChartData] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);

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

    const refreshData = () => {
        loadOverview();
        loadChart();
        loadRecentOrders();
    };

    useEffect(() => {
        refreshData();
    }, []);

    const loadOverview = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/dashboard/overview");
            setOverview(res.data);
        } catch (err) {
            console.error("Overview API Error:", err);
        }
    };

    const loadChart = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/dashboard/sales-graph");
            setChartData(res.data);
        } catch (err) {
            console.error("Chart API Error:", err);
        }
    };

    const loadRecentOrders = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/dashboard/recent-orders");
            setRecentOrders(res.data.orders || []);
        } catch (err) {
            console.error("Recent Orders Error:", err);
        }
    };

    const StatCard = ({ title, value, icon, color }) => (
        <div
            style={{
                flex: 1,
                background: "#fff",
                padding: 18,
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                display: "flex",
                alignItems: "center",
                gap: 14,
            }}
        >
            <div
                style={{
                    background: color,
                    padding: 12,
                    borderRadius: 10,
                    color: "#fff",
                }}
            >
                {icon}
            </div>

            <div>
                <span style={{ fontSize: 14, color: "#666" }}>{title}</span>
                <h2 style={{ margin: 0, fontSize: 24 }}>{value}</h2>
            </div>
        </div>
    );

    return (
        <div style={{ display: "flex" }}>
            <Sidebar onLogout={doLogout} />

            <div style={{ flex: 1 }}>
                <Topbar user={user} />

                <div style={{ padding: 18 }}>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                        <button
                            onClick={refreshData}
                            style={{
                                background: "#0aad0a",
                                color: "#fff",
                                padding: "8px 14px",
                                borderRadius: 8,
                                border: "none",
                                fontWeight: "bold",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                            }}
                        >
                            <Refresh fontSize="small" /> Refresh
                        </button>
                    </div>

                    {/* ROW 1 */}
                    <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                        <StatCard
                            title="Total Products"
                            value={overview.products}
                            icon={<Inventory2 />}
                            color="#4c84ff"
                        />
                        <StatCard
                            title="Total Orders"
                            value={overview.orders}
                            icon={<ShoppingCart />}
                            color="#ff851b"
                        />
                        <StatCard
                            title="Total Sales"
                            value={`₹${overview.totalSales}`}
                            icon={<CurrencyRupee />}
                            color="#2ecc71"
                        />
                    </div>

                    {/* ROW 2 */}
                    <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
                        <StatCard
                            title="Today Orders"
                            value={overview.todayOrders}
                            icon={<Assignment />}
                            color="#00b894"
                        />
                        <StatCard
                            title="Today Revenue"
                            value={`₹${overview.todayRevenue}`}
                            icon={<CurrencyRupee />}
                            color="#d63031"
                        />
                        <StatCard
                            title="Customers"
                            value={overview.customers}
                            icon={<People />}
                            color="#0984e3"
                        />
                    </div>

                    {/* ROW 3 */}
                    <div style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                        <StatCard
                            title="Pending Orders"
                            value={overview.pendingOrders}
                            icon={<Assignment />}
                            color="#e17055"
                        />
                        <StatCard
                            title="Processing"
                            value={overview.processingOrders}
                            icon={<Assignment />}
                            color="#e67e22"
                        />
                        <StatCard
                            title="Shipped"
                            value={overview.shippedOrders}
                            icon={<LocalShipping />}
                            color="#00cec9"
                        />
                        <StatCard
                            title="Delivered"
                            value={overview.deliveredOrders}
                            icon={<LocalShipping />}
                            color="#55efc4"
                        />
                    </div>

                    <ChartCard title="Sales Analytics" data={chartData} dataKey="sales" />

                    <div
                        style={{
                            background: "#fff",
                            padding: 18,
                            borderRadius: 12,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            marginTop: 18,
                        }}
                    >
                        <h2 style={{ marginBottom: 10, fontSize: 20 }}>Recent Orders</h2>

                        <table width="100%">
                            <thead>
                                <tr style={{ background: "#f4f4f4" }}>
                                    <th style={{ padding: 8 }}>Order ID</th>
                                    <th>Customer</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {recentOrders.map((o) => (
                                    <tr key={o._id}>
                                        <td style={{ padding: 8 }}>{o.orderId}</td>
                                        <td>{o.customerName}</td>
                                        <td>₹{o.total}</td>
                                        <td>
                                            <span
                                                style={{
                                                    background:
                                                        o.status === "Delivered"
                                                            ? "#0aad0a"
                                                            : o.status === "Shipped"
                                                                ? "#2980b9"
                                                                : o.status === "Processing"
                                                                    ? "#f1c40f"
                                                                    : "#e74c3c",
                                                    padding: "4px 10px",
                                                    borderRadius: 30,
                                                    color: "#fff",
                                                    fontSize: 12,
                                                }}
                                            >
                                                {o.status}
                                            </span>
                                        </td>
                                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}

                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} style={{ textAlign: "center", padding: 10 }}>
                                            No recent orders found
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
