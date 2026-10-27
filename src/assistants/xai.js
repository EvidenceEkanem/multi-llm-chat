import OpenAI from "openai";
import { Assistant as OpenAiAssistant } from "./openai";

const openai = new OpenAI({
    baseURL: "https://api.x.ai/v1",
    apiKey: import.meta.env.VITE_X_AI_API_KEY,
    dangerouslyAllowBrowser: true
});

export class Assistant extends OpenAiAssistant {
    constructor(model = "grok-3-mini-latest", client = openai) {
        super(model, client)
    }
}