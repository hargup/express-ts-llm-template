import express, { Request, Response } from "express";
import { callLLM } from './llm_utils';

const app = express()
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('Hello World from app.ts!'))
app.post('/llm', async (req: Request, res: Response) => {
  try {
    const prompt = req.body.prompt;
    const model = req.body.model || "claude-3-haiku-20240307";
    const response = await callLLM(prompt, model);
    res.send(response);
  } catch (error) {
    res.status(500).send({ error: `Error calling LLM ${error}` });
  }
}) //Example: curl -X POST -H "Content-Type: application/json" -d '{"prompt": "What is the capital of France?"}' http://localhost:3000/llm

export default app;
