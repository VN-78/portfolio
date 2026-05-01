import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// 1. Configure the Provider for OpenRouter
// We override the default OpenAI URL to point to OpenRouter's endpoint.
const openrouter = createOpenAI({
	apiKey: env.OPENROUTER_API_KEY,
	baseURL: 'https://openrouter.ai/api/v1'
});

export const POST: RequestHandler = async ({ request }) => {
	// 2. Parse the incoming messages from your Svelte frontend
	const { messages } : { messages: UIMessage[] } = await request.json();

	// 3. Initiate the Stream
	// We are using a fast, free Llama 3 model on OpenRouter for testing.
	// You can change this to 'google/gemini-flash-1.5' or any other model later.
	const result = streamText({
		model: openrouter('openai/gpt-oss-20b:free'),

		messages: await convertToModelMessages(messages),

		// 4. The System Prompt (The Brain)
		// This is where you give the agent its personality and context.
		system: `You are an AI assistant living on Vishwa's software engineering portfolio.
        You manifest visually as a fat orange cat.
        Keep your answers brief, slightly sarcastic, but very helpful.
        Vishwa is a frontend developer transitioning into data science.`
	});
	// 5. Pipe the response directly back to the browser in real-time chunks
	return result.toUIMessageStreamResponse();
};
