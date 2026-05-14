import express from "express";
import { getCalendarEvents } from "../controllers/chatController.js";

const router = express.Router();

router.get("/", getCalendarEvents);

export default router;
