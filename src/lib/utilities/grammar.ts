import type { LanguageToolsCheckResponse, Results, TextChunk } from '$lib/types';
import { error as svelteKitError } from '@sveltejs/kit';

const CHUNK_LENGTH = 1500;
const LOOKBACK_CHARACTERS = 150;

export function chunkText(text: string): TextChunk[] {
	let start = 0;
	let end = CHUNK_LENGTH;
	const textLength = text.length;
	const chunks: TextChunk[] = [];

	while (start < textLength) {
		// Adjust end to find last full stop but do not go back more than 150 characters
		if (end < textLength) {
			const lastFullStopIndex = Math.max(
				text.slice(start, end).lastIndexOf('. '),
				text.slice(start, end).lastIndexOf('\n\n')
			);
			if (lastFullStopIndex >= 0) {
				end = Math.max(end - start - LOOKBACK_CHARACTERS, lastFullStopIndex) + 1 + start;
			}
		}

		chunks.push({ text: text.slice(start, end), offsetAdjust: start });
		start = end;
		end = start + CHUNK_LENGTH;
	}

	return chunks;
}

export async function grammarCheckChunk({ text, offsetAdjust }: TextChunk): Promise<Results> {
	try {
		const body = new URLSearchParams({
			text,
			language: 'en-GB',
			level: 'picky'
		});
		const response = await fetch('https://api.languagetoolplus.com/v2/check', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Accept: 'application/json'
			},
			body
		});

		return processChunkResponse({ offsetAdjust, response });
	} catch (error: unknown) {
		console.error(`Error in grammarCheckChunk: ${error as string}`);
		throw error;
	}
}

export function mergeChunkResults(results: Results[]): Results {
	const result: Results = {
		matches: []
	};

	return results.reduce(({ matches }, current) => {
		const { matches: currentMatches } = current;
		return {
			matches: [...matches, ...currentMatches]
		};
	}, result);
}

export async function processChunkResponse({
	response,
	offsetAdjust
}: {
	response: Response;
	offsetAdjust: number;
}): Promise<Results> {
	const { ok } = response;
	if (!ok) throw svelteKitError(502, 'Bad Gateway');

	const { matches } = (await response.json()) as LanguageToolsCheckResponse;

	return {
		matches: matches.map(({ context, message, offset }) => ({
			context,
			message,
			offset: offset + offsetAdjust
		}))
	};
}
