import Together from "together-ai";
import { createTogetherAI } from "@ai-sdk/togetherai";
import { CodeSandbox } from "@codesandbox/sdk";

export const togetherClient = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

export const togetherAISDKClient = createTogetherAI({
  apiKey: process.env.TOGETHER_API_KEY,
});

// Create the client with your token
export const csbSdk = new CodeSandbox(process.env.CSB_API_KEY);
