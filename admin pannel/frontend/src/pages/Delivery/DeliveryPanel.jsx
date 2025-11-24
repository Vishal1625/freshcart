import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    List,
    ListItem,
    Divider,
} from "@mui/material";
import RoomIcon from "@mui/icons-material/Room";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";

const apiBase = "http://localhost:5000";

const DeliveryPanel = () => {
    const [orders, setOrders] = useState([]);
    const [locStatus, setLocStatus] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${apiBase}/api/orders/delivery/my-orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (err) {
            console.error("Delivery orders error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await fetch(`${apiBase}/api/orders/delivery/update-status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ orderId, status })
            });

            const data = await res.json();

            if (data.success) {
                alert(`Status updated to ${status}`);
                fetchOrders();
            } else {
                alert(data.msg || "Failed to update status");
            }
        } catch (err) {
            alert("Server error");
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateLocation = () => {
        if (!navigator.geolocation) {
            setLocStatus("Geolocation not supported");
            return;
        }

        setLocStatus("Getting your current location...");

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(`${apiBase}/api/orders/delivery/location`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ lat: latitude, lng: longitude }),
                    });

                    const data = await res.json();

                    if (data.success) setLocStatus("✔ Location updated");
                    else setLocStatus("❌ Location update failed");
                } catch (err) {
                    setLocStatus("❌ Failed to update location");
                }
            },
            () => setLocStatus("Location permission denied.")
        );
    };

    const openMaps = (order) => {
        if (order.address?.lat && order.address?.lng) {
            window.open(
                `https://www.google.com/maps?q=${order.address.lat},${order.address.lng}`,
                "_blank"
            );
        } else {
            alert("Address not available");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "success";
            case "Out for Delivery":
                return "warning";
            case "Picked":
                return "info";
            default:
                return "default";
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f3f4f6" }}>

            {/* HEADER */}
            <Box sx={{
                background: "#0aad0a",
                color: "#fff",
                px: 2,
                py: 2.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                position: "sticky",
                top: 0,
                zIndex: 10,
            }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                    <DeliveryDiningIcon />
                    <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                            Delivery Panel
                        </Typography>
                        <Typography sx={{ fontSize: 12, opacity: 0.9 }}>
                            Orders assigned to you
                        </Typography>
                    </Box>
                </Box>

                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        background: "#fff",
                        color: "#0aad0a",
                        textTransform: "none",
                        fontSize: 11,
                    }}
                    onClick={fetchOrders}
                    startIcon={<RefreshIcon sx={{ fontSize: 16 }} />}
                >
                    Refresh
                </Button>
            </Box>

            {/* BODY */}
            <Box sx={{ p: 1.5, maxWidth: 600, mx: "auto", pb: 9 }}>
                {locStatus && (
                    <Card sx={{ mb: 1.5, background: "#e8f5e9" }}>
                        <CardContent sx={{ py: 1.2 }}>
                            <Typography sx={{ fontSize: 13 }}>{locStatus}</Typography>
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <Typography>Loading orders...</Typography>
                ) : orders.length === 0 ? (
                    <Typography>No orders assigned</Typography>
                ) : (
                    <Card>
                        <CardContent sx={{ p: 0 }}>
                            <List disablePadding>
                                {orders.map((o, idx) => (
                                    <React.Fragment key={o._id}>
                                        <ListItem sx={{ flexDirection: "column", alignItems: "stretch" }}>
                                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                <Typography>#{o.orderId}</Typography>
                                                <Chip
                                                    label={o.status}
                                                    size="small"
                                                    color={getStatusColor(o.status)}
                                                />
                                            </Box>

                                            <Typography mt={1}>{o.customerName}</Typography>
                                            <Typography sx={{ fontSize: 12 }}>{o.address?.addressLine1}</Typography>

                                            {/* STATUS BUTTONS */}
                                            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ flex: 1 }}
                                                    onClick={() => updateOrderStatus(o.orderId, "Picked")}
                                                >
                                                    Picked
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ flex: 1 }}
                                                    onClick={() => updateOrderStatus(o.orderId, "Out for Delivery")}
                                                >
                                                    Out for Delivery
                                                </Button>

                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    sx={{ flex: 1 }}
                                                    onClick={() => updateOrderStatus(o.orderId, "Delivered")}
                                                >
                                                    Delivered
                                                </Button>
                                            </Box>

                                            <Button
                                                size="small"
                                                variant="outlined"
                                                sx={{ mt: 1 }}
                                                onClick={() => openMaps(o)}
                                                startIcon={<RoomIcon />}
                                            >
                                                Open in Maps
                                            </Button>
                                        </ListItem>

                                        {idx !== orders.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                )}
            </Box>

            {/* BOTTOM BAR */}
            <Box sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: "#fff",
                borderTop: "1px solid #ddd",
                py: 1,
                display: "flex",
                gap: 1,
                maxWidth: 600,
                mx: "auto",
            }}>
                <Button fullWidth variant="outlined" onClick={fetchOrders}>
                    Refresh
                </Button>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={updateLocation}
                    startIcon={<RoomIcon />}
                >
                    Update Location
                </Button>
            </Box>
        </Box>
    );
};

export default DeliveryPanel;
