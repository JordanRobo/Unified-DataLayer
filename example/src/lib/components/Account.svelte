<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import { getDataLayer } from 'unified-datalayer';

	const dl = getDataLayer();
	export let accountOpened: boolean;
	let backgroundNode: HTMLElement;

	let logged_in = true;

</script>

<div
	class="fixed w-full max-w-lg right-0 inset-y-0 flex flex-col bg-white z-20"
	use:clickoutside={{ limit: { parent: backgroundNode } }}
	on:clickoutside={() => (accountOpened = false)}
>
	<div class="flex items-center justify-between mx-5 py-4">
		<h1 class="uppercase font-bold text-xl">
			
		</h1>

		<button on:click={() => (accountOpened = !accountOpened)}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-6 h-6"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>

	<hr class="mb-5" />

	{#if logged_in}
		<div class="flex-col overflow-y-auto">
			
		</div>

		<div class="px-10 py-10 grow flex items-end">
			<button
				class="w-full h-12 text-black font-bold transition-colors duration-150 bg-yellow-300 focus:shadow hover:bg-yellow-500"
				on:click={() => ({})}
			>
			Button
			</button>
		</div>
	{:else}
		<div class="flex flex-col justify-center h-full">
			<p class="text-center">Your cart is empty</p>
			<div class="px-10 py-10">
				<a href="/shop/all" target="_self">
					<button
						class="w-full h-12 text-black font-bold transition-colors duration-150 bg-yellow-300 focus:shadow hover:bg-yellow-500"
					>
						Start shopping
					</button>
				</a>
			</div>
		</div>
	{/if}
</div>

<div bind:this={backgroundNode} class="fixed inset-0 bg-black opacity-40 z-[15]" />
