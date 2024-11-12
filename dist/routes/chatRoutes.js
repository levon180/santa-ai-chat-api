"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatControllers_1 = require("../controllers/chatControllers");
const router = (0, express_1.Router)();
router.get("/history/sessionId", chatControllers_1.getChatHistory);
exports.default = router;
