<script lang="ts">
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

	type BookingField = keyof BookingDraft;

	type BookingFormEvents = {
		change: { field: BookingField; value: unknown };
		submit: { booking: Partial<BookingDraft> };
	};

	interface Props {
		booking?: Partial<BookingDraft>;
		services?: ServiceSummary[];
		staffMembers?: StaffSummary[];
		availability?: AvailabilitySlot[];
		minDate?: string;
		maxDate?: string;
		isSubmitting?: boolean;
		errors?: Partial<Record<BookingField, string>>;
		onChange?: (payload: BookingFormEvents['change']) => void;
		onSubmit?: (payload: BookingFormEvents['submit']) => void;
	}

	let {
		booking = {},
		services = [],
		staffMembers = [],
		availability = [],
		minDate = new Date().toISOString().split('T')[0],
		maxDate = undefined,
		isSubmitting = false,
		errors = {},
		onChange,
		onSubmit
	}: Props = $props();

	const today = new Date().toISOString().split('T')[0];

	const normalizedMinDate = $derived(minDate ?? today);
	const currentServiceId = $derived(booking.serviceId ?? services[0]?.id ?? '');
	const selectedStaffId = $derived(booking.staffId ?? '');
	const selectedDate = $derived(booking.date ?? '');
	const availableTimes = $derived(deriveTimes(currentServiceId, selectedStaffId, selectedDate));

	function deriveTimes(serviceId: string, staffId: string | undefined, date: string | undefined) {
		if (!date) {
			return [];
		}

		return availability
			.filter((slot) => slot.date === date)
			.filter((slot) => !serviceId || !slot.serviceId || slot.serviceId === serviceId)
			.filter((slot) => !staffId || !slot.staffId || slot.staffId === staffId)
			.flatMap((slot) => slot.times);
	}

	function handleFieldChange(field: BookingField, value: unknown) {
		onChange?.({ field, value });
	}

	function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		onSubmit?.({ booking });
	}

	function errorFor(field: BookingField) {
		return errors?.[field];
	}

	export const MOCK_BOOKING: BookingDraft = {
		serviceId: 'svc-cut',
		staffId: 'staff-1',
		date: today,
		time: '14:00',
		customerName: 'Jordan Client',
		customerEmail: 'jordan@example.com',
		customerPhone: '+1 555-0101',
		notes: 'Prefer quiet appointment.'
	};

	export const MOCK_SERVICES: ServiceSummary[] = [
		{ id: 'svc-cut', name: 'Signature Haircut', durationMins: 45, price: 65 },
		{ id: 'svc-color', name: 'Color Refresh', durationMins: 90, price: 150 }
	];

	export const MOCK_STAFF: StaffSummary[] = [
		{ id: 'staff-1', name: 'Alex Rivera', specialties: ['Haircut'] },
		{ id: 'staff-2', name: 'Morgan Lee', specialties: ['Color'] }
	];

	export const MOCK_AVAILABILITY: AvailabilitySlot[] = [
		{ date: today, times: ['09:00', '11:00', '14:00'], staffId: 'staff-1' },
		{ date: today, times: ['10:30', '13:00', '15:30'], staffId: 'staff-2' }
	];
</script>

