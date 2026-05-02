import { streamText, type ModelMessage } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

// 1. Define exactly what Svelte's UI sends us to keep TS strict
interface IncomingUIMessage {
	role?: string;
	content?: string;
	text?: string;
	parts?: Array<{ type?: string; text?: string }>;
}

const openrouter = createOpenRouter({
	apiKey: env.OPENROUTER_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	// 2. Safely cast the JSON payload to our interface
	const payload = (await request.json()) as { messages: IncomingUIMessage[] };
	const messages = payload.messages || [];

	// 3. The Translation Layer: Svelte UI -> Strict CoreMessage
	const coreMessages: ModelMessage[] = messages.map((msg) => {
		// Fallback chain: Extract the string safely, prioritizing the 'content' field if it exists
		let textContent = '';

		if (msg.content) {
			textContent = msg.content;
		} else if (msg.text) {
			textContent = msg.text;
		} else if (Array.isArray(msg.parts)) {
			textContent = msg.parts
				.filter((p) => p.type === 'text')
				.map((p) => p.text || '')
				.join('');
		}

		// Force the role into the strict union that Zod expects
		const role = msg.role === 'system' || msg.role === 'assistant' ? msg.role : 'user';

		return {
			role: role as 'user' | 'assistant' | 'system',
			content: textContent
		};
	});

	// 4. Initiate the stream with our sanitized, Zod-approved messages
	const result = streamText({
		model: openrouter.chat('openai/gpt-oss-20b:free'),
		messages: coreMessages,
		system: `You are an AI assistant living on Vishwa's software engineering portfolio.
        You manifest visually as a fat orange cat. Keep answers brief and helpful.`
	});

	// 5. Use the method explicitly supported by your installed package version
	return result.toUIMessageStreamResponse();
};
