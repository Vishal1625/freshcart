

import React from "react";
import { Link } from "react-router-dom";

import {
    BsFillGridFill,
    BsListCheck,
    BsBoxSeam,
    BsPeopleFill,
    BsBarChartLineFill
} from "react-icons/bs";


export default function Sidebar() {
    return (
        <div
            style={{
                width: 260,
                background: "#0f172a",
                color: "#fff",
                padding: 18,
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                position: "sticky",
                top: 0,
            }}
        >
            {/* LOGO */}
            <div
                style={{
                    fontWeight: 700,
                    fontSize: 20,
                    marginBottom: 20,
                    textAlign: "center",
                }}
            >
                Fresh Cart
            </div>

            {/* NAV LINKS */}
            <nav style={{ flex: 1 }}>
                <Link to="/" style={link}>
                    <BsFillGridFill style={icon} /> Dashboard
                </Link>

                <Link to="/orders" style={link}>
                    <BsListCheck style={icon} /> Orders
                </Link>

                <Link to="/products" style={link}>
                    <BsBoxSeam style={icon} /> Products
                </Link>

                <Link to="/users" style={link}>
                    <BsPeopleFill style={icon} /> Users
                </Link>

                <Link to="/analytics" style={link}>
                    <BsBarChartLineFill style={icon} /> Analytics
                </Link>
            </nav>
        </div>
    );
}

const link = {
    display: "block",
    padding: "10px 12px",
    color: "#fff",
    textDecoration: "none",
    fontSize: 15,
};

const icon = { marginRight: 8 };  