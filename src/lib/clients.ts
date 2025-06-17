import Together from "together-ai";
import { createTogetherAI } from "@ai-sdk/togetherai";

export const togetherClient = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export const togetherAISDKClient = createTogetherAI({
  apiKey: process.env.TOGETHER_API_KEY,
});
