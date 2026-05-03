<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import { lastAssistantMessageIsCompleteWithToolCalls, type ToolCallPart } from 'ai';
	import AiChat from '../../molecules/aichat/AiChat.svelte';
	import CatAvatar from '../../molecules/aicat/CatAvatar.svelte';
	import { toggleThemeWithTransition } from '$lib/utils/theme-view-transition';

	// --- AI SDK Hook ---
	// This automatically connects to your /api/chat/+server.ts route
	// const chat = new Chat({});
	// 1. The Brain: Initialize the SDK once here.
	const chat = new Chat({
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		onToolCall: async ({ toolCall }) => {
			if (toolCall.toolName === 'getTheme') {
				const isDark = document.documentElement.classList.contains('dark');
				const theme = isDark ? 'dark' : 'light';
				
				chat.addToolResult({
					toolCallId: toolCall.toolCallId,
					tool: 'getTheme',
					state: 'output-available',
					output: theme
				});
				return;
			}

			if (toolCall.toolName === 'changeTheme') {
				// Use ToolCallPart which is exported, and cast the input specifically
				const input = (toolCall as ToolCallPart).input as { theme: 'dark' | 'light' } | undefined;
				
				if (!input?.theme) return;

				const isDark = input.theme === 'dark';

				// Create a synthetic event at the center of the screen for the animation
				const fauxEvent = new MouseEvent('click', {
					clientX: window.innerWidth / 2,
					clientY: window.innerHeight / 2
				});

				toggleThemeWithTransition(isDark, fauxEvent);

				// Manually add the tool result so the AI can continue the conversation
				chat.addToolResult({
					toolCallId: toolCall.toolCallId,
					tool: 'changeTheme',
					state: 'output-available',
					output: `Successfully changed theme to ${input.theme}`
				});
			}
		}
	});

	// 2. The Shared State: Is the window open?
	let isChatOpen = $state(false);
</script>

<div class="relative mt-24 flex flex-col items-center  ">
	{#if isChatOpen}
		<!-- Pass the entire chat instance and bind the open state so the 'X' button can close it -->
		<AiChat
			{chat}
			onClose={() => {
				isChatOpen = false;
			}}
		/>
	{/if}

	<!-- Pass only the status for lip-syncing, and bind the open state so clicking the cat opens it -->
	<CatAvatar status={chat.status} bind:isChatOpen />
</div>
