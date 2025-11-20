
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChartCard from "../components/ChartCard";
import axios from "axios";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [overview, setOverview] = useState({
        products: 0,
        orders: 0,
        totalSales: 0,
    });
    const [chartData, setChartData] = useState([]);

    // Load user from localStorage safely
    useEffect(() => {
        try {
            const storedUser = JSON.parse(localStorage.getItem("authUser"));
            setUser(storedUser);
        } catch (error) {
            setUser(null);
        }
    }, []);

    const doLogout = () => {
        localStorage.removeItem("authUser");
        localStorage.removeItem("loggedIn");
        window.location.href = "/login";
    };

    useEffect(() => {
        loadOverview();
        loadChart();
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

    return (
        <div style={{ display: "flex" }}>
            <Sidebar onLogout={doLogout} />

            <div style={{ flex: 1 }}>
                <Topbar user={user} />

                <div style={{ padding: 18 }}>
                    {/* Overview Cards */}
                    <div style={{ display: "flex", gap: 12, marginBottom: 18 }}>
                        <div style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 10 }}>
                            Products<br /><h2>{overview.products}</h2>
                        </div>

                        <div style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 10 }}>
                            Orders<br /><h2>{overview.orders}</h2>
                        </div>

                        <div style={{ flex: 1, background: "#fff", padding: 16, borderRadius: 10 }}>
                            Total Sales<br /><h2>₹{overview.totalSales}</h2>
                        </div>
                    </div>

                    {/* Chart */}
                    <ChartCard title="Sales" data={chartData} dataKey="sales" />
                </div>
            </div>
        </div>
    );
}
