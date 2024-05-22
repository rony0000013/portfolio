/** @type {import('tailwindcss').Config} */
const { addDynamicIconSelectors } = require('@iconify/tailwind');

export default {
	content: [
		"./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
		"./src/styles/globals.css",
		'./node_modules/preline/preline.js',
	],
	theme: {
		extend: {
			gridTemplateColumns: {
			  // Simple 16 column grid
			  '30': 'repeat(30, minmax(0, 1fr))',
			}
		},
	},
	important: false,
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-animate"),
		addDynamicIconSelectors(),
		require('daisyui'),
		require('preline/plugin'),
	],
	daisyui: {
		themes: ["light", "dark", "cupcake", "cyberpunk", "aqua", "valentine", "retro"],
		base: true, 
		styled: true,  
		utils: true, 
		prefix: "", 
		logs: false, 
	},
};
