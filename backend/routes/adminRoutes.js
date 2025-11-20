import express from 'express';
import { adminLogin } from '../controllers/adminAuthController.js';

import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats,
} from "../controllers/adminController.js";

const router = express.Router();

// Protected routes (you can later add auth middleware)
router.get("/orders", getAllOrders);
router.put("/orders/:id", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);
router.get("/stats", getDashboardStats);

router.post('/login', adminLogin);
export default router;