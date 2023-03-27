<script>
	import Icon, { addCollection } from '@iconify/svelte';

	export let label = 'Update icon';
	export let colour = 'inherit';
	export let ariaHidden = false;
	export let width = 24;

	addCollection({
		prefix: 'lucide',
		lastModified: 1679466509,
		aliases: {},
		width: 24,
		height: 24,
		icons: {
			'refresh-cw': {
				body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></g>'
			}
		}
	});

	// https://api.iconify.design/lucide.json?icons=refresh-cw
</script>

<Icon role="img" icon="lucide:refresh-cw" {ariaHidden} aria-label={label} color={colour} {width} />
