<script lang="ts">
	export let productId: string;
	export let images: any;
	export let alt_text: string;

	let original_image = images[0];

	let active_image = images[0];

	$: {
		if (original_image !== images[0]) {
			active_image = images[0];
			original_image = images[0];
		}
	}

	function setImage(src: string) {
		active_image = src;
		images = images;
	}

	function generateStyle(src: string) {
		return src === active_image ? 'outline outline-2' : '';
	}
</script>

<div class="flex flex-col gap-5">
	<img
		class="w-full"
		src="https://pb.jordanrobo.xyz/api/files/products/{productId}/{active_image}"
		width="700"
		height="700"
		alt={alt_text}
	/>

	<div class="grid gap-3 grid-cols-2 lg:grid-cols-4">
		{#each images as image}
			<button on:click={() => setImage(image)}>
				<img
					class={generateStyle(image)}
					src="https://pb.jordanrobo.xyz/api/files/products/{productId}/{image}"
					width="700"
					height="700"
					alt={alt_text}
				/>
			</button>
		{/each}
	</div>
</div>
