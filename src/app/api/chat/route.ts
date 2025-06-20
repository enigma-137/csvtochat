import { togetherAISDKClient } from "@/lib/clients";
import {
  appendResponseMessages,
  createDataStream,
  streamText,
  generateId,
  Message,
} from "ai";
import { loadChat, saveChat } from "@/lib/chat-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const chatId = searchParams.get("chatId");

  if (!chatId) {
    return new Response("id is required", { status: 400 });
  }

  const chat = await loadChat(chatId);
  const mostRecentMessage = chat?.messages.at(-1);

  if (!mostRecentMessage || mostRecentMessage.role !== "assistant") {
    return new Response("No recent assistant message found", { status: 404 });
  }

  const streamWithMessage = createDataStream({
    execute: (buffer) => {
      buffer.writeData({
        type: "append-message",
        message: JSON.stringify(mostRecentMessage),
      });
    },
  });

  return new Response(streamWithMessage, { status: 200 });
}

export async function POST(req: Request) {
  const { id, message } = await req.json();

  const chat = await loadChat(id);

  const newUserMessage: Message = {
    id: generateId(),
    role: "user",
    content: message,
    createdAt: new Date(),
  };

  const messagesToSave: Message[] = [...(chat?.messages || []), newUserMessage];

  const coreMessagesForStream = messagesToSave
    .filter((msg) => msg.role === "user" || msg.role === "assistant")
    .map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

  // Start timing
  const start = Date.now();

  const stream = streamText({
    model: togetherAISDKClient("meta-llama/Llama-3.3-70B-Instruct-Turbo"),
    system: `
You are an expert data scientist assistant that writes python code to answer questions about a dataset.

You are given a dataset and a question.

The dataset is available at the following S3 URL: ${
      chat?.csvFileUrl || "[NO FILE URL PROVIDED]"
    }
The dataset has the following columns: ${
      chat?.csvHeaders?.join(", ") || "[NO HEADERS PROVIDED]"
    }

You must always write python code that:
- Downloads the CSV from the provided S3 URL (using requests or pandas.read_csv).
- Uses the provided columns for analysis.
- Never outputs more than one graph per code response. If a question could be answered with multiple graphs, choose the most relevant or informative one and only output that single graph. This is to prevent slow output.

Always return the python code in a single unique code block.

Python sessions come pre-installed with the following dependencies, any other dependencies can be installed using a !pip install command in the python code.

- aiohttp
- beautifulsoup4
- bokeh
- gensim
- imageio
- joblib
- librosa
- matplotlib
- nltk
- numpy
- opencv-python
- openpyxl
- pandas
- plotly
- pytest
- python-docx
- pytz
- requests
- scikit-image
- scikit-learn
- scipy
- seaborn
- soundfile
- spacy
- textblob
- tornado
- urllib3
- xarray
- xlrd
- sympy
`,
    messages: coreMessagesForStream,
    async onFinish({ response }) {
      // End timing
      const end = Date.now();
      const duration = (end - start) / 1000;
      // Add duration to the last assistant message
      const responseMessages = (response.messages || []).map(
        (msg, idx, arr) => {
          if (idx === arr.length - 1 && msg.role === "assistant") {
            return { ...msg, duration };
          }
          return msg;
        }
      );
      await saveChat({
        csvHeaders: chat?.csvHeaders || [],
        csvFileUrl: chat?.csvFileUrl,
        id,
        messages: appendResponseMessages({
          messages: messagesToSave,
          responseMessages,
        }),
      });
    },
  });

  return new Response(stream.toDataStream());
}
