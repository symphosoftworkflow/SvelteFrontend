<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	type ServiceSummary = {
		id: string;
		name: string;
		category: string;
		durationMins: number;
		price: number;
		rating?: number;
		thumbnailUrl?: string;
		tags?: string[];
		description?: string;
	};

	type ServiceFilters = {
		categories?: string[];
		priceRange?: [number, number];
		query?: string;
	};

	const dispatch = createEventDispatcher<{
		select: { service: ServiceSummary };
		filterChange: { key: keyof ServiceFilters | 'reset'; value: unknown };
	}>();

	export let services: ServiceSummary[] = [];
	export let selectedServiceId: string | null = null;
	export let filters: ServiceFilters = {};
	export let layout: 'grid' | 'list' = 'grid';
	export let isLoading = false;

	const skeletonTiles = Array.from({ length: 4 });

	$: categories = Array.from(new Set(services.map((service) => service.category))).sort();
	$: hasResults = !isLoading && services.length > 0;

	function handleSelect(service: ServiceSummary) {
		dispatch('select', { service });
	}

	function handleQueryInput(value: string) {
		dispatch('filterChange', { key: 'query', value });
	}

	function toggleCategory(category: string) {
		const next = new Set(filters.categories ?? []);
		if (next.has(category)) {
			next.delete(category);
		} else {
			next.add(category);
		}
		const value = Array.from(next);
		dispatch('filterChange', { key: 'categories', value });
	}

	export const MOCK_SERVICES: ServiceSummary[] = [
		{
			id: 'svc-cut',
			name: 'Signature Haircut',
			category: 'Hair',
			durationMins: 45,
			price: 65,
			rating: 4.8,
			thumbnailUrl: 'https://placehold.co/96x96',
			tags: ['best seller', 'styling']
		},
		{
			id: 'svc-massage',
			name: 'Deep Tissue Massage',
			category: 'Wellness',
			durationMins: 60,
			price: 120,
			rating: 4.9,
			thumbnailUrl: 'https://placehold.co/96x96',
			tags: ['relaxation']
		},
		{
			id: 'svc-facial',
			name: 'Brightening Facial',
			category: 'Skin',
			durationMins: 50,
			price: 95,
			rating: 4.7,
			thumbnailUrl: 'https://placehold.co/96x96',
			tags: ['glow', 'self-care']
		}
	];
</script>

