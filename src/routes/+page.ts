import { chunkText, grammarCheckChunk, mergeChunkResults } from '$lib/utilities/grammar';
import type { PageLoad } from './$types';

export const load: PageLoad = async function load({ data, fetch }) {
	// check grammar
	try {
		const { text } = data;
		const chunks = chunkText(text);

		const chunkResults = await Promise.all(
			chunks.map(async ({ text, offsetAdjust }) => {
				const { matches } = await grammarCheckChunk({ text, offsetAdjust });
				return { matches };
			})
		);

		const results = mergeChunkResults(chunkResults);

		return {
			results,
			text
		};
	} catch (error: unknown) {
		console.error(`Error in page load: ${error as string}`);
		throw error;
	}
};
