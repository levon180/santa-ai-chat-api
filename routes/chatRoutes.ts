import { Router } from "express";
import {getChatHistory, sendMessage} from "../controllers/chatControllers";

const router = Router();

router.get("/history/:sessionId", getChatHistory);
router.post("/send", sendMessage);

export default router;