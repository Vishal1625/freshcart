import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireRole({ children, roles = [] }) {
    let user = null;
    let token = null;

    try {
        user = JSON.parse(localStorage.getItem("authUser"));
        token = localStorage.getItem("token");
    } catch (e) {
        user = null;
    }

    // Not logged in
    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    // If no roles provided → allow all logged-in users
    if (roles.length === 0) {
        return <>{children}</>;
    }

    // Role not matched → block
    if (!roles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}