<form class="booking-form" onsubmit={handleSubmit} aria-busy={isSubmitting}>
	<fieldset class="booking-form__section" disabled={isSubmitting}>
		<legend>Details</legend>

		<label class="field">
			<span>Service</span>
			<select
				name="serviceId"
				data-testid="service-select"
				value={booking.serviceId ?? ''}
				onchange={(event) => handleFieldChange('serviceId', (event.target as HTMLSelectElement).value)}
				required
			>
				<option value="" disabled selected={!booking.serviceId}>Select service</option>
				{#each services as service (service.id)}
					<option value={service.id}>
						{service.name} · {service.durationMins} mins
					</option>
				{/each}
			</select>
			{#if errorFor('serviceId')}
				<p class="field__error">{errorFor('serviceId')}</p>
			{/if}
		</label>

		{#if staffMembers.length}
			<label class="field">
				<span>Preferred staff</span>
				<select
					name="staffId"
					value={booking.staffId ?? ''}
					onchange={(event) => handleFieldChange('staffId', (event.target as HTMLSelectElement).value)}
				>
					<option value="">No preference</option>
					{#each staffMembers as staff (staff.id)}
						<option value={staff.id}>{staff.name}</option>
					{/each}
				</select>
				{#if errorFor('staffId')}
					<p class="field__error">{errorFor('staffId')}</p>
				{/if}
			</label>
		{/if}

		<div class="field field--split">
			<label>
				<span>Date</span>
				<input
					type="date"
					name="date"
					min={normalizedMinDate}
					max={maxDate}
					value={booking.date ?? ''}
					required
					oninput={(event) => handleFieldChange('date', (event.target as HTMLInputElement).value)}
				/>
				{#if errorFor('date')}
					<p class="field__error">{errorFor('date')}</p>
				{/if}
			</label>

			<label>
				<span>Time</span>
				<select
					name="time"
					required
					disabled={!availableTimes.length}
					value={booking.time ?? ''}
					onchange={(event) => handleFieldChange('time', (event.target as HTMLSelectElement).value)}
				>
					<option value="" disabled selected={!booking.time}>
						{availableTimes.length ? 'Select time' : 'Select date first'}
					</option>
					{#each availableTimes as time}
						<option value={time}>{time}</option>
					{/each}
				</select>
				{#if errorFor('time')}
					<p class="field__error">{errorFor('time')}</p>
				{/if}
			</label>
		</div>
	</fieldset>

	<fieldset class="booking-form__section" disabled={isSubmitting}>
		<legend>Contact</legend>

		<label class="field">
			<span>Full name</span>
			<input
				type="text"
				name="customerName"
				placeholder="Jordan Client"
				value={booking.customerName ?? ''}
				oninput={(event) => handleFieldChange('customerName', (event.target as HTMLInputElement).value)}
			/>
			{#if errorFor('customerName')}
				<p class="field__error">{errorFor('customerName')}</p>
			{/if}
		</label>

		<label class="field">
			<span>Email</span>
			<input
				type="email"
				name="customerEmail"
				placeholder="you@example.com"
				value={booking.customerEmail ?? ''}
				oninput={(event) => handleFieldChange('customerEmail', (event.target as HTMLInputElement).value)}
			/>
			{#if errorFor('customerEmail')}
				<p class="field__error">{errorFor('customerEmail')}</p>
			{/if}
		</label>

		<label class="field">
			<span>Phone</span>
			<input
				type="tel"
				name="customerPhone"
				placeholder="+1 555-0100"
				value={booking.customerPhone ?? ''}
				oninput={(event) => handleFieldChange('customerPhone', (event.target as HTMLInputElement).value)}
			/>
			{#if errorFor('customerPhone')}
				<p class="field__error">{errorFor('customerPhone')}</p>
			{/if}
		</label>
	</fieldset>

	<label class="field field--notes" aria-label="Notes">
		<span>Notes</span>
		<textarea
			name="notes"
			rows="3"
			placeholder="Share goals, preferences, or accessibility needs"
			oninput={(event) => handleFieldChange('notes', (event.target as HTMLTextAreaElement).value)}
		>{booking.notes ?? ''}</textarea>
		{#if errorFor('notes')}
			<p class="field__error">{errorFor('notes')}</p>
		{/if}
	</label>

	<div class="booking-form__actions">
		<button type="submit" class="primary" disabled={isSubmitting}>Confirm booking</button>
		{#if isSubmitting}
			<span class="subtext">Saving your reservation…</span>
		{/if}
	</div>
</form>

<style>
	.booking-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 1.5rem;
		background: white;
		border-radius: 1rem;
		border: 1px solid #e5e7eb;
		box-shadow: 0 10px 40px rgba(15, 23, 42, 0.05);
	}

	fieldset {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	legend {
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #111827;
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.field span {
		font-size: 0.95rem;
		color: #374151;
	}

	.field input,
	.field select,
	.field textarea {
		border-radius: 0.75rem;
		border: 1px solid #d1d5db;
		padding: 0.65rem 0.9rem;
		font-size: 0.95rem;
		width: 100%;
	}

	.field textarea {
		resize: vertical;
	}

	.field select:disabled {
		background: #f3f4f6;
		color: #9ca3af;
	}

	.field__error {
		color: #b91c1c;
		font-size: 0.85rem;
		margin: 0;
	}

	.field--split {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
		gap: 0.75rem;
	}

	.field--notes textarea {
		min-height: 96px;
	}

	.booking-form__actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	button.primary {
		background: #2563eb;
		color: white;
		border: none;
		border-radius: 999px;
		padding: 0.75rem 1.5rem;
		font-weight: 600;
		cursor: pointer;
		transition: background 0.2s ease;
	}

	button.primary:disabled {
		background: #93c5fd;
		cursor: not-allowed;
	}

	.subtext {
		color: #6b7280;
		font-size: 0.9rem;
	}
</style>
