export type ChatModel = {
  title: string;
  model: string;
  slug: string;
  isDefault?: boolean;
};

export const CHAT_MODELS: ChatModel[] = [
  {
    title: "Llama 3.3",
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    slug: "llama-3-3",
    isDefault: true,
  },
  {
    title: "Qwen 2.5",
    slug: "qwen-2-5",
    model: "Qwen/Qwen2.5-72B-Instruct-Turbo",
  },
  {
    title: "DeepSeek R1",
    slug: "deepseek-r1",
    model: "deepseek-ai/DeepSeek-R1",
  },
];
