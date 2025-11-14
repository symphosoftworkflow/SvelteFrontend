<script>
	// Services page
</script>

<main class="page-container">
	<h1>Services</h1>
	<div class="content">
		<div class="service-card">
			<h2>Swedish Massage</h2>
			<p>Relaxing full-body massage using long, flowing strokes.</p>
			<span class="price">$80/hour</span>
		</div>
		<div class="service-card">
			<h2>Deep Tissue Massage</h2>
			<p>Intense pressure to target muscle knots and tension.</p>
			<span class="price">$100/hour</span>
		</div>
		<div class="service-card">
			<h2>Hot Stone Massage</h2>
			<p>Therapeutic massage using heated stones for deep relaxation.</p>
			<span class="price">$120/hour</span>
		</div>
		<div class="service-card">
			<h2>Aromatherapy Massage</h2>
			<p>Massage combined with essential oils for enhanced relaxation.</p>
			<span class="price">$90/hour</span>
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

	.service-card {
		background: white;
		border: 1px solid #e0e0e0;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.service-card h2 {
		font-size: 1.25rem;
		margin-bottom: 0.5rem;
		color: #007bff;
	}

	.service-card p {
		color: #666;
		margin-bottom: 0.75rem;
		line-height: 1.5;
	}

	.price {
		font-size: 1.1rem;
		font-weight: 600;
		color: #28a745;
	}
</style>

