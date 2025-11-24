import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Divider,
    Table,
    TableHead,
    TableCell,
    TableRow,
    TableBody,
    Button,
    Chip,
    Grid,
    IconButton,
} from "@mui/material";

import { ArrowBack, Print, WhatsApp, Description } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

export default function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logo, setLogo] = useState(null);

    const COMPANY = {
        name: "freshcart",
        address: "123 Pet Lane, Mumbai, India",
        phone: "+91-9876543210",
        upiId: "7856000970@ybl",
        logoUrl: "/assets/logo.png",
    };

    // ------------------------ LOAD LOGO ------------------------
    useEffect(() => {
        const loadLogo = async () => {
            try {
                const res = await fetch(COMPANY.logoUrl);
                const blob = await res.blob();
                const reader = new FileReader();
                reader.onload = () => setLogo(reader.result);
                reader.readAsDataURL(blob);
            } catch { }
        };

        loadLogo();
    }, []);

    // ------------------------ FETCH ORDER ------------------------
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/checkout/orders/${id}`);
                const data = await res.json();
                setOrder(data.order);
            } catch (err) {
                console.log("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    if (loading) {
        return <Typography className="p-4">Loading order...</Typography>;
    }

    if (!order) {
        return <Typography className="p-4">Order not found</Typography>;
    }

    // ------------------------ UPDATE STATUS ------------------------
    const updateStatus = async (status) => {
        await fetch(`http://localhost:5000/api/checkout/orders/${order._id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        setOrder({ ...order, status });
    };

    // ------------------------ PDF Download ------------------------
    const downloadInvoice = async () => {
        const doc = new jsPDF({ unit: "pt", format: "a4" });

        if (logo) doc.addImage(logo, "PNG", 40, 30, 80, 40);

        doc.setFontSize(14);
        doc.text(COMPANY.name, 140, 40);
        doc.setFontSize(10);
        doc.text(COMPANY.address, 140, 58);

        doc.setFontSize(12);
        doc.text(`Invoice`, 40, 120);
        doc.text(`Order ID: ${order.orderId}`, 40, 136);

        autoTable(doc, {
            startY: 180,
            head: [["Product", "Qty", "Price"]],
            body: order.items.map((i) => [i.name, i.qty, `₹${i.price}`]),
        });

        doc.text(`Total: ₹${order.total}`, 40, doc.lastAutoTable.finalY + 30);

        const qrUrl = await QRCode.toDataURL(
            `upi://pay?pa=${COMPANY.upiId}&pn=${COMPANY.name}&am=${order.total}`
        );

        doc.addImage(qrUrl, "PNG", 40, doc.lastAutoTable.finalY + 50, 80, 80);

        doc.save(`invoice-${order.orderId}.pdf`);
    };

    // ------------------------ WhatsApp Share ------------------------
    const shareWhatsApp = () => {
        const msg = `
Order ID: ${order.orderId}
Customer: ${order.customerName}
Total: ₹${order.total}
Status: ${order.status}
    `;
        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    };

    // ------------------------ UI ------------------------
    return (
        <Box p={3}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate("/admin/orders")}
                variant="outlined"
                sx={{ mb: 2 }}
            >
                Back
            </Button>

            <Typography variant="h4" fontWeight="bold">
                Order Details
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
                {/* Left Side */}
                <Grid item md={8} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" mb={1}>
                                Order #{order.orderId}
                            </Typography>

                            <Chip
                                label={order.status}
                                color={
                                    order.status === "Delivered"
                                        ? "success"
                                        : order.status === "Shipped"
                                            ? "info"
                                            : order.status === "Processing"
                                                ? "warning"
                                                : "error"
                                }
                                sx={{ mb: 2 }}
                            />

                            {/* Items Table */}
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Price</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {order.items.map((it, i) => (
                                        <TableRow key={i}>
                                            <TableCell>{it.name}</TableCell>
                                            <TableCell>{it.qty}</TableCell>
                                            <TableCell>₹{it.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6">
                                Total: <b>₹{order.total}</b>
                            </Typography>
                        </CardContent>
                    </Card>

                    {/* Status Update Buttons */}
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" mb={2}>
                                Update Status
                            </Typography>

                            <Button
                                sx={{ mr: 1 }}
                                variant="outlined"
                                onClick={() => updateStatus("Processing")}
                            >
                                Processing
                            </Button>
                            <Button
                                sx={{ mr: 1 }}
                                variant="outlined"
                                onClick={() => updateStatus("Shipped")}
                            >
                                Shipped
                            </Button>
                            <Button
                                sx={{ mr: 1 }}
                                variant="contained"
                                color="success"
                                onClick={() => updateStatus("Delivered")}
                            >
                                Delivered
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Side */}
                <Grid item md={4} xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Customer Info</Typography>
                            <Typography>{order.customerName}</Typography>
                            <Typography>Phone: {order.mobile}</Typography>
                            <Typography mt={2} variant="h6">
                                Address
                            </Typography>
                            <Typography>
                                {order.address.addressLine1} <br />
                                {order.address.city}, {order.address.state} -{" "}
                                {order.address.zipcode}
                            </Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6">Actions</Typography>

                            <IconButton onClick={downloadInvoice}>
                                <Description />
                            </IconButton>

                            <IconButton onClick={shareWhatsApp}>
                                <WhatsApp />
                            </IconButton>

                            <IconButton onClick={() => window.print()}>
                                <Print />
                            </IconButton>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
