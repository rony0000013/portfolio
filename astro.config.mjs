import mdx from "@astrojs/mdx";
import partytown from "@astrojs/partytown";
import sitemap from "@astrojs/sitemap";
import solidJs from "@astrojs/solid-js";
import compress from "@playform/compress";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, passthroughImageService } from "astro/config";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
	site: "https://rounak-sen.vercel.app",
	image: {
		service: passthroughImageService(),
		remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
	},
	markdown: {},
	vite: {
		plugins: [tailwindcss()],
		assetsInclude: ["**/*.lottie"],
		build: {
			rollupOptions: {
				onwarn(warning, warn) {
					if (warning.code === "EVAL" && warning.id?.includes("lottie")) return;
					warn(warning);
				},
			},
		},
	},
	integrations: [
		solidJs(),
		icon({
			iconDir: "src/assets/icons",
		}),
		mdx(),
		sitemap(),
		partytown(),
		compress({
			CSS: true,
			SVG: true,
			HTML: {
				"html-minifier-terser": {
					removeComments: true,
					removeAttributeQuotes: false,
				},
			},
			JavaScript: true,
			Image: false,
		}),
	],
});
