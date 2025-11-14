<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type BookingSummary = {
		reference: string;
		serviceName: string;
		scheduledFor: string;
		location?: string;
		staffName?: string;
		price?: number;
		notes?: string;
	};

	type ConfirmationAction = {
		id: string;
		label: string;
		href?: string;
		variant?: 'primary' | 'secondary' | 'ghost';
		icon?: string;
	};

	type SupportContact = {
		phone?: string;
		email?: string;
	};

	type BookingConfirmationEvents = {
		action: { id: string };
	};

	const dispatch = createEventDispatcher<BookingConfirmationEvents>();

	export let booking: BookingSummary | null = null;
	export let status: 'loading' | 'success' | 'error' = 'loading';
	export let errorMessage = 'We could not confirm your booking.';
	export let supportContact: SupportContact = {};
	export let actions: ConfirmationAction[] = [];
	export let currency = 'USD';

	const skeletonRows = Array.from({ length: 4 });

	$: formattedDate =
		booking?.scheduledFor
			? new Intl.DateTimeFormat(undefined, {
					dateStyle: 'full',
					timeStyle: 'short'
				}).format(new Date(booking.scheduledFor))
			: '';

	$: currencyFormatter = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency
	});

	function handleAction(action: ConfirmationAction) {
		dispatch('action', { id: action.id });
	}

	function variantClass(variant: ConfirmationAction['variant']) {
		switch (variant) {
			case 'secondary':
				return 'secondary';
			case 'ghost':
				return 'ghost';
			default:
				return 'primary';
		}
	}

	export const MOCK_BOOKING_CONFIRMATION: BookingSummary = {
		reference: 'BK-2048',
		serviceName: 'Deep Tissue Massage',
		scheduledFor: new Date().toISOString(),
		location: 'Wellness Studio · 123 Market St',
		staffName: 'Morgan Lee',
		price: 145,
		notes: 'Arrive 10 min early for intake form.'
	};
</script>

<section class="confirmation" data-status={status}>
	{#if status === 'loading'}
		<div class="card skeleton">
			{#each skeletonRows as _, index}
				<div class="line" style={`animation-delay: ${index * 120}ms`}></div>
			{/each}
		</div>
	{:else if status === 'error'}
		<div class="card error" role="alert">
			<h2>Booking failed</h2>
			<p>{errorMessage}</p>
			{#if supportContact.phone || supportContact.email}
				<p class="support">
					Need help?
					{#if supportContact.phone}
						Call <a href={`tel:${supportContact.phone}`}>{supportContact.phone}</a>
					{/if}
					{#if supportContact.email}
						or email <a href={`mailto:${supportContact.email}`}>{supportContact.email}</a>
					{/if}
				</p>
			{/if}
		</div>
	{:else}
		<div class="card success">
			<header>
				<div>
					<p class="eyebrow">Booking confirmed</p>
					<h2>{booking?.serviceName}</h2>
				</div>
				{#if booking?.reference}
					<span class="badge">Ref {booking.reference}</span>
				{/if}
			</header>

			<ul class="details">
				{#if formattedDate}
					<li>
						<span>Date & time</span>
						<strong>{formattedDate}</strong>
					</li>
				{/if}
				{#if booking?.location}
					<li>
						<span>Location</span>
						<strong>{booking.location}</strong>
					</li>
				{/if}
				{#if booking?.staffName}
					<li>
						<span>Professional</span>
						<strong>{booking.staffName}</strong>
					</li>
				{/if}
				{#if booking?.price !== undefined}
					<li>
						<span>Price</span>
						<strong>{currencyFormatter.format(booking.price)}</strong>
					</li>
				{/if}
			</ul>

			{#if booking?.notes}
				<section class="notes">
					<h3>Notes</h3>
					<p>{booking.notes}</p>
				</section>
			{/if}

			{#if actions.length}
				<div class="actions">
					{#each actions as action (action.id)}
						{#if action.href}
							<a
								href={action.href}
								class={`action ${variantClass(action.variant)}`}
								on:click={() => handleAction(action)}
							>
								{#if action.icon}<span aria-hidden="true">{action.icon}</span>{/if}
								{action.label}
							</a>
						{:else}
							<button
								type="button"
								class={`action ${variantClass(action.variant)}`}
								on:click={() => handleAction(action)}
							>
								{#if action.icon}<span aria-hidden="true">{action.icon}</span>{/if}
								{action.label}
							</button>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</section>

<style>
	.confirmation {
		width: 100%;
	}

	.card {
		border-radius: 1.25rem;
		padding: 1.75rem;
		background: white;
		border: 1px solid #e2e8f0;
		box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
	}

	.card.success {
		border-top: 4px solid #16a34a;
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.eyebrow {
		text-transform: uppercase;
		font-size: 0.8rem;
		letter-spacing: 0.08em;
		color: #16a34a;
		margin: 0 0 0.2rem 0;
	}

	h2 {
		margin: 0;
		font-size: 1.5rem;
		color: #0f172a;
	}

	.badge {
		background: #ecfdf5;
		color: #16a34a;
		padding: 0.4rem 0.75rem;
		border-radius: 999px;
		font-weight: 600;
	}

	.details {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 1rem;
	}

	.details li {
		background: #f8fafc;
		border-radius: 0.75rem;
		padding: 0.75rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.details span {
		font-size: 0.85rem;
		color: #64748b;
	}

	.details strong {
		color: #0f172a;
		font-size: 1rem;
	}

	.notes {
		margin-top: 1rem;
		padding: 1rem;
		background: #fefce8;
		border-radius: 1rem;
	}

	.notes h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1rem;
		color: #92400e;
	}

	.notes p {
		margin: 0;
		color: #78350f;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1.5rem;
	}

	.action {
		border-radius: 999px;
		padding: 0.65rem 1.5rem;
		font-weight: 600;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		cursor: pointer;
		transition: transform 0.2s ease;
		border: none;
	}

	.action.primary {
		background: #0ea5e9;
		color: white;
	}

	.action.secondary {
		background: #e2e8f0;
		color: #0f172a;
	}

	.action.ghost {
		background: transparent;
		color: #0ea5e9;
		border: 1px solid #bae6fd;
	}

	.action:hover {
		transform: translateY(-1px);
	}

	.card.error {
		border-left: 4px solid #dc2626;
		background: #fef2f2;
		color: #7f1d1d;
	}

	.card.error h2 {
		color: inherit;
	}

	.card.error a {
		color: #dc2626;
		font-weight: 600;
	}

	.support {
		margin-top: 0.5rem;
	}

	.card.skeleton {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.card.skeleton .line {
		height: 16px;
		border-radius: 999px;
		background: linear-gradient(90deg, #e2e8f0, #f8fafc, #e2e8f0);
		background-size: 200% 100%;
		animation: shimmer 1.4s infinite;
	}

	@keyframes shimmer {
		0% {
			background-position: 200% 0;
		}
		100% {
			background-position: -200% 0;
		}
	}

	@media (max-width: 640px) {
		.card {
			padding: 1.25rem;
		}

		.details {
			grid-template-columns: 1fr;
		}
	}
</style>
