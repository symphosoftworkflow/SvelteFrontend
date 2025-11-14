<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const tabs = [
		{ id: 'home', label: 'Home', path: '/' },
		{ id: 'services', label: 'Services', path: '/services' },
		{ id: 'bookings', label: 'Bookings', path: '/bookings' },
		{ id: 'profile', label: 'Profile', path: '/profile' }
	];

	/**
	 * @param {string} path
	 */
	function handleTabClick(path) {
		goto(path);
	}
</script>

<nav class="bottom-nav">
	{#each tabs as tab (tab.id)}
		<button
			class="tab-button"
			class:active={$page.url.pathname === tab.path}
			onclick={() => handleTabClick(tab.path)}
			aria-label={tab.label}
			type="button"
		>
			<span class="tab-icon">{tab.id.charAt(0).toUpperCase()}</span>
			<span class="tab-label">{tab.label}</span>
		</button>
	{/each}
</nav>

<style>
	.bottom-nav {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: space-around;
		align-items: center;
		background-color: #ffffff;
		border-top: 1px solid #e0e0e0;
		padding: 8px 0;
		box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
		z-index: 1000;
		height: 64px;
	}

	.tab-button {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 4px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px 16px;
		flex: 1;
		transition: all 0.2s ease;
		color: #666;
	}

	.tab-button:hover {
		background-color: #f5f5f5;
	}

	.tab-button.active {
		color: #007bff;
	}

	.tab-icon {
		font-size: 20px;
		font-weight: 600;
		width: 32px;
		height: 32px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 8px;
		background-color: #f0f0f0;
		transition: all 0.2s ease;
	}

	.tab-button.active .tab-icon {
		background-color: #007bff;
		color: white;
	}

	.tab-label {
		font-size: 12px;
		font-weight: 500;
	}

	@media (max-width: 480px) {
		.tab-label {
			font-size: 11px;
		}

		.tab-icon {
			font-size: 18px;
			width: 28px;
			height: 28px;
		}
	}
</style>

