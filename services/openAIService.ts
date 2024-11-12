import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

type OpenAIMessageType = {
    content: string;
    role: 'system' | 'user' | 'assistant';
}

const client = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'], // This is the default and can be omitted
});

const systemMessage = {
   role: 'system',
   content: 'You are Santa Claus. Respond in a jolly, warm, and cheerful tone, with Christmas humor.'
};

export const getSantaResponse = async (message: OpenAIMessageType[], ws: WebSocket)  => {
    try {
        const chatCompletion = await client.chat.completions.create({
            model: 'gpt-4o',
            //@ts-ignore
            messages: [systemMessage, ...message],
            stream: true,
        });

        let content = '';

        for await (const chunk of chatCompletion) {
            const currentContent = chunk.choices[0].delta.content;
            console.log('currentContent', currentContent);
            content += currentContent;
            //@ts-ignore
            ws.send(currentContent);
        }

        return content;
    } catch (e) {
        console.error('Error while streaming OpenAI response', e) ;
    }
}