import express from "express";
import { getSliders } from "../controllers/sliderController.js";
const router = express.Router();

router.get("/", getSliders);

export default router;
