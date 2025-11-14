<script>
	let count = $state(0);
</script>

<main class="page-container">
	<h1>Welcome to Massage Services</h1>
	<p class="subtitle">Your relaxation journey starts here</p>
	
	<div class="feature-grid">
		<div class="feature-card">
			<div class="feature-icon">💆</div>
			<h2>Book Services</h2>
			<p>Choose from our wide range of massage therapies</p>
		</div>
		<div class="feature-card">
			<div class="feature-icon">📅</div>
			<h2>Manage Bookings</h2>
			<p>View and manage your upcoming appointments</p>
		</div>
		<div class="feature-card">
			<div class="feature-icon">👤</div>
			<h2>Your Profile</h2>
			<p>Update your preferences and account information</p>
		</div>
	</div>

	<div class="demo-section">
		<h3>Interactive Demo</h3>
		<button onclick={() => count++}>
			Click Count: {count}
		</button>
	</div>
</main>

<style>
	.page-container {
		padding: 2rem 1rem;
		padding-bottom: 80px; /* Space for bottom nav */
		max-width: 1200px;
		margin: 0 auto;
	}

	h1 {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.subtitle {
		text-align: center;
		color: #666;
		font-size: 1.1rem;
		margin-bottom: 2rem;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 2rem;
	}

	.feature-card {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		transition: transform 0.2s ease, box-shadow 0.2s ease;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	}

	.feature-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.feature-card h2 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: #007bff;
	}

	.feature-card p {
		color: #666;
		line-height: 1.5;
	}

	.demo-section {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 2rem;
		text-align: center;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.demo-section h3 {
		margin-bottom: 1rem;
		color: #333;
	}

	button {
		background: #007bff;
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		cursor: pointer;
		font-size: 16px;
		font-weight: 500;
		transition: background 0.2s ease;
	}

	button:hover {
		background: #0056b3;
	}
</style>

