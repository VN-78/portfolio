<script lang="ts">
	import { Avatar } from 'bits-ui';
	import vishwa from '$lib/assets/images/main.jpeg';
</script>

<Avatar.Root>
	<Avatar.Image src={vishwa} alt="Vishwanaths avatar" />
	<Avatar.Fallback>VN</Avatar.Fallback>
</Avatar.Root>
