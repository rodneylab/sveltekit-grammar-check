import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const actions: Actions = {
	save: async ({ request }) => {
		try {
			const form = await request.formData();
			const text = form.get('text');
			if (typeof text === 'string') {
				// add logic to save updated text to database
				console.log('Supposed to save here but did nothing 😉');
				return { saved: true };
			}
			return fail(400, { missing: 'text', text: '' });
		} catch (error: unknown) {
			console.error(`Error in for action: ${error as string}`);
			return fail(400, { missing: 'text', text: '' });
		}
	},
};

export const load: PageServerLoad = function load() {
	// add logic here to pull text from database, using a static string here
	const text = 'Is ChatGPT really neccessary? Lets take a loook.';
	return { text };
};
