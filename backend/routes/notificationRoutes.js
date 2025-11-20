import express from "express";
import {
  saveNotification,
  getNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.post("/save", saveNotification);
router.get("/get/:userId", getNotification);

export default router;
