import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import OrderDetail from "./pages/OrderDetail";

import Dashboard from "./pages/Dashboard.jsx";
import Analytics from "./pages/Analytics.jsx";
import Products from "./pages/Products.jsx";
import Orders from "./pages/orders.jsx";
import Users from "./pages/Users.jsx";
import OrderStatusUpdate from "./pages/OrderStatusUpdate.jsx";

const App = () => {

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get("http://localhost:5000");
                console.log(res.data);
            } catch (error) {
                console.log("Server error:", error.message);
            }
        };

        getData();
    }, []);

    return (
        <Routes>
            {/* Auth screens */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/orders/:id" element={<OrderDetail />} />

            {/* Protected routes */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/analytics"
                element={
                    <ProtectedRoute>
                        <Analytics />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/products"
                element={
                    <ProtectedRoute>
                        <Products />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <Orders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/order-status-update"
                element={
                    <ProtectedRoute>
                        <OrderStatusUpdate />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/users"
                element={
                    <ProtectedRoute>
                        <Users />
                    </ProtectedRoute>
                }
            />

            {/* Default redirect */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};

export default App;
