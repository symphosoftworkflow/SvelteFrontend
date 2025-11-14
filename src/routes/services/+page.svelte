<script lang="ts">
	import ServiceCatalog from '$lib/components/ServiceCatalog.svelte';

	type ServiceSummary = {
		id: string;
		name: string;
		category: string;
		durationMins: number;
		price: number;
		rating?: number;
		thumbnailUrl?: string;
		tags?: string[];
	};

	type ServiceFilters = {
		categories: string[];
		query: string;
	};

	const BASE_SERVICES: ServiceSummary[] = [
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
		},
		{
			id: 'svc-hotstone',
			name: 'Hot Stone Massage',
			category: 'Wellness',
			durationMins: 75,
			price: 145,
			rating: 4.9,
			thumbnailUrl: 'https://placehold.co/96x96',
			tags: ['heat therapy', 'relaxation']
		},
		{
			id: 'svc-aroma',
			name: 'Aromatherapy Ritual',
			category: 'Wellness',
			durationMins: 60,
			price: 110,
			rating: 4.6,
			thumbnailUrl: 'https://placehold.co/96x96',
			tags: ['essential oils']
		},
		{
			id: 'svc-sports',
			name: 'Sports Recovery Massage',
			category: 'Performance',
			durationMins: 50,
			price: 135,
			rating: 4.8,
			thumbnailUrl: 'https://placehold.co/96x96',
			tags: ['athlete', 'deep tissue']
		}
	];

	const DEFAULT_FILTERS: ServiceFilters = {
		categories: [],
		query: ''
	};

	let filters: ServiceFilters = { ...DEFAULT_FILTERS };
	let selectedServiceId: string | null = BASE_SERVICES[0]?.id ?? null;
	let isLoading = false;

	$: visibleServices = applyFilters(BASE_SERVICES, filters);

	$: if (visibleServices.length && (!selectedServiceId || !visibleServices.some((svc) => svc.id === selectedServiceId))) {
		selectedServiceId = visibleServices[0].id;
	}

	$: selectedService =
		visibleServices.find((service) => service.id === selectedServiceId) ??
		BASE_SERVICES.find((service) => service.id === selectedServiceId) ??
		null;

	function applyFilters(list: ServiceSummary[], currentFilters: ServiceFilters) {
		const query = currentFilters.query.trim().toLowerCase();
		const hasCategoryFilter = currentFilters.categories.length > 0;

		return list.filter((service) => {
			const matchesCategory = !hasCategoryFilter || currentFilters.categories.includes(service.category);
			const matchesQuery =
				!query ||
				service.name.toLowerCase().includes(query) ||
				service.category.toLowerCase().includes(query) ||
				service.tags?.some((tag: string) => tag.toLowerCase().includes(query));

			return matchesCategory && matchesQuery;
		});
	}

function handleFilterChange(payload: { key: string; value: unknown }) {
	const { key, value } = payload;

		if (key === 'reset') {
			filters = { ...DEFAULT_FILTERS };
			return;
		}

		if (key === 'categories') {
			filters = {
				...filters,
				categories: Array.isArray(value) ? (value as string[]) : []
			};
			return;
		}

		if (key === 'query') {
			filters = {
				...filters,
				query: typeof value === 'string' ? value : ''
			};
		}
	}

function handleServiceSelect(payload: { service: ServiceSummary }) {
	selectedServiceId = payload.service.id;
	}
</script>

<main class="services-page">
	<header class="page-header">
		<div>
			<p class="eyebrow">Massage & Wellness</p>
			<h1>Browse and filter our services</h1>
			<p class="lead">
				Use the catalog to explore treatments, compare durations, and find the perfect option for your next visit.
			</p>
		</div>
		<div class="header-meta">
			<strong>{BASE_SERVICES.length}</strong>
			<span>Available services</span>
		</div>
	</header>

	<ServiceCatalog
		services={visibleServices}
		categorySource={BASE_SERVICES}
		selectedServiceId={selectedServiceId}
		filters={filters}
		isLoading={isLoading}
		onSelect={handleServiceSelect}
		onFilterChange={handleFilterChange}
	/>

	{#if selectedService}
		<section class="selection-panel" aria-live="polite">
			<h2>Selected service</h2>
			<div class="selection-panel__body">
				<div>
					<p class="selection-panel__label">Name</p>
					<p class="selection-panel__value">{selectedService.name}</p>
				</div>
				<div>
					<p class="selection-panel__label">Category</p>
					<p class="selection-panel__value">{selectedService.category}</p>
				</div>
				<div>
					<p class="selection-panel__label">Duration</p>
					<p class="selection-panel__value">{selectedService.durationMins} mins</p>
				</div>
				<div>
					<p class="selection-panel__label">Price</p>
					<p class="selection-panel__value">${selectedService.price.toFixed(0)}</p>
				</div>
				{#if selectedService.tags?.length}
					<div class="tag-list">
						{#each selectedService.tags as tag}
							<span>{tag}</span>
						{/each}
					</div>
				{/if}
			</div>
			<p class="selection-panel__hint">Tap a service card to update your selection.</p>
		</section>
	{/if}
</main>

<style>
	.services-page {
		padding: 2rem 1.5rem 5.5rem;
		max-width: 960px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.page-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		padding: 1.5rem;
	}

	.page-header h1 {
		margin: 0.2rem 0 0.4rem;
		font-size: 2rem;
		color: #0f172a;
	}

	.page-header .lead {
		margin: 0;
		color: #475569;
		line-height: 1.5;
	}

	.eyebrow {
		text-transform: uppercase;
		color: #2563eb;
		font-size: 0.9rem;
		letter-spacing: 0.08em;
		margin: 0;
	}

	.header-meta {
		display: flex;
		align-items: flex-end;
		gap: 0.35rem;
		color: #475569;
	}

	.header-meta strong {
		font-size: 2.5rem;
		line-height: 1;
		color: #0f172a;
	}

	.selection-panel {
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 1rem;
		padding: 1.25rem 1.5rem;
		box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
	}

	.selection-panel h2 {
		margin: 0 0 1rem;
		font-size: 1.25rem;
	}

	.selection-panel__body {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
		gap: 1rem;
	}

	.selection-panel__label {
		margin: 0;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		color: #94a3b8;
	}

	.selection-panel__value {
		margin: 0.15rem 0 0;
		font-size: 1rem;
		font-weight: 600;
		color: #0f172a;
	}

	.selection-panel__hint {
		margin-top: 1rem;
		color: #64748b;
		font-size: 0.9rem;
	}

	.tag-list {
		grid-column: 1 / -1;
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.tag-list span {
		border-radius: 999px;
		border: 1px solid #cbd5f5;
		padding: 0.25rem 0.75rem;
		font-size: 0.85rem;
		background: #eef2ff;
		color: #3730a3;
	}

	@media (min-width: 768px) {
		.page-header {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}

		.page-header > div:first-child {
			flex: 1;
		}
	}
</style>

