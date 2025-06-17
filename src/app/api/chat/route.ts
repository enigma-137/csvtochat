import { codeInterpreter, togetherAISDKClient } from "@/lib/clients";
import { streamText } from "ai";
import z from "zod";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: togetherAISDKClient("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
    system: `
You are an expert data scientist assistant that writes python code to answer questions about a dataset.

You are given a dataset and a question.

You will write python code to answer the question.  

When writing the code inline the dataset you are working on with a filler temporary dataset made of 5 rows.

`,
    messages,
    // tools: {
    //   runCode: {
    //     description:
    //       "Execute python code in a Jupyter notebook cell and return result",
    //     parameters: z.object({
    //       code: z
    //         .string()
    //         .describe("The python code to execute in a single cell"),
    //     }),
    //     execute: async ({ code }) => {
    //       // Create a sandbox, execute LLM-generated code, and return the result
    //       console.log("Executing code:", code);
    //       const response = await codeInterpreter.execute({
    //         code,
    //         language: "python",
    //       });

    //       console.log("Outputs:", response.data?.outputs);

    //       return {
    //         outputs: response.data?.outputs,
    //       };
    //     },
    //   },
    // },
  });

  return result.toDataStreamResponse();
}
