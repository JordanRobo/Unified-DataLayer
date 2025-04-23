<script lang="ts">
	import ProductItem from '$lib/components/ProductItem.svelte';
	import AccordionItem from '$lib/components/AccordionItem.svelte';
	import { afterNavigate } from '$app/navigation';
	import { getDataLayer } from 'unified-datalayer';

	const dl = getDataLayer();

	const handleProductListView = () => {
		dl.plp.view(products);
	};

	export let data: any;
	$: products = data.items;

	afterNavigate(() => {
		handleProductListView();
	});
</script>

<svelte:head>
	<title>DataLayer Example</title>
</svelte:head>

<div class="flex justify-center items-center gap-6 m-auto p-5 flex-wrap">
	<a class="hover:underline underline-offset-4" href="/shop/all">All</a>
	<a class="hover:underline underline-offset-4" href="/shop/mens">Mens</a>
	<a class="hover:underline underline-offset-4" href="/shop/womens">Womens</a>
	<a class="hover:underline underline-offset-4" href="/shop/asics">Asics</a>
	<a class="hover:underline underline-offset-4" href="/shop/new-balance">New Balance</a>
</div>

<hr />

<div class="flex flex-col py-8 px-3 lg:flex-row md:px-20">
	<div class="mg-0 basis-1/6 flex flex-col pb-5 lg:mx-10">
		<h1 class="uppercase font-bold text-xl pb-4">FILTERS</h1>
		<hr />
		<AccordionItem name="Price">
			<p>TODO</p>
		</AccordionItem>
		<hr />
		<AccordionItem name="Product type">
			<p>TODO</p>
		</AccordionItem>
		<hr />
		<AccordionItem name="Availability">
			<p>TODO</p>
		</AccordionItem>
		<hr />
	</div>
	<div class="basis-5/6 flex flex-col">
		<div class="flex justify-between pb-4">
			<p>{products.length} products</p>
			<div>
				<span class="text-gray-700">Sort by</span>
				<button>New</button>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-5 md:grid-cols-3">
			{#each products as product}
				<ProductItem
					title={product.name}
					image="https://pb.jordanrobo.xyz/api/files/{product.collectionName}/{product.id}/{product
						.images[0]}"
					hoverImage={product.images.length > 1
						? `https://pb.jordanrobo.xyz/api/files/${product.collectionName}/${product.id}/${product.images[1]}`
						: ''}
					price={product.price}
					salePrice={product.sale_price}
					link="/products/{product.slug}"
				/>
			{/each}
		</div>
	</div>
</div>
