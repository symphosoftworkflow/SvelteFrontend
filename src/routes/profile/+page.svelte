<script lang="ts">
	import BookingConfirmation from '$lib/components/BookingConfirmation.svelte';

	type BookingSummary = {
		reference: string;
		serviceName: string;
		scheduledFor: string;
		location?: string;
		staffName?: string;
		price?: number;
		notes?: string;
	};

	const booking: BookingSummary = {
		reference: 'BK-2048',
		serviceName: 'Deep Tissue Massage',
		scheduledFor: new Date().toISOString(),
		location: 'Riverwalk Wellness Studio · 57 Market St, Austin',
		staffName: 'Morgan Lee',
		price: 145,
		notes: 'Arrive 10 min early for intake form.'
	};

	const supportContact = {
		phone: '+1 (555) 010-7788',
		email: 'support@massage-services.app'
	};

	const actions = [
		{ id: 'add-calendar', label: 'Add to calendar', variant: 'ghost' as const },
		{ id: 'book-again', label: 'Book another session', variant: 'primary' as const },
		{ id: 'share', label: 'Share confirmation', variant: 'secondary' as const }
	];

	let confirmationStatus: 'loading' | 'success' | 'error' = 'success';
let lastAction: string | null = null;

function handleAction(payload: { id: string }) {
	lastAction = payload.id;
}
</script>

<main class="profile-page">
	<section class="profile-card">
		<div class="avatar">JD</div>
		<h1>John Doe</h1>
		<p class="email">john.doe@example.com</p>

		<div class="stats">
			<div>
				<strong>12</strong>
				<span>Total bookings</span>
			</div>
			<div>
				<strong>4.9★</strong>
				<span>Client rating</span>
			</div>
			<div>
				<strong>Gold</strong>
				<span>Loyalty tier</span>
			</div>
		</div>
	</section>

	<section class="profile-grid">
		<div class="profile-section">
			<h2>Account Information</h2>
			<ul>
				<li>
					<span>Phone</span>
					<strong>+1 (555) 123-4567</strong>
				</li>
				<li>
					<span>Member since</span>
					<strong>January 2024</strong>
				</li>
				<li>
					<span>Preferred location</span>
					<strong>Downtown Wellness Hub</strong>
				</li>
			</ul>
		</div>

		<div class="profile-section">
			<h2>Preferences</h2>
			<ul>
				<li>
					<span>Massage style</span>
					<strong>Swedish / Relaxation</strong>
				</li>
				<li>
					<span>Duration</span>
					<strong>60 minutes</strong>
				</li>
				<li>
					<span>Notes</span>
					<strong>Prefer calming music + lavender scents</strong>
				</li>
			</ul>
		</div>
	</section>

	<section class="confirmation-section">
		<h2>Upcoming confirmation</h2>
		<BookingConfirmation
			booking={booking}
			status={confirmationStatus}
			supportContact={supportContact}
			actions={actions}
			onAction={handleAction}
		/>

		{#if lastAction}
			<p class="action-feedback">Last action: {lastAction}</p>
		{/if}
	</section>
</main>

<style>
	.profile-page {
		padding: 2rem 1.5rem 5.5rem;
		max-width: 960px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.profile-card {
		background: white;
		border-radius: 1.5rem;
		border: 1px solid #e5e7eb;
		padding: 2rem;
		text-align: center;
		box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
	}

	.avatar {
		width: 96px;
		height: 96px;
		border-radius: 50%;
		margin: 0 auto 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2.25rem;
		font-weight: 600;
		color: white;
		background: linear-gradient(135deg, #2563eb, #7c3aed);
	}

	h1 {
		margin: 0;
		font-size: 2rem;
		color: #0f172a;
	}

	.email {
		margin: 0.5rem 0 1.5rem;
		color: #475569;
	}

	.stats {
		display: flex;
		justify-content: center;
		gap: 2rem;
	}

	.stats strong {
		display: block;
		font-size: 1.5rem;
		color: #0f172a;
	}

	.stats span {
		color: #64748b;
		font-size: 0.95rem;
	}

	.profile-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
		gap: 1.25rem;
	}

	.profile-section {
		background: white;
		border-radius: 1rem;
		border: 1px solid #e5e7eb;
		padding: 1.5rem;
	}

	.profile-section h2 {
		margin: 0 0 1rem;
		font-size: 1.25rem;
		color: #0f172a;
	}

	.profile-section ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.profile-section li {
		display: flex;
		justify-content: space-between;
		color: #475569;
	}

	.profile-section strong {
		color: #0f172a;
	}

	.confirmation-section {
		background: #f8fafc;
		border-radius: 1.25rem;
		border: 1px solid #e2e8f0;
		padding: 1.5rem;
	}

	.confirmation-section h2 {
		margin: 0 0 1rem;
		font-size: 1.25rem;
		color: #0f172a;
	}

	.action-feedback {
		margin-top: 0.75rem;
		color: #475569;
		font-size: 0.95rem;
	}

	@media (max-width: 640px) {
		.profile-section li {
			flex-direction: column;
			gap: 0.25rem;
		}
	}
</style>

