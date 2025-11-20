import React, { useEffect, useState } from "react";
import { getOrdersAnalytics } from "../services/orderService";
import ChartCard from "../components/ChartCard";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState({ daily: 0, monthly: 0 });

  useEffect(() => {
    async function fetchAnalytics() {
      const data = await getOrdersAnalytics();
      setAnalytics(data);
    }
    fetchAnalytics();
  }, []);

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>
      <div className="analytics-cards">
        <ChartCard title="Daily Orders" value={analytics.daily} />
        <ChartCard title="Monthly Orders" value={analytics.monthly} />
      </div>
    </div>
  );
};

export default Dashboard;
