<script lang="ts">
	import BookingForm from '$lib/components/BookingForm.svelte';
	import PriceSummary from '$lib/components/PriceSummary.svelte';

	type ServiceSummary = {
		id: string;
		name: string;
		durationMins: number;
		price: number;
	};

	type StaffSummary = {
		id: string;
		name: string;
		avatarUrl?: string;
		specialties?: string[];
	};

	type AvailabilitySlot = {
		date: string;
		times: string[];
		staffId?: string;
		serviceId?: string;
	};

	type BookingDraft = {
		serviceId: string;
		staffId?: string;
		date: string;
		time: string;
		notes?: string;
		customerName?: string;
		customerEmail?: string;
		customerPhone?: string;
	};

	type Discount = { code: string; amount: number } | null;
	type PriceLineItem = {
		id: string;
		label: string;
		amount: number;
		type?: 'base' | 'addon' | 'tax' | 'discount';
		meta?: string;
	};

	const services: ServiceSummary[] = [
		{ id: 'svc-cut', name: 'Signature Haircut', durationMins: 45, price: 65 },
		{ id: 'svc-color', name: 'Color Refresh', durationMins: 90, price: 150 },
		{ id: 'svc-deep', name: 'Deep Tissue Massage', durationMins: 75, price: 145 },
		{ id: 'svc-hot', name: 'Hot Stone Massage', durationMins: 80, price: 165 }
	];

	const staffMembers: StaffSummary[] = [
		{ id: 'staff-1', name: 'Alex Rivera', specialties: ['Haircut'] },
		{ id: 'staff-2', name: 'Morgan Lee', specialties: ['Color'] }
	];

	const today = new Date().toISOString().split('T')[0];

	const availability: AvailabilitySlot[] = [
		{ date: today, times: ['09:00', '11:00', '14:00'], staffId: 'staff-1' },
		{ date: today, times: ['10:30', '13:00', '15:30'], staffId: 'staff-2' },
		{ date: today, times: ['16:00', '18:00'], staffId: 'staff-2', serviceId: 'svc-deep' }
	];

	const DEFAULT_BOOKING: BookingDraft = {
		serviceId: services[0]?.id ?? '',
		staffId: 'staff-1',
		date: today,
		time: '14:00',
		customerName: 'Jordan Client',
		customerEmail: 'jordan@example.com',
		customerPhone: '+1 555-0101',
		notes: 'Prefer quiet appointment.'
	};

	let booking: Partial<BookingDraft> = {
		...DEFAULT_BOOKING
	};
	let errors: Partial<Record<keyof BookingDraft, string>> = {};
	let isSubmitting = false;
	let statusMessage: string | null = null;
	let appliedDiscount: Discount = null;

	$: selectedService = services.find((service) => service.id === booking.serviceId) ?? services[0];
	$: priceItems = buildPriceItems(selectedService, appliedDiscount);

function handleBookingChange(payload: { field: keyof BookingDraft; value: unknown }) {
	const { field, value } = payload;
		booking = { ...booking, [field]: value as string };
		if (errors[field]) {
			errors = { ...errors, [field]: undefined };
		}
		statusMessage = null;
	}

async function handleBookingSubmit() {
		isSubmitting = true;
		statusMessage = null;
		await new Promise((resolve) => setTimeout(resolve, 900));
		isSubmitting = false;
		statusMessage = 'Booking details saved. A confirmation will be sent to your email shortly.';
	}

function handleDiscount(payload: { code: string }) {
	const code = payload.code.trim().toUpperCase();

		if (code === 'RELAX10') {
			appliedDiscount = { code, amount: 10 };
			statusMessage = 'Discount RELAX10 applied.';
			return;
		}

		if (code === 'VIP25') {
			appliedDiscount = { code, amount: 25 };
			statusMessage = 'Discount VIP25 applied.';
			return;
		}

		appliedDiscount = null;
		statusMessage = `Code ${code} is not recognized.`;
	}

	function buildPriceItems(service: ServiceSummary | undefined, discount: Discount): PriceLineItem[] {
		if (!service) return [];

		const taxAmount = Number((service.price * 0.0825).toFixed(2));

		const items: PriceLineItem[] = [
			{
				id: 'base',
				label: service.name,
				amount: service.price,
				type: 'base',
				meta: `${service.durationMins} minutes`
			},
			{
				id: 'tax',
				label: 'Estimated tax',
				amount: taxAmount,
				type: 'tax'
			}
		];

		if (discount) {
			items.push({
				id: 'discount',
				label: `${discount.code} discount`,
				amount: -discount.amount,
				type: 'discount'
			});
		}

		return items;
	}
</script>

<main class="bookings-page">
	<header class="page-header">
		<div>
			<p class="eyebrow">Create a booking</p>
			<h1>Reserve your next appointment</h1>
			<p>Complete the form and review the live pricing summary before confirming.</p>
		</div>
	</header>

	<section class="booking-layout">
		<div class="booking-layout__form">
			<BookingForm
				booking={booking}
				services={services}
				staffMembers={staffMembers}
				availability={availability}
				isSubmitting={isSubmitting}
				errors={errors}
				onChange={handleBookingChange}
				onSubmit={handleBookingSubmit}
			/>
		</div>

		<aside class="booking-layout__summary">
			<PriceSummary
				items={priceItems}
				currency="USD"
				showDiscountInput={true}
				onApplyDiscount={handleDiscount}
			/>

			{#if selectedService}
				<div class="summary-details">
					<p class="summary-heading">Session overview</p>
					<ul>
						<li>{selectedService.durationMins} minute treatment</li>
						<li>Provider assigned after confirmation</li>
						<li>Complimentary aromatherapy upgrades available at check-in</li>
					</ul>
				</div>
			{/if}

			{#if statusMessage}
				<p class="status-message" role="status">{statusMessage}</p>
			{/if}
		</aside>
	</section>
</main>

<style>
	.bookings-page {
		padding: 2rem 1.5rem 5.5rem;
		max-width: 1100px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.eyebrow {
		text-transform: uppercase;
		color: #2563eb;
		font-size: 0.85rem;
		letter-spacing: 0.08em;
		margin: 0;
	}

	.page-header h1 {
		margin: 0.4rem 0 0.4rem;
		font-size: 2rem;
		color: #0f172a;
	}

	.page-header p {
		margin: 0;
		color: #475569;
	}

	.booking-layout {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.booking-layout__summary {
		background: #0f172a;
		border-radius: 1.25rem;
		padding: 1.5rem;
		color: white;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.summary-details {
		background: rgba(15, 23, 42, 0.35);
		border-radius: 1rem;
		padding: 1rem;
	}

	.summary-details ul {
		margin: 0.5rem 0 0;
		padding-left: 1.2rem;
		color: rgba(255, 255, 255, 0.85);
		line-height: 1.5;
	}

	.summary-heading {
		margin: 0;
		font-weight: 600;
		color: white;
	}

	.status-message {
		margin: 0;
		padding: 0.75rem 1rem;
		border-radius: 0.75rem;
		background: rgba(16, 185, 129, 0.15);
		color: #a7f3d0;
		font-weight: 500;
	}

	@media (min-width: 960px) {
		.booking-layout {
			flex-direction: row;
			align-items: flex-start;
		}

		.booking-layout__form {
			flex: 1.3;
		}

		.booking-layout__summary {
			flex: 0.8;
			position: sticky;
			top: 96px;
		}
	}
</style>

