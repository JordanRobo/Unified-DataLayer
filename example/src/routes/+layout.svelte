<script>
	import '$lib/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getDataLayer } from 'unified-datalayer';

	const dl = getDataLayer();

	let info = {
		siteInfo: {
			name: "DataLayer Example",
	 		experience: "desktop",
	  		currency: "AUD",
	  		division: "DLE",
	  		domain: "www.my-site.com.au",
	  		env: "prod",
	  		version: "1.0.0"
	 	}
	}

	dl.init(info);

</script>

<svelte:head>
	<meta
		name="description"
		content="E-commerce solution built with SvelteKit, a headless CMS integration, uses Stripe for payments, providing better performance and faster development time"
	/>
</svelte:head>

<Navbar />
<slot />
<Footer />
