import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const actions: Actions = {
	save: async ({ request }) => {
		const form = await request.formData();
		const text = form.get('text');
		if (typeof text === 'string') {
			// add logic to save updated text to database
			console.log('Supposed to save here but did nothing 😉');
			return { action: 'save', saved: true };
		}
		return fail(400, { text, missing: true });
	}
};

export const load: PageServerLoad = function load({}) {
	// add logic here to pull text from database, using a static string here
	const text = 'Is ChatGPT really neccessary? Lets take a loook.';
	return { text };
};