<section class="catalog" data-layout={layout}>
	<header class="catalog__header">
		<div class="header__text">
			<h2>Services</h2>
			<p>{services.length} options</p>
		</div>

		<div class="filters">
			<label class="search">
				<span class="sr-only">Search services</span>
				<input
					type="search"
					name="service-search"
					placeholder="Search by name or tag"
					value={filters.query ?? ''}
					on:input={(event) => handleQueryInput((event.target as HTMLInputElement).value)}
				/>
			</label>

			{#if categories.length}
				<ul class="filter-chips" aria-label="Filter by category">
					{#each categories as category (category)}
						<li>
							<button
								type="button"
								data-testid="filter-chip"
								class:selected={filters.categories?.includes(category)}
								on:click={() => toggleCategory(category)}
							>
								{category}
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</header>

	{#if isLoading}
		<div class="catalog__grid" aria-live="polite">
			{#each skeletonTiles as _, index}
				<div class="card card--skeleton" data-testid="service-card-skeleton" aria-busy="true">
					<div class="thumb"></div>
					<div class="meta">
						<div class="line short"></div>
						<div class="line"></div>
						<div class="line faded"></div>
					</div>
				</div>
			{/each}
		</div>
	{:else if hasResults}
		<div class="catalog__grid">
			{#each services as service (service.id)}
				<button
					type="button"
					data-testid="service-card"
					class="card"
					class:selected={service.id === selectedServiceId}
					on:click={() => handleSelect(service)}
				>
					{#if service.thumbnailUrl}
						<img src={service.thumbnailUrl} alt={service.name} class="thumb" />
					{:else}
						<div class="thumb thumb--placeholder">{service.name[0]}</div>
					{/if}

					<div class="meta">
						<div class="meta__heading">
							<h3>{service.name}</h3>
							<span class="price">${service.price.toFixed(0)}</span>
						</div>
						<p>{service.category} · {service.durationMins} mins</p>

						{#if service.tags?.length}
							<ul class="tags">
								{#each service.tags.slice(0, 3) as tag}
									<li>{tag}</li>
								{/each}
							</ul>
						{/if}

						{#if service.rating}
							<div class="rating">
								⭐️ {service.rating.toFixed(1)}
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>
	{:else}
		<div class="empty-state" role="status">
			<h3>No services match your filters</h3>
			<p>Try adjusting your search or resetting filters.</p>
			<button type="button" class="ghost" on:click={() => dispatch('filterChange', { key: 'reset', value: null })}>
				Clear filters
			</button>
		</div>
	{/if}
</section>

<style>
	:global(:root) {
		--catalog-bg: #f9fafb;
		--card-border: #e5e7eb;
		--accent: #2563eb;
	}

	.catalog {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: var(--catalog-bg);
		padding: 1.5rem;
		border-radius: 1rem;
		border: 1px solid var(--card-border);
	}

	.catalog__header {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	@media (min-width: 640px) {
		.catalog__header {
			flex-direction: row;
			align-items: flex-end;
			justify-content: space-between;
		}
	}

	.header__text h2 {
		font-size: 1.25rem;
		margin: 0;
	}

	.header__text p {
		margin: 0.25rem 0 0;
		color: #6b7280;
	}

	.filters {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: 100%;
	}

	.search input {
		width: 100%;
		padding: 0.6rem 0.85rem;
		border-radius: 999px;
		border: 1px solid var(--card-border);
		font-size: 0.95rem;
	}

	.filter-chips {
		display: flex;
		gap: 0.5rem;
		padding: 0;
		margin: 0;
		list-style: none;
		overflow-x: auto;
	}

	.filter-chips button {
		border-radius: 999px;
		padding: 0.35rem 0.85rem;
		border: 1px solid var(--card-border);
		background: #fff;
		cursor: pointer;
		font-size: 0.85rem;
		color: #6b7280;
		transition: all 0.2s ease;
	}

	.filter-chips button.selected {
		background: var(--accent);
		color: white;
		border-color: var(--accent);
	}

	.catalog__grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
		gap: 1rem;
	}

	.catalog[data-layout='list'] .catalog__grid {
		grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
	}

	.card {
		display: flex;
		gap: 0.75rem;
		padding: 1rem;
		background: white;
		border-radius: 1rem;
		border: 1px solid var(--card-border);
		text-align: left;
		cursor: pointer;
		transition: border-color 0.2s ease, transform 0.2s ease;
	}

	.card:hover {
		transform: translateY(-2px);
	}

	.card.selected {
		border-color: var(--accent);
		box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
	}

	.card--skeleton {
		cursor: default;
	}

	.thumb {
		width: 72px;
		height: 72px;
		border-radius: 0.75rem;
		object-fit: cover;
		background: #e5e7eb;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 600;
		color: #374151;
	}

	.thumb--placeholder {
		font-size: 1.5rem;
	}

	.card--skeleton .thumb,
	.card--skeleton .line {
		animation: pulse 1.5s ease-in-out infinite;
	}

	.meta {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.meta__heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
	}

	.meta__heading h3 {
		margin: 0;
		font-size: 1rem;
	}

	.meta__heading .price {
		font-weight: 600;
		color: #111827;
	}

	.meta p {
		margin: 0;
		color: #6b7280;
		font-size: 0.9rem;
	}

	.tags {
		display: flex;
		gap: 0.35rem;
		padding: 0;
		margin: 0;
		list-style: none;
		flex-wrap: wrap;
	}

	.tags li {
		background: #f3f4f6;
		color: #4b5563;
		padding: 0.1rem 0.5rem;
		border-radius: 999px;
		font-size: 0.75rem;
	}

	.rating {
		font-size: 0.85rem;
		color: #f59e0b;
	}

	.card--skeleton .meta {
		gap: 0.4rem;
	}

	.card--skeleton .line {
		height: 0.8rem;
		border-radius: 999px;
		background: #e5e7eb;
	}

	.card--skeleton .line.short {
		width: 40%;
	}

	.card--skeleton .line.faded {
		width: 60%;
		opacity: 0.5;
	}

	.empty-state {
		text-align: center;
		padding: 2rem 1rem;
		background: white;
		border-radius: 1rem;
		border: 1px dashed var(--card-border);
	}

	.empty-state h3 {
		margin: 0 0 0.5rem;
	}

	.empty-state p {
		margin: 0 0 1rem;
		color: #6b7280;
	}

	.empty-state .ghost {
		border: 1px solid var(--card-border);
		background: transparent;
		padding: 0.5rem 1rem;
		border-radius: 999px;
		cursor: pointer;
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

	@keyframes pulse {
		0%,
		100% {
			opacity: 0.9;
		}
		50% {
			opacity: 0.4;
		}
	}
</style>
