<script lang="ts">
	import { Chat } from '@ai-sdk/svelte';
	import AiChat from '../../molecules/aichat/AiChat.svelte';
	import CatAvatar from '../../molecules/aicat/CatAvatar.svelte';

	// --- AI SDK Hook ---
	// This automatically connects to your /api/chat/+server.ts route
	// const chat = new Chat({});
	// 1. The Brain: Initialize the SDK once here.
	const chat = new Chat({});

	// 2. The Shared State: Is the window open?
	let isChatOpen = $state(false);
</script>

<div class="relative mt-24 flex flex-col items-center p-4">
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
