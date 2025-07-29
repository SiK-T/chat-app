import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUserForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/getUsers", protectRoute, getUserForSidebar);
router.get("/getMessages/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);


export default router;