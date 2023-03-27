<script lang="ts">
	import SaveIcon from '$lib/components/SaveIcon.svelte';
	import UpdateIcon from '$lib/components/UpdateIcon.svelte';
	import '$lib/styles/fonts.css';
	import '$lib/styles/global.css';
	import { chunkText, grammarCheckChunk, mergeChunkResults } from '$lib/utilities/grammar';
	import type { PageData } from './$types';
	export let data: PageData;

	let {
		text,
		results: { matches }
	} = data;

	async function handleRecheck() {
		try {
			const chunks = chunkText(text);
			const chunkResults = await Promise.all(
				chunks.map(async ({ text, offsetAdjust }) => {
					const { matches } = await grammarCheckChunk({ text, offsetAdjust });
					return { matches };
				})
			);

			const { matches: updatedMatches } = mergeChunkResults(chunkResults);
			matches = [...updatedMatches];
		} catch (error: unknown) {
			console.error(`Error in page load: ${error as string}`);
			throw error;
		}
	}

	$: matchCount = [...matches].length;
</script>

<main>
	<h1>SvelteKit Spelling, Punctuation & Grammar Checker with LanguageTool</h1>
	<form on:submit={handleRecheck}>
		<div class="check-form-header">
			<h2>Checked Text</h2>
			<button type="submit">Re-check<UpdateIcon /></button>
		</div>
		<textarea bind:value={text} name="text" placeholder="Enter text" rows={3} />
	</form>
	<form class="save-form" action="?/save" method="post">
		<span class="status" class:matches={matchCount > 0}> {matches.length} checker results</span>
		<input type="hidden" name="text" value={text} />
		<button type="submit">Save changes<SaveIcon /></button>
	</form>

	{#if matchCount > 0}
		<details>
			<summary>Show checker results</summary>
			<ul>
				{#each matches as { context: { text: contextText, offset, length }, message }}
					<li>
						<h3>{message}</h3>
						<p>
							{contextText.slice(0, offset)}
							<mark>{contextText.slice(offset, offset + length)}</mark>
							{contextText.slice(offset + length)}
						</p>
					</li>
				{/each}
			</ul>
		</details>
	{/if}
</main>

<style>
	form {
		display: flex;
		flex-direction: column;
		margin-bottom: var(--spacing-4);
	}
	button {
		display: inline-flex;
		gap: var(--spacing-2);
		margin-left: auto;
	}

	h2 {
		margin-bottom: var(--spacing-0);
	}

	.status {
		font-size: var(--font-size-2);
	}

	.check-form-header,
	.save-form {
		display: flex;
		flex-direction: row;
		align-items: baseline;
	}

	.matches {
		font-weight: var(--font-weight-bold);
	}

	ul {
		list-style-type: none;
		margin-block: var(--spacing-4);
		padding-left: var(--spacing-0);
	}

	ul h3 {
		margin-bottom: var(--spacing-2);
	}
	li {
		margin-bottom: var(--spacing-4);
	}
	li p {
		padding-left: var(--spacing-4);
	}
</style>
