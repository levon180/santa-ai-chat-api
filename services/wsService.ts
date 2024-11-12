import WebSocket from "ws";
import {rateLimitRequest} from "./rateLimitService";
import Message from "../models/Message";
import {getSantaResponse} from "./openAIService";

export const handleWebSocketConnection = (ws: WebSocket) => {
    console.log('Client connected');
    ws.on('message', async (ms: string) => {
        console.log('Received message');
        const parsedMessage: {sessionId: string, message: string} = JSON.parse(ms);

        const { sessionId, message } = parsedMessage;

        try {
            await rateLimitRequest(sessionId);
            const userMessage = new Message({
                sessionId,
                message,
                isAssistantMessage: false,
            });

            await userMessage.save();

            const history = await Message.find({ sessionId }).sort({ timestamp: 1 });
            const userNewMessage = {role: 'user', content: message};
            let newMessage: {role: string, content: string}[] = [userNewMessage];

            if (history.length > 0) {
                //@ts-ignore
                const historyMessages = history.map(({isAssistantMessage, message}) => ({role: isAssistantMessage ? 'assistant' : 'user', content: message}));
                newMessage = [...historyMessages, userNewMessage];
            }
            //@ts-ignore
            const content = await getSantaResponse(newMessage, ws);
            const assistantMessage = new Message({
                sessionId,
                message: content,
                isAssistantMessage: true,
            });

            await assistantMessage.save();
        } catch (e) {
            console.error('Error occurred', e);
        }
    })
}