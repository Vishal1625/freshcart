

import React, { useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Stack,
    Typography,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    CircularProgress,
    Divider,
} from "@mui/material";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function OrderStatusUpdate() {
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [order, setOrder] = useState(null);

    const [status, setStatus] = useState("");

    const fetchOrder = async () => {
        if (!orderId.trim()) {
            alert("Please enter Order ID");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${orderId}`);
            const data = await res.json();

            if (!data || data.error) {
                alert("Order not found");
                setOrder(null);
            } else {
                setOrder(data);
                setStatus(data.status);
            }
        } catch (err) {
            alert("Error fetching order");
        }
        setLoading(false);
    };

    const updateStatus = async () => {
        if (!status) {
            alert("Select a status");
            return;
        }

        try {
            await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            alert("Order status updated!");
            fetchOrder();
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1, background: "#f8fafc", minHeight: "100vh" }}>
                <Topbar />

                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Update Order Status
                    </Typography>

                    <Paper sx={{ p: 3 }}>
                        <Stack spacing={2} direction="row">
                            <TextField
                                label="Enter Order ID"
                                fullWidth
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                            />

                            <Button variant="contained" onClick={fetchOrder} disabled={loading}>
                                {loading ? <CircularProgress size={22} /> : "Find Order"}
                            </Button>
                        </Stack>
                    </Paper>

                    {order && (
                        <Paper sx={{ p: 3, mt: 3 }}>
                            <Typography variant="h6">Order Details</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Typography><b>Order ID:</b> {order.id || order._id}</Typography>
                            <Typography><b>Name:</b> {order.customerName}</Typography>
                            <Typography><b>Mobile:</b> {order.mobile}</Typography>
                            <Typography><b>Address:</b> {order.address}</Typography>
                            <Typography><b>Total:</b> ₹{order.total}</Typography>

                            <Typography sx={{ mt: 1 }}>
                                <b>Current Status:</b> {order.status}
                            </Typography>

                            <FormControl sx={{ mt: 2 }} fullWidth>
                                <InputLabel>Select New Status</InputLabel>
                                <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <MenuItem value="Pending">Pending</MenuItem>
                                    <MenuItem value="Processing">Processing</MenuItem>
                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                    <MenuItem value="Delivered">Delivered</MenuItem>
                                </Select>
                            </FormControl>

                            <Button sx={{ mt: 2 }} variant="contained" onClick={updateStatus}>
                                Update Status
                            </Button>
                        </Paper>
                    )}
                </Box>
            </div>
        </div>
    );
}
