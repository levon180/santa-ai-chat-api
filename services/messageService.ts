import Message, {IMessage} from "../models/Message";

export const getAllBySessionId = async (sessionId: string) => {
    return Message.find({sessionId}).sort({timestamp: 1});
}

export const saveMessage = async (message: IMessage) => {

    const ms = new Message(message);
    return ms.save()
}