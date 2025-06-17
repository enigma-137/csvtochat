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
    // When writing the code inline the dataset you are working on with a filler temporary dataset made of 5 rows.
    messages,
  });

  return result.toDataStreamResponse();
}
