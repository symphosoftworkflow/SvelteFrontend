import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const base = process.env.BASE_PATH ? process.env.BASE_PATH.replace(/\/$/, '') : '';
const assets =
	process.env.ASSETS_PATH && /^https?:\/\//.test(process.env.ASSETS_PATH)
		? process.env.ASSETS_PATH.replace(/\/$/, '')
		: undefined;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		paths: {
			base,
			assets,
			relative: false
		},
		prerender: {
			entries: ['*']
		}
	}
};

export default config;