

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    TextField, InputLabel, MenuItem, FormControl, Select,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Avatar, Typography, Stack, Pagination, Chip, IconButton
} from "@mui/material";

import { Edit, Delete, Search } from "@mui/icons-material";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const ITEMS_PER_PAGE = 6;

export default function Products() {

    const [products, setProducts] = useState([]);
    const [pageCount, setPageCount] = useState(1);

    const [form, setForm] = useState({
        name: "", category: "", price: "", stock: ""
    });

    const [file, setFile] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [page, setPage] = useState(1);

    const [editOpen, setEditOpen] = useState(false);
    const [editData, setEditData] = useState(null);
    const [editFile, setEditFile] = useState(null);

    /* ============================================================
       LOAD PRODUCTS
    ============================================================ */
    const loadProducts = async () => {
        try {
            const activeCategory = categoryFilter === "all" ? "" : categoryFilter;

            const res = await axios.get(
                `http://localhost:5000/api/products?search=${searchText}&category=${activeCategory}&page=${page}&limit=${ITEMS_PER_PAGE}`
            );

            setProducts(res.data.products || []);
            setPageCount(Math.ceil((res.data.total || 1) / ITEMS_PER_PAGE));
        } catch (err) {
            console.error("LoadProducts Error:", err);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [searchText, categoryFilter, page]);

    /* ============================================================
       UNIQUE CATEGORIES
    ============================================================ */
    const categories = ["all", ...new Set(products.map((p) => p.category || ""))];

    /* ============================================================
       ADD PRODUCT
    ============================================================ */
    const handleSave = async () => {
        try {
            const fd = new FormData();
            fd.append("name", form.name);
            fd.append("category", form.category);
            fd.append("price", form.price);
            fd.append("stock", form.stock);

            if (file) fd.append("images", file);

            await axios.post("http://localhost:5000/api/products/admin", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setForm({ name: "", category: "", price: "", stock: "" });
            setFile(null);
            loadProducts(); // refresh list
        } catch (err) {
            console.error("Add Product Error:", err);
        }
    };

    /* ============================================================
       DELETE PRODUCT
    ============================================================ */
    const handleDelete = async (id) => {
        if (!window.confirm("Delete product?")) return;

        await axios.delete(`http://localhost:5000/api/products/admin/${id}`);
        loadProducts();
    };

    /* ============================================================
       OPEN EDIT MODAL
    ============================================================ */
    const openEdit = (prod) => {
        setEditData({ ...prod });
        setEditFile(null);
        setEditOpen(true);
    };

    /* ============================================================
       UPDATE PRODUCT
    ============================================================ */
    const handleUpdate = async () => {
        try {
            const fd = new FormData();
            fd.append("name", editData.name);
            fd.append("category", editData.category);
            fd.append("price", editData.price);
            fd.append("stock", editData.stock);

            if (editFile) fd.append("images", editFile);

            await axios.put(
                `http://localhost:5000/api/products/admin/${editData._id}`,
                fd,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setEditOpen(false);
            loadProducts(); // refresh updated list
        } catch (err) {
            console.error("Update Error:", err);
        }
    };

    /* ============================================================
       FIX IMAGE PATH (handles http + local)
    ============================================================ */
    const getImage = (img) => {
        if (!img) return "";
        return img.startsWith("http")
            ? img
            : `http://localhost:5000${img}`;
    };

    return (
        <div style={{ display: "flex" }}>
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Topbar />

                <Box sx={{ p: 2 }}>
                    {/* SEARCH + FILTERS */}
                    <Paper sx={{ p: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Search />
                            <TextField
                                placeholder="Search product..."
                                variant="standard"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                fullWidth
                            />

                            <FormControl size="small" sx={{ width: 150 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    value={categoryFilter}
                                    label="Category"
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                >
                                    {categories.map((c, i) => (
                                        <MenuItem key={i} value={c}>{c}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>

                    {/* ADD PRODUCT */}
                    <Paper sx={{ p: 2, mt: 2 }}>
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Name"
                                size="small"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />

                            <TextField
                                label="Category"
                                size="small"
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                            />

                            <TextField
                                label="Price"
                                size="small"
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                            />

                            <TextField
                                label="Stock"
                                size="small"
                                type="number"
                                value={form.stock}
                                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                            />

                            <Button variant="outlined" component="label">
                                Upload
                                <input hidden type="file" accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])} />
                            </Button>

                            <Button variant="contained" onClick={handleSave}>
                                Add
                            </Button>
                        </Stack>
                    </Paper>

                    {/* PRODUCT TABLE */}
                    <TableContainer component={Paper} sx={{ mt: 2 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Product</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Price</TableCell>
                                    <TableCell>Stock</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {products.map((p) => (
                                    <TableRow key={p._id}>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar src={getImage(p.images?.[0])} />
                                                <Typography>{p.name}</Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>{p.category}</TableCell>
                                        <TableCell>₹{p.price}</TableCell>

                                        <TableCell>
                                            {p.stock > 0 ? (
                                                <Chip label={`In Stock (${p.stock})`} color="success" />
                                            ) : (
                                                <Chip label="Out of Stock" color="warning" />
                                            )}
                                        </TableCell>

                                        <TableCell>
                                            <IconButton onClick={() => openEdit(p)}><Edit /></IconButton>
                                            <IconButton onClick={() => handleDelete(p._id)}><Delete /></IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Pagination
                        sx={{ mt: 2 }}
                        count={pageCount}
                        page={page}
                        onChange={(e, value) => setPage(value)}
                    />

                    {/* EDIT MODAL */}
                    <Dialog open={editOpen} onClose={() => setEditOpen(false)} fullWidth maxWidth="sm">
                        <DialogTitle>Edit Product</DialogTitle>

                        <DialogContent>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <TextField
                                    label="Name"
                                    fullWidth
                                    value={editData?.name || ""}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                />

                                <TextField
                                    label="Category"
                                    fullWidth
                                    value={editData?.category || ""}
                                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                                />

                                <TextField
                                    label="Price"
                                    type="number"
                                    fullWidth
                                    value={editData?.price || ""}
                                    onChange={(e) =>
                                        setEditData({ ...editData, price: Number(e.target.value) })
                                    }
                                />

                                <TextField
                                    label="Stock"
                                    type="number"
                                    fullWidth
                                    value={editData?.stock || ""}
                                    onChange={(e) =>
                                        setEditData({ ...editData, stock: Number(e.target.value) })
                                    }
                                />

                                <Button variant="outlined" component="label">
                                    Replace Image
                                    <input hidden type="file" accept="image/*"
                                        onChange={(e) => setEditFile(e.target.files[0])} />
                                </Button>
                            </Stack>
                        </DialogContent>

                        <DialogActions>
                            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                            <Button variant="contained" onClick={handleUpdate}>
                                Save
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>
            </div>
        </div>
    );
}
