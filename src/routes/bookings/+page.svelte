<script>
	// Bookings page
</script>

<main class="page-container">
	<h1>My Bookings</h1>
	<div class="content">
		<div class="booking-card">
			<div class="booking-header">
				<h2>Swedish Massage</h2>
				<span class="status confirmed">Confirmed</span>
			</div>
			<p class="date">📅 March 15, 2024 at 2:00 PM</p>
			<p class="therapist">👤 Therapist: Sarah Johnson</p>
			<p class="duration">⏱️ Duration: 60 minutes</p>
		</div>
		<div class="booking-card">
			<div class="booking-header">
				<h2>Deep Tissue Massage</h2>
				<span class="status pending">Pending</span>
			</div>
			<p class="date">📅 March 20, 2024 at 10:00 AM</p>
			<p class="therapist">👤 Therapist: Mike Chen</p>
			<p class="duration">⏱️ Duration: 90 minutes</p>
		</div>
		<div class="booking-card">
			<div class="booking-header">
				<h2>Hot Stone Massage</h2>
				<span class="status completed">Completed</span>
			</div>
			<p class="date">📅 March 10, 2024 at 4:00 PM</p>
			<p class="therapist">👤 Therapist: Emily Davis</p>
			<p class="duration">⏱️ Duration: 75 minutes</p>
		</div>
	</div>
</main>

<style>
	.page-container {
		padding: 2rem 1rem;
		padding-bottom: 80px; /* Space for bottom nav */
		max-width: 800px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2rem;
		margin-bottom: 1.5rem;
		color: #333;
	}

	.content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.booking-card {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.booking-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1rem;
	}

	.booking-header h2 {
		font-size: 1.25rem;
		color: #333;
		margin: 0;
	}

	.status {
		padding: 0.25rem 0.75rem;
		border-radius: 12px;
		font-size: 0.75rem;
		font-weight: 600;
		text-transform: uppercase;
	}

	.status.confirmed {
		background-color: #d4edda;
		color: #155724;
	}

	.status.pending {
		background-color: #fff3cd;
		color: #856404;
	}

	.status.completed {
		background-color: #d1ecf1;
		color: #0c5460;
	}

	.date,
	.therapist,
	.duration {
		color: #666;
		margin: 0.5rem 0;
		line-height: 1.5;
	}
</style>

