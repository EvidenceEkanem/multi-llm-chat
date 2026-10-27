import { GoogleGenAI } from "@google/genai";
const googleAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_AI_API_KEY });


export class Assistant {
    #chat;
    name = "googleai";

    //gemini-2.0-flash
    constructor(model = "gemini-2.5-flash") {
        this.#chat = googleAI.chats.create({
            model, history: []
        });
    }

    createChat(history) {
        this.#chat = googleAI.chats.create({ 
            model: this.#chat.model, 
            history: history.filter(({role}) => role !== "system").map(({content, role}) => ({
                parts: [{ text: content }],
                role: role === "assistant" ? "model" : role
            }))
        });
    }

    async chat(content){
        try {
            const result = await this.#chat.sendMessage({ message: content });
            return result.text;
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    async *chatStream(content) {
        try {
            const result = await this.#chat.sendMessageStream({ message: content });
            for await(const chunk of result) {
                yield chunk.text;
            }
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    #parseError(error){
        try {
            const outerErrorObject = JSON.parse(error.message);

            const innerErrorObject = JSON.parse(outerErrorObject?.error?.message);

            return innerErrorObject?.error;
        } catch (parseError) {
            return parseError;
        }
    }
}