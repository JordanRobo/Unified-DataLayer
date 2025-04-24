import type { Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle = (async ({ event, resolve }) => {
	event.locals.pb = new PocketBase('https://pb.jordanrobo.xyz');

	const response = await resolve(event);
	return response;
}) satisfies Handle;
