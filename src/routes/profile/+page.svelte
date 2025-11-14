<script>
	// Profile page
</script>

<main class="page-container">
	<h1>Profile</h1>
	<div class="content">
		<div class="profile-header">
			<div class="avatar">JD</div>
			<h2>John Doe</h2>
			<p class="email">john.doe@example.com</p>
		</div>

		<div class="profile-section">
			<h3>Account Information</h3>
			<div class="info-item">
				<span class="label">Phone:</span>
				<span class="value">+1 (555) 123-4567</span>
			</div>
			<div class="info-item">
				<span class="label">Member Since:</span>
				<span class="value">January 2024</span>
			</div>
			<div class="info-item">
				<span class="label">Total Bookings:</span>
				<span class="value">12</span>
			</div>
		</div>

		<div class="profile-section">
			<h3>Preferences</h3>
			<div class="preference-item">
				<span>Preferred Massage Type:</span>
				<span>Swedish Massage</span>
			</div>
			<div class="preference-item">
				<span>Preferred Duration:</span>
				<span>60 minutes</span>
			</div>
		</div>

		<button class="edit-button">Edit Profile</button>
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
		gap: 1.5rem;
	}

	.profile-header {
		text-align: center;
		padding: 2rem 0;
		background: white;
		border-radius: 12px;
		border: 1px solid #e0e0e0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.avatar {
		width: 80px;
		height: 80px;
		border-radius: 50%;
		background: linear-gradient(135deg, #007bff, #0056b3);
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		font-weight: 600;
		margin: 0 auto 1rem;
	}

	.profile-header h2 {
		font-size: 1.5rem;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.email {
		color: #666;
		margin: 0;
	}

	.profile-section {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.profile-section h3 {
		font-size: 1.1rem;
		margin-bottom: 1rem;
		color: #007bff;
		border-bottom: 2px solid #007bff;
		padding-bottom: 0.5rem;
	}

	.info-item,
	.preference-item {
		display: flex;
		justify-content: space-between;
		padding: 0.75rem 0;
		border-bottom: 1px solid #f0f0f0;
	}

	.info-item:last-child,
	.preference-item:last-child {
		border-bottom: none;
	}

	.label {
		font-weight: 500;
		color: #666;
	}

	.value {
		color: #333;
		font-weight: 500;
	}

	.edit-button {
		background: #007bff;
		color: white;
		border: none;
		padding: 1rem;
		border-radius: 12px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	.edit-button:hover {
		background: #0056b3;
	}
</style>

