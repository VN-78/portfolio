<script lang="ts">
	import { Avatar } from 'bits-ui';
	import favicon from '$lib/assets/favicon.svg';
</script>

<Avatar.Root>
	<Avatar.Image src={favicon} alt="Vishwanaths avatar" />
	<Avatar.Fallback>VN</Avatar.Fallback>
</Avatar.Root>
