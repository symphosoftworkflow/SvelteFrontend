<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type PriceLineItem = {
		id: string;
		label: string;
		amount: number;
		type?: 'base' | 'addon' | 'tax' | 'discount';
		meta?: string;
	};

	type Totals = {
		subtotal?: number;
		taxes?: number;
		discounts?: number;
		grandTotal: number;
	};

	type PriceSummaryEvents = {
		applyDiscount: { code: string };
	};

	const dispatch = createEventDispatcher<PriceSummaryEvents>();

	export let items: PriceLineItem[] = [];
	export let currency = 'USD';
	export let showDiscountInput = false;
	export let totals: Totals | undefined = undefined;
	export let isCompact = false;

	let discountCode = '';

	$: formatter = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency
	});

	$: derivedSubtotal = items.filter((item) => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
	$: derivedTaxes = items.filter((item) => item.type === 'tax').reduce((sum, item) => sum + item.amount, 0);
	$: derivedDiscounts = Math.abs(items.filter((item) => item.amount < 0).reduce((sum, item) => sum + item.amount, 0));
	$: derivedGrandTotal = items.reduce((sum, item) => sum + item.amount, 0);

	$: summary = totals ?? {
		subtotal: derivedSubtotal,
		taxes: derivedTaxes,
		discounts: derivedDiscounts,
		grandTotal: derivedGrandTotal
	};

	function formatAmount(amount: number) {
		return formatter.format(amount);
	}

	function isNegative(amount: number) {
		return amount < 0;
	}

	function handleDiscountSubmit(event: SubmitEvent) {
		event.preventDefault();
		if (!discountCode.trim()) return;
		dispatch('applyDiscount', { code: discountCode.trim() });
		discountCode = '';
	}

	export const MOCK_PRICE_ITEMS: PriceLineItem[] = [
		{ id: 'base', label: 'Signature Facial', amount: 95, type: 'base' },
		{ id: 'addon-led', label: 'LED Therapy Add-on', amount: 25, type: 'addon' },
		{ id: 'tax', label: 'Sales Tax', amount: 10.2, type: 'tax' },
		{ id: 'discount', label: 'Spring Promo', amount: -15, type: 'discount' }
	];
</script>

<section class="price-summary" data-variant={isCompact ? 'compact' : 'default'}>
	<header>
		<h2>Price summary</h2>
		<p>All prices in {currency}</p>
	</header>

	<ul class="line-items">
		{#if !items.length}
			<li class="line-items__empty">No price data available.</li>
		{:else}
			{#each items as item (item.id)}
				<li class="line-item" data-testid="price-line-item">
					<div>
						<p>{item.label}</p>
						{#if item.meta}
							<small>{item.meta}</small>
						{/if}
					</div>
					<span class:negative={isNegative(item.amount)}>{formatAmount(item.amount)}</span>
				</li>
			{/each}
		{/if}
	</ul>

	<div class="totals">
		<div class="totals__row">
			<span>Subtotal</span>
			<strong>{formatAmount(summary.subtotal ?? 0)}</strong>
		</div>
		<div class="totals__row">
			<span>Taxes</span>
			<strong>{formatAmount(summary.taxes ?? 0)}</strong>
		</div>
		{#if summary.discounts}
			<div class="totals__row">
				<span>Discounts</span>
				<strong class="negative">- {formatAmount(summary.discounts)}</strong>
			</div>
		{/if}
		<div class="totals__grand">
			<span>Total due</span>
			<strong>{formatAmount(summary.grandTotal)}</strong>
		</div>
	</div>

	{#if showDiscountInput}
		<form class="discount" on:submit={handleDiscountSubmit}>
			<label>
				<span class="sr-only">Discount code</span>
				<input
					type="text"
					name="discountCode"
					placeholder="Discount code"
					bind:value={discountCode}
					autocomplete="off"
				/>
			</label>
			<button type="submit" class="ghost" disabled={!discountCode.trim()}>Apply</button>
		</form>
	{/if}
</section>

<style>
	.price-summary {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 1.5rem;
		background: #0f172a;
		color: white;
		border-radius: 1rem;
		min-width: 260px;
	}

	header h2 {
		margin: 0;
		font-size: 1.2rem;
	}

	header p {
		margin: 0.2rem 0 0;
		color: rgba(255, 255, 255, 0.7);
		font-size: 0.9rem;
	}

	.line-items {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.line-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 0.95rem;
	}

	.line-item p {
		margin: 0;
		font-weight: 500;
	}

	.line-item small {
		color: rgba(255, 255, 255, 0.6);
	}

	.line-item span {
		font-weight: 600;
	}

	.line-items__empty {
		text-align: center;
		color: rgba(255, 255, 255, 0.6);
		font-style: italic;
	}

	.negative {
		color: #f87171;
	}

	.totals {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}

	.totals__row {
		display: flex;
		justify-content: space-between;
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.9rem;
	}

	.totals__grand {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 1.1rem;
		padding-top: 0.25rem;
		font-weight: 600;
	}

	.discount {
		display: flex;
		gap: 0.5rem;
	}

	.discount input {
		border-radius: 0.75rem;
		border: none;
		padding: 0.65rem 0.9rem;
		flex: 1;
	}

	.discount button {
		border-radius: 0.75rem;
		border: 1px solid rgba(255, 255, 255, 0.4);
		background: transparent;
		color: white;
		padding: 0.5rem 1rem;
		cursor: pointer;
	}

	.discount button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.price-summary[data-variant='compact'] {
		padding: 1rem;
		font-size: 0.85rem;
		gap: 0.75rem;
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
