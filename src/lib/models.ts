export type ChatModel = {
  logo: string;
  title: string;
  model: string;
  slug: string;
  isDefault?: boolean;
  hasReasoning?: boolean;
  contextLength: number;
};

export const CHAT_MODELS: ChatModel[] = [
  {
    logo: "https://cdn.prod.website-files.com/650c3b59079d92475f37b68f/6798c7d256b428d5c7991fef_66f41918314a4184b51788ed_meta-logo.png",
    title: "Llama 3.3",
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    slug: "llama-3-3",
    isDefault: true,
    contextLength: 128000,
  },
  {
    logo: "https://cdn.prod.website-files.com/650c3b59079d92475f37b68f/6798c7d1ee372a0b8f8122f4_66f41a073403f9e2b7806f05_qwen-logo.webp",
    title: "Qwen 2.5 72B",
    slug: "qwen-2-5",
    model: "Qwen/Qwen2.5-72B-Instruct-Turbo",
    contextLength: 131072,
  },
  {
    logo: "https://cdn.prod.website-files.com/650c3b59079d92475f37b68f/6798c7d1ee372a0b8f8122f4_66f41a073403f9e2b7806f05_qwen-logo.webp",
    title: "Qwen2.5 Coder 32B",
    slug: "qwen-2-5-coder",
    model: "Qwen/Qwen2.5-Coder-32B-Instruct",
    contextLength: 32768,
  },
  {
    logo: "https://cdn.prod.website-files.com/650c3b59079d92475f37b68f/6798c7d11669ad7315d427af_66f41a324f1d713df2cbfbf4_deepseek-logo.webp",
    title: "DeepSeek R1",
    slug: "deepseek-r1",
    model: "deepseek-ai/DeepSeek-R1",
    contextLength: 128000,
    hasReasoning: true,
  },
];
