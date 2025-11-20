import React, { useEffect, useState } from "react";
import {
    Box,
    Paper,
    Table,
    TableRow,
    TableCell,
    TableBody,
    TableContainer,
    TableHead,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    IconButton,
    AppBar,
    Toolbar,
} from "@mui/material";

import { Print, WhatsApp, Description } from "@mui/icons-material";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loadingPdf, setLoadingPdf] = useState(false);
    const [companyLogoDataUrl, setCompanyLogoDataUrl] = useState(null);

    const COMPANY = {
        name: "freshcart",
        address: "123 Pet Lane, Mumbai, India",
        phone: "+91-9876543210",
        gstin: "27AAAAA0000A1Z5",
        upiId: "7856000970@ybl",
        logoUrl: "/assets/logo.png",
    };

    useEffect(() => {
        const loadLogo = async () => {
            try {
                const res = await fetch(COMPANY.logoUrl);
                if (!res.ok) return;
                const blob = await res.blob();
                const reader = new FileReader();
                reader.onload = () => setCompanyLogoDataUrl(reader.result);
                reader.readAsDataURL(blob);
            } catch (e) {
                console.warn("Logo load failed", e);
            }
        };
        loadLogo();
    }, []);

    // ---------- FIXED BACKEND URL ----------
    const fetchOrders = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/checkout/orders");
            const data = await res.json();
            setOrders(data.orders || []);
        } catch (error) {
            console.error("Fetch Orders Error:", error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // ---------- FIXED STATUS UPDATE ROUTE ----------
    const updateStatus = async (id, status) => {
        try {
            const body = { status };
            if (status === "Delivered") {
                body.deliveredDate = new Date().toISOString();
            }

            await fetch(`http://localhost:5000/api/checkout/orders/${id}/status`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            fetchOrders();
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    const printSlip = () => {
        if (!selectedOrder) return;
        const printContent = document.getElementById("slip-area").innerHTML;
        const win = window.open("", "Print", "width=400,height=700");

        win.document.write(`
      <html>
        <head>
          <title>Order Slip</title>
          <style>
            body{font-family: Arial, sans-serif;}
            ul{padding-left: 18px}
          </style>
        </head>
        <body>${printContent}</body>
      </html>
    `);

        win.document.close();
        win.print();
    };

    // ======================================================
    // FIXED: PRINT THERMAL SLIP
    // ======================================================
    const printThermalSlip = () => {
        if (!selectedOrder) return;

        const widthPx = 360;
        const html = `
      <html>
        <head>
          <meta name="viewport" content="width=${widthPx}">
          <style>
            body{font-family: monospace; font-size:12px; margin:0; padding:8px; width:${widthPx}px}
            .center{text-align:center}
            .logo{max-width:120px; margin:0 auto 6px}
            .line{border-bottom:1px dashed #000; margin:6px 0}
            table{width:100%; border-collapse:collapse}
            td{vertical-align:top}
            .right{text-align:right}
          </style>
        </head>
        <body>
          ${companyLogoDataUrl ? `<div class="center"><img src="${companyLogoDataUrl}" class="logo"/></div>` : ''}
          <div class="center"><b>${COMPANY.name}</b></div>
          <div class="center">${COMPANY.address}</div>
          <div class="center">Phone: ${COMPANY.phone}</div>
          <div class="line"></div>

          <div>Order: ${selectedOrder.orderId}</div>
          <div>Customer: ${selectedOrder.customerName}</div>
          <div>Mobile: ${selectedOrder.mobile}</div>
          <div class="line"></div>

          <table>
            ${selectedOrder.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td class="right">${item.qty} x ₹${item.price}</td>
              </tr>
            `).join('')}
          </table>

          <div class="line"></div>
          <div><b>Total</b>: ₹${selectedOrder.total}</div>

          <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js"></script>
          <script>
            const upiText = "upi://pay?pa=${COMPANY.upiId}&pn=${encodeURIComponent(COMPANY.name)}&am=${selectedOrder.total}";
            QRCode.toDataURL(upiText).then(url => {
              const img = new Image();
              img.src = url;
              document.body.appendChild(img);
              window.print();
            }).catch(() => window.print());
          </script>
        </body>
      </html>
    `;

        const win = window.open("", "_blank", `width=${widthPx + 20},height=700`);
        win.document.open();
        win.document.write(html);
        win.document.close();
    };

    // ======================================================
    // PDF GENERATION
    // ======================================================
    const generatePdf = async (order) => {
        if (!order) return null;

        setLoadingPdf(true);
        try {
            const doc = new jsPDF({ unit: "pt", format: "a4" });

            if (companyLogoDataUrl) {
                doc.addImage(companyLogoDataUrl, "PNG", 40, 30, 80, 40);
            }

            doc.setFontSize(14);
            doc.text(COMPANY.name, 140, 40);
            doc.setFontSize(10);
            doc.text(COMPANY.address, 140, 58);

            doc.setFontSize(12);
            doc.text(`Invoice`, 40, 120);

            doc.text(`Order ID: ${order.orderId}`, 40, 136);
            doc.text(`Customer: ${order.customerName}`, 300, 136);

            const startY = 190;
            const tableBody = order.items.map(it => [
                it.name,
                String(it.qty),
                `₹${it.price}`,
            ]);

            autoTable(doc, {
                startY,
                head: [["Product", "Qty", "Price"]],
                body: tableBody,
            });

            const finalY = doc.lastAutoTable.finalY + 20;

            const upiPayload = `upi://pay?pa=${COMPANY.upiId}&pn=${encodeURIComponent(COMPANY.name)}&am=${order.total}`;
            const qrDataUrl = await QRCode.toDataURL(upiPayload);

            doc.text("Scan to Pay", 40, finalY);
            doc.addImage(qrDataUrl, "PNG", 40, finalY + 10, 80, 80);

            const blob = doc.output("blob");
            setLoadingPdf(false);
            return { blob, filename: `invoice-${order.orderId}.pdf` };
        } catch (err) {
            setLoadingPdf(false);
            console.error("PDF generation failed", err);
            return null;
        }
    };

    const downloadPDF = async () => {
        if (!selectedOrder) return;
        const out = await generatePdf(selectedOrder);
        if (!out) return;

        const url = URL.createObjectURL(out.blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = out.filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const shareWhatsApp = (order) => {
        const msg = `
🧾 Order Slip
Order ID: ${order.orderId}
Customer: ${order.customerName}
Total: ₹${order.total}
        `;

        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    };

    const sharePdfOnWhatsApp = async () => {
        if (!selectedOrder) return;

        const out = await generatePdf(selectedOrder);
        if (!out) return;

        const msg = `Invoice generated: ${out.filename}`;

        window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Topbar />

                <Box sx={{ p: 2 }}>
                    <AppBar position="static">
                        <Toolbar>
                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                Orders Admin
                            </Typography>
                        </Toolbar>
                    </AppBar>

                    <Paper sx={{ p: 2, mt: 2 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell>Mobile</TableCell>
                                        <TableCell>Total</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Slip</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {orders.map((o) => (
                                        <TableRow key={o._id}>
                                            <TableCell>{o.orderId}</TableCell>
                                            <TableCell>{o.customerName}</TableCell>
                                            <TableCell>{o.mobile}</TableCell>
                                            <TableCell>₹{o.total}</TableCell>

                                            <TableCell>
                                                <select
                                                    value={o.status}
                                                    onChange={(e) =>
                                                        updateStatus(o._id, e.target.value)
                                                    }
                                                >
                                                    <option>Pending</option>
                                                    <option>Processing</option>
                                                    <option>Shipped</option>
                                                    <option>Delivered</option>
                                                </select>
                                            </TableCell>

                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => setSelectedOrder(o)}
                                                >
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {orders.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} align="center">
                                                No Orders Found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Box>

                {selectedOrder && (
                    <Dialog
                        open
                        onClose={() => setSelectedOrder(null)}
                        fullWidth
                        maxWidth="sm"
                    >
                        <DialogTitle>Order Slip</DialogTitle>

                        <DialogContent>
                            <div id="slip-area">
                                <Typography><b>{COMPANY.name}</b></Typography>
                                <Typography>Order ID: {selectedOrder.orderId}</Typography>
                                <Typography>Name: {selectedOrder.customerName}</Typography>
                                <Typography>Total: ₹{selectedOrder.total}</Typography>

                                <Typography sx={{ mt: 2 }}><b>Products:</b></Typography>
                                <ul>
                                    {selectedOrder.items.map((item, i) => (
                                        <li key={i}>
                                            {item.name} × {item.qty} — ₹{item.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </DialogContent>

                        <DialogActions>
                            <IconButton onClick={printSlip}>
                                <Print />
                            </IconButton>

                            <IconButton onClick={() => shareWhatsApp(selectedOrder)}>
                                <WhatsApp />
                            </IconButton>

                            <IconButton onClick={downloadPDF}>
                                <Description />
                            </IconButton>

                            <Button onClick={printThermalSlip}>Thermal Print</Button>
                            <Button onClick={sharePdfOnWhatsApp}>Share PDF</Button>
                            <Button onClick={() => setSelectedOrder(null)}>Close</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </div>
        </div>
    );
}
