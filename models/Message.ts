import mongoose, { Schema } from 'mongoose';

export interface IMessage {
    message: string;
    sessionId: string;
    isAssistantMessage: boolean;
    timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
    message: { type: String, required: true },
    sessionId: { type: String, required: true },
    isAssistantMessage: { type: Boolean, required: true },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IMessage>('messages', messageSchema);