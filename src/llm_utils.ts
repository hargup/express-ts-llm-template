import { OpenAI } from 'openai';
//@ts-ignore
import { createHeaders, PORTKEY_GATEWAY_URL } from 'portkey-ai';


const geminiGateway = new OpenAI({
  baseURL: PORTKEY_GATEWAY_URL,
  defaultHeaders: createHeaders({
    provider: "anthropic",
    apiKey: process.env.PORTKEY_API_KEY,
    config: "pc-base-475642",
    virtualKey: process.env.GEMINI_VIRTUAL_KEY
  })
});

const claudeGateway = new OpenAI({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: PORTKEY_GATEWAY_URL,
  defaultHeaders: createHeaders({
    provider: "anthropic",
    apiKey: process.env.PORTKEY_API_KEY,
    config: "pc-base-475642",
  })
});


async function callLLM(prompt: string, model: string = "claude-3-opus-20240229"): Promise<string> {
  const chatCompletion = await claudeGateway.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model,
    max_tokens: 4096
  });
  if (!chatCompletion.choices[0].message.content) {
    throw new Error('No content in the message');
  }
  return chatCompletion.choices[0].message.content;
}

function extractBracketedString(str: string): string {
  const openingBrackets = ['[', '{', '('];
  const closingBrackets = [']', '}', ')'];

  const firstBracket = str.search(/[\[{(]/);
  if (firstBracket === -1) {
    throw new Error('No opening bracket found');
  }
  const openingBracket = str[firstBracket];
  const closingBracket = closingBrackets[openingBrackets.indexOf(openingBracket)];

  const lastBracket = str.lastIndexOf(closingBracket);
  if (lastBracket === -1 || lastBracket < firstBracket) {
    throw new Error('Mismatched brackets');
  }

  return str.slice(firstBracket, lastBracket + 1);
}

function extractAndParseJSON(str: string): any {
  const jsonString = extractBracketedString(str);
  return jsonString ? JSON.parse(jsonString) : null;
}

// main()

export {
  callLLM, extractAndParseJSON, geminiGateway, claudeGateway
}


