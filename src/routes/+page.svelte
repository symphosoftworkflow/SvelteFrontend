<script>
	let count = 0;
</script>

<main>
	<h1>Welcome to SvelteKit</h1>
	<p>This is your Svelte frontend running in Docker with auto-rebuild enabled.</p>
	<p>Edit this file to see hot-reload in action!</p>
	
	<button on:click={() => count++}>
		Count: {count}
	</button>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	button {
		background: #ff3e00;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		font-size: 16px;
		margin-top: 20px;
	}

	button:hover {
		background: #ff5e20;
	}
</style>

