import express from "express";
import { listProducts, getProducts } from "../controllers/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/", listProducts);


export default router;
