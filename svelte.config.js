import adapter from '@sveltejs/adapter-auto';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		mdsvex({
			extensions: ['.md'],
			highlight: {
				alias: {
					sh: 'bash',
					ts: 'typescript',
					js: 'javascript',
				},
			},
		}),
	],
	kit: {
		adapter: adapter()
	}
};

export default config;
