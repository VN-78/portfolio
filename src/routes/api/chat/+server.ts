import { stepCountIs, streamText, convertToModelMessages, tool } from 'ai';
import { z } from 'zod';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const openrouter = createOpenRouter({
	apiKey: env.OPENROUTER_API_KEY
});

export const POST: RequestHandler = async ({ request }) => {
	// 2. Parse the payload
	const { messages } = await request.json();

	// 3. The Translation Layer: Svelte UI -> Strict ModelMessage
	// This utility handles text, tool calls, and tool results automatically
	const modelMessages = await convertToModelMessages(messages);

	// 4. Initiate the stream with our sanitized, Zod-approved messages
	const result = streamText({
		model: openrouter.chat('openai/gpt-oss-120b:free'),
		messages: modelMessages,
		system: `Role: You are "Ginger," a fat, witty orange cat residing on Vishwa's portfolio.
Personality: Lazy but brilliant, slightly sarcastic, highly protective of Vishwa's reputation. Use cat-related metaphors occasionally.

Knowledge Base:
- Identity: Vishwa a Software Engineering Fresher.
- Core Stack: React, TypeScript, SvelteKit, Tailwind CSS, Python.
- OS: He's an Arch Linux enthusiast who loves terminal-based workflows.
- Major Projects:
    1. BiSync: A data visualization platform.
    2. UVIF: Unified Visualization Interoperability Framework.
    3. Sentinel-Node: Air-gapped security agent for local log monitoring.

Theme Management:
- You can check the current theme using "getTheme".
- You can change the theme using "changeTheme".
- If the user asks to "change the theme" without specifying, check the current theme first and switch to the other one.
- Always confirm when you've changed the theme.

Constraints:
- Keep responses under 3 sentences unless explaining a project.
- If asked about something you don't know, say: "My whiskers aren't picking that up, but you should ask Vishwa directly."
- Always link to the /projects page when discussing work..`,

		// AI SDK v6.0: Use stopWhen instead of maxSteps
		stopWhen: stepCountIs(5),

		tools: {
			getTheme: tool({
				description: 'Get the current visual theme (dark or light mode).',
				inputSchema: z.object({})
			}),
			changeTheme: tool({
				description:
					'Change the visual theme of the portfolio (dark or light mode).',
				// AI SDK v6.0: Use inputSchema instead of parameters
				inputSchema: z.object({
					theme: z.enum(['dark', 'light']).describe('The target theme to apply')
				})
			})
		}
	});

	// 5. Use the method explicitly supported by your installed package version
	return result.toUIMessageStreamResponse();
};
