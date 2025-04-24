<script lang="ts">
	import ImageGallery from '$lib/components/ImageGallery.svelte';
	import { addToCart } from '$lib/stores';
	import type { CartItem } from '$lib/stores';
	import ProductDetails from '$lib/components/ProductDetails.svelte';
	import ProductItem from '$lib/components/ProductItem.svelte';
	import { afterNavigate } from '$app/navigation';
	import { getDataLayer } from 'unified-datalayer';
	import type { CartProductData, ProductData } from 'unified-datalayer/dist/types';

	const dl = getDataLayer();

	export let data: any;
	let original_data = data;
	let quantity = 1;
	let selected_size: any = null;
	let available_sizes = ["US 9", "US 10", "US 11", "US 12"];

	let product: ProductData = {
		brand: data.brand,
		category: [],
		child_sku: data.sku,
		color: data.color,
		full_price: data.price,
		gender: data.gender,
		listed_price: data.sale_price !== 0 ? data.sale_price : data.price,
		name: data.name,
		parent_category: data.parent_category,
		parent_sku: data.parent_sku,
		sku_available: data.in_stock,
		...data
	};

	$: {
		if (original_data !== data) {
			product = { brand: data.brand, category: [], child_sku: data.sku, color: data.color, full_price: data.price, gender: data.gender, listed_price: data.sale_price !== 0 ? data.sale_price : data.price, name: data.name, parent_category: data.parent_category, parent_sku: data.parent_sku, sku_available: data.in_stock, ...data };
			product.images = product.images;
			quantity = 1;
			original_data = data;
			selected_size = null;
		}
	}

	function selectSize(size: string){
		selected_size = size;
		dl.pdp.sizeSelect(selected_size);	
	}

	function sendToDataLayer() {
		let cart_item: CartProductData = {
			qty: 1,
			sku_by_size: `${product.child_sku}_${selected_size}`,
			size: selected_size,
			...product
		};

		dl.cart.add(cart_item);
	}

	function prepareToCart() {
		let item: CartItem = {
			id: product.id,
			slug: product.slug,
			thumbnail: `${product.images[0]}?thumb=100x100`,
			price: product.price,
			salePrice: product.sale_price,
			quantity: quantity,
			sku_by_size: `${product.child_sku}_${selected_size}`,
			size: selected_size,
			...product
		};

		addToCart(item);
		sendToDataLayer();
	}

	afterNavigate(() => {
		dl.pdp.view(product);
	})
</script>

<svelte:head>
	<title>{product.name} | DataLayer Example</title>
</svelte:head>

<div class="flex flex-col mx-3 py-10 gap-5 lg:mx-10 lg:flex-row lg:gap-8">
	<div class="basis-1/2 px-8">
		<ImageGallery productId={product.id} images={product.images} alt_text={product.name} />
	</div>
	<div class="basis-1/2 flex flex-col gap-8 px-8">
		<h1 class="font-extrabold text-4xl mt-3">{product.name}</h1>
		<div class="flex items-end gap-2">
			{#if product.sale_price === 0}
				<span class="text-3xl">${product.price}</span>
			{:else}
				<span class="text-3xl text-red-600">${product.sale_price}</span>
				<span class="text-xl text-gray-600 line-through">${product.price}</span>
			{/if}
		</div>

		<div class="flex flex-col gap-2">
			<p>Description</p>
			<p class="text-gray-600">
				{product.description}
			</p>
		</div>

		<div class="flex flex-row gap-2">
    		{#each available_sizes as size}
        		<button class="h-12 px-6 text-black font-bold transition-colors duration-150 bg-yellow-300 focus:shadow hover:bg-yellow-500" style:opacity={selected_size === size ? "1" : "0.6"} on:click={() => selectSize(size)}>{size}</button>
    		{/each}
		</div>
		<button
			class="w-full h-12 px-6 text-black font-bold transition-colors duration-150 bg-yellow-300 focus:shadow hover:bg-yellow-500"
			on:click={() => prepareToCart()}
		>
			Add to cart
		</button>
	</div>
</div>

<div class="flex flex-col-reverse px-10 gap-20 lg:flex-row">
	{#if product.details.length !== 0}
		<ProductDetails source={product.details} />
	{/if}

	{#if product.related_products.length !== 0}
		<div class="basis-1/2">
			<p class="font-medium text-lg uppercase">Related</p>

			<div class="grid gap-12 pr-5 py-5 grid-cols-2">
				{#each product.expand.related_products as relatedProduct (relatedProduct.id)}
					<ProductItem
						title={relatedProduct.name}
						image="https://pb.jordanrobo.xyz/api/files/{relatedProduct.collectionName}/{relatedProduct.id}/{relatedProduct
							.images[0]}"
						hoverImage={relatedProduct.images.length > 1
							? `https://pb.jordanrobo.xyz/api/files/${relatedProduct.collectionName}/${relatedProduct.id}/${relatedProduct.images[1]}`
							: ''}
						price={relatedProduct.price}
						salePrice={relatedProduct.sale_price}
						link="/products/{relatedProduct.slug}"
					/>
				{/each}
			</div>
		</div>
	{/if}
</div>
