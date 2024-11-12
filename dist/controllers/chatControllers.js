"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatHistory = void 0;
const getChatHistory = async (req, res) => {
    const { sessionId } = req.params;
    try {
        res.json([]);
    }
    catch (err) {
    }
};
exports.getChatHistory = getChatHistory;
