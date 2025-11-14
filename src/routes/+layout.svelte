<script>
	import BottomTabNav from '$lib/components/BottomTabNav.svelte';
</script>

<main>
	<slot />
</main>

<BottomTabNav />

<style>
	main {
		min-height: calc(100vh - 64px);
		padding-bottom: 64px; /* Space for bottom nav */
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
	}
</style>

