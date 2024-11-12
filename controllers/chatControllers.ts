import {Request, Response} from "express";
import * as messageService from '../services/messageService'
import { rateLimitRequest } from "../services/rateLimitService";
import { getSantaResponse } from "../services/openAIService";
import Message from "../models/Message";

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
    const {sessionId} = req.params;

    try {
        const history = await messageService.getAllBySessionId(sessionId);
        res.json({history});
    } catch (err) {
        res.status(500).json({error: 'Failed to fetch chat history'});
    }
}

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    const {sessionId, message} = req.body;

    try {
        await rateLimitRequest(sessionId);

        //@ts-ignore
        const santaResponse = await getSantaResponse(message);

        const newMessage = new Message({
            sessionId,
            userMessage: message,
            santaMessage: santaResponse,
        });

        await newMessage.save();

        res.json({ santaMessage: santaResponse });
    } catch (e) {
        // @ts-ignore
        if (e.message === 'Rate limit exceeded') {
            res.status(429).json({error: 'Rate limit exceeded'});
        } else {
            res.status(500).json({error: 'Internal Server Error'});
        }
    }
}