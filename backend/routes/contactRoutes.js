// routes/contactRoutes.js
import express from "express";

import { getCategories } from "../controllers/categoryController.js";

import { submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

// ✅ Route using controller
router.post("/submit", submitContactForm);



router.get("/", getCategories);



export default router;
