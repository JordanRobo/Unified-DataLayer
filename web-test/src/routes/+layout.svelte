<script>
	import '$lib/app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { getDataLayer } from 'unified-datalayer';

	const dl = getDataLayer();

	dl.init({
		siteInfo: {
			name: "my-site",
	 		experience: "desktop",
	  		currency: "AUD",
	  		division: "myCompany",
	  		domain: "www.my-site.com.au",
	  		env: "prod",
	  		version: "4.2.0"
	 	}
	});

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
